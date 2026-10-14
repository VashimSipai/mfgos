-- ============================================================================
-- MFGOS: Configurable Manufacturing Operations System
-- Migration: 20261014000002_inventory_ledger_functions.sql
-- Description: Transaction-safe inventory ledger, atomic movement triggers,
--              non-negative stock invariants, and stock transfer RPCs.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Trigger Function: Maintain Item Warehouse Stock and Prevent Negative Stock
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_apply_stock_movement()
RETURNS TRIGGER AS $$
DECLARE
    v_current_qty NUMERIC(12, 4) := 0.0000;
    v_new_qty NUMERIC(12, 4) := 0.0000;
BEGIN
    -- Lock or get current balance record
    SELECT current_quantity 
    INTO v_current_qty
    FROM item_warehouse_stock
    WHERE organization_id = NEW.organization_id
      AND item_id = NEW.item_id
      AND warehouse_id = NEW.warehouse_id
    FOR UPDATE;

    -- If no record exists yet, initialize it
    IF NOT FOUND THEN
        v_current_qty := 0.0000;
        
        -- If initial movement is negative, reject immediately
        IF NEW.quantity < 0 THEN
            RAISE EXCEPTION 'ERR_INSUFFICIENT_STOCK: Cannot issue % units of item % from empty warehouse %', 
                ABS(NEW.quantity), NEW.item_id, NEW.warehouse_id
                USING ERRCODE = '23514';
        END IF;

        INSERT INTO item_warehouse_stock (
            organization_id,
            item_id,
            warehouse_id,
            current_quantity,
            last_updated
        ) VALUES (
            NEW.organization_id,
            NEW.item_id,
            NEW.warehouse_id,
            NEW.quantity,
            now()
        );
    ELSE
        -- Calculate new quantity
        v_new_qty := v_current_qty + NEW.quantity;

        -- Check non-negative invariant
        IF v_new_qty < 0 THEN
            RAISE EXCEPTION 'ERR_INSUFFICIENT_STOCK: Available stock is %, but attempted withdrawal was % (Deficit: %)', 
                v_current_qty, ABS(NEW.quantity), ABS(v_new_qty)
                USING ERRCODE = '23514';
        END IF;

        -- Update cached balance
        UPDATE item_warehouse_stock
        SET current_quantity = v_new_qty,
            last_updated = now()
        WHERE organization_id = NEW.organization_id
          AND item_id = NEW.item_id
          AND warehouse_id = NEW.warehouse_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Trigger on stock_movements
DROP TRIGGER IF EXISTS trg_stock_movement_apply ON stock_movements;
CREATE TRIGGER trg_stock_movement_apply
AFTER INSERT ON stock_movements
FOR EACH ROW
EXECUTE FUNCTION trg_apply_stock_movement();

-- ----------------------------------------------------------------------------
-- RPC: Execute Stock Transfer Between Two Warehouses Atomically
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION execute_stock_transfer(
    p_organization_id UUID,
    p_item_id UUID,
    p_source_warehouse_id UUID,
    p_dest_warehouse_id UUID,
    p_quantity NUMERIC(12, 4),
    p_reference_id VARCHAR(100),
    p_remarks TEXT,
    p_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_out_id UUID;
    v_in_id UUID;
BEGIN
    IF p_quantity <= 0 THEN
        RAISE EXCEPTION 'Transfer quantity must be strictly positive';
    END IF;

    IF p_source_warehouse_id = p_dest_warehouse_id THEN
        RAISE EXCEPTION 'Source and destination warehouses cannot be identical';
    END IF;

    -- 1. Deduct from Source Warehouse (Movement: TRANSFER, Negative Qty)
    INSERT INTO stock_movements (
        organization_id,
        item_id,
        warehouse_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        remarks,
        created_by
    ) VALUES (
        p_organization_id,
        p_item_id,
        p_source_warehouse_id,
        'TRANSFER',
        -p_quantity,
        'TRANSFER_OUT',
        p_reference_id,
        COALESCE(p_remarks, 'Inter-warehouse transfer out'),
        p_user_id
    ) RETURNING id INTO v_out_id;

    -- 2. Add to Destination Warehouse (Movement: TRANSFER, Positive Qty)
    INSERT INTO stock_movements (
        organization_id,
        item_id,
        warehouse_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        remarks,
        created_by
    ) VALUES (
        p_organization_id,
        p_item_id,
        p_dest_warehouse_id,
        'TRANSFER',
        p_quantity,
        'TRANSFER_IN',
        p_reference_id,
        COALESCE(p_remarks, 'Inter-warehouse transfer in'),
        p_user_id
    ) RETURNING id INTO v_in_id;

    RETURN jsonb_build_object(
        'success', true,
        'out_movement_id', v_out_id,
        'in_movement_id', v_in_id,
        'transferred_quantity', p_quantity
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- RPC: Execute Physical Count Stock Adjustment
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION execute_stock_adjustment(
    p_organization_id UUID,
    p_item_id UUID,
    p_warehouse_id UUID,
    p_counted_quantity NUMERIC(12, 4),
    p_reason TEXT,
    p_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_current_qty NUMERIC(12, 4) := 0.0000;
    v_diff_qty NUMERIC(12, 4);
    v_movement_id UUID;
BEGIN
    IF p_counted_quantity < 0 THEN
        RAISE EXCEPTION 'Counted inventory quantity cannot be negative';
    END IF;

    -- Get current recorded balance
    SELECT COALESCE(current_quantity, 0.0000)
    INTO v_current_qty
    FROM item_warehouse_stock
    WHERE organization_id = p_organization_id
      AND item_id = p_item_id
      AND warehouse_id = p_warehouse_id;

    v_diff_qty := p_counted_quantity - v_current_qty;

    IF v_diff_qty = 0 THEN
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Physical count matches recorded inventory. No adjustment needed.',
            'variance', 0
        );
    END IF;

    -- Record Adjustment movement
    INSERT INTO stock_movements (
        organization_id,
        item_id,
        warehouse_id,
        movement_type,
        quantity,
        reference_type,
        reference_id,
        remarks,
        created_by
    ) VALUES (
        p_organization_id,
        p_item_id,
        p_warehouse_id,
        'ADJUSTMENT',
        v_diff_qty,
        'PHYSICAL_AUDIT',
        'AUDIT-' || to_char(now(), 'YYYYMMDD-HH24MI'),
        COALESCE(p_reason, 'Discrepancy resolved via physical cycle count audit'),
        p_user_id
    ) RETURNING id INTO v_movement_id;

    RETURN jsonb_build_object(
        'success', true,
        'movement_id', v_movement_id,
        'previous_quantity', v_current_qty,
        'new_quantity', p_counted_quantity,
        'variance', v_diff_qty
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
