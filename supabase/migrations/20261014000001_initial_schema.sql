-- ============================================================================
-- MFGOS: Configurable Manufacturing Operations System
-- Migration: 20261014000001_initial_schema.sql
-- Description: Core schema, identity, RBAC, master data, workflows & RLS
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean schema namespace
-- Custom types
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'SUPER_ADMIN',
        'PROD_MGR',
        'PROD_OPERATOR',
        'WHS_MGR',
        'QC_INSPECTOR',
        'PURCHASE_MGR',
        'SALES_MGR'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE item_type_enum AS ENUM (
        'RAW_MATERIAL',
        'FINISHED_GOOD',
        'WIP_ASSEMBLY',
        'CONSUMABLE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE movement_type_enum AS ENUM (
        'RECEIPT',
        'ISSUE',
        'TRANSFER',
        'ADJUSTMENT',
        'RETURN',
        'SCRAP'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prod_order_status_enum AS ENUM (
        'DRAFT',
        'PLANNED',
        'RELEASED',
        'IN_PROGRESS',
        'QUALITY_HOLD',
        'COMPLETED',
        'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 1. Organizations & Plants
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    industry_type VARCHAR(100) NOT NULL DEFAULT 'Precision Engineering',
    logo_url TEXT,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'USA',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_plant_org_code UNIQUE (organization_id, code)
);

-- ----------------------------------------------------------------------------
-- 2. Profiles & RBAC
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
    role user_role_type NOT NULL DEFAULT 'PROD_OPERATOR',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_org UNIQUE (organization_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 3. Master Data: Units of Measure, Categories, Items
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS units_of_measure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(15) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Count', -- Weight, Volume, Length, Count
    is_base_unit BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_cat_org_code UNIQUE (organization_id, code)
);

CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    item_type item_type_enum NOT NULL,
    uom_id UUID NOT NULL REFERENCES units_of_measure(id),
    safety_stock NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    reorder_point NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    standard_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    lead_time_days INT NOT NULL DEFAULT 3,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_item_org_sku UNIQUE (organization_id, sku)
);

-- ----------------------------------------------------------------------------
-- 4. Warehouses & Storage
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    is_production_floor BOOLEAN NOT NULL DEFAULT FALSE,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_wh_org_code UNIQUE (organization_id, code)
);

CREATE TABLE IF NOT EXISTS warehouse_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    aisle VARCHAR(20) NOT NULL,
    rack VARCHAR(20) NOT NULL,
    bin VARCHAR(20) NOT NULL,
    code VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. Business Partners: Suppliers & Customers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    lead_time_days INT DEFAULT 7,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_supplier_org_code UNIQUE (organization_id, code)
);

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    shipping_address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_customer_org_code UNIQUE (organization_id, code)
);

-- ----------------------------------------------------------------------------
-- 6. Work Centers & Standard Operations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    capacity_hours_per_day NUMERIC(5, 2) NOT NULL DEFAULT 8.0,
    hourly_cost NUMERIC(10, 2) NOT NULL DEFAULT 45.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_wc_org_code UNIQUE (organization_id, code)
);

CREATE TABLE IF NOT EXISTS operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_work_center_id UUID REFERENCES work_centers(id) ON DELETE SET NULL,
    standard_setup_time_mins INT NOT NULL DEFAULT 15,
    standard_cycle_time_mins INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_op_org_code UNIQUE (organization_id, code)
);

-- ----------------------------------------------------------------------------
-- 7. Inventory Ledger (Stock Movements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT,
    location_id UUID REFERENCES warehouse_locations(id) ON DELETE SET NULL,
    movement_type movement_type_enum NOT NULL,
    quantity NUMERIC(12, 4) NOT NULL,
    reference_type VARCHAR(50), -- PURCHASE_ORDER, PROD_ORDER, MANUAL_ADJUSTMENT, TRANSFER
    reference_id VARCHAR(100),
    batch_lot_number VARCHAR(100),
    remarks TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for high performance aggregation
CREATE INDEX IF NOT EXISTS idx_stock_movements_org_item_wh 
ON stock_movements (organization_id, item_id, warehouse_id);

CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at 
ON stock_movements (created_at DESC);

-- Current Inventory Materialized/Cached Balances for instant reads
CREATE TABLE IF NOT EXISTS item_warehouse_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    current_quantity NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    allocated_quantity NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_item_wh UNIQUE (organization_id, item_id, warehouse_id),
    CONSTRAINT chk_non_negative_balance CHECK (current_quantity >= 0)
);

-- ----------------------------------------------------------------------------
-- 8. Configurable Workflow Engine
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    industry_preset VARCHAR(100) DEFAULT 'Discrete Machining',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_workflow_org_code UNIQUE (organization_id, code)
);

CREATE TABLE IF NOT EXISTS workflow_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    stage_code VARCHAR(50) NOT NULL,
    stage_name VARCHAR(255) NOT NULL,
    sequence_order INT NOT NULL,
    required_role user_role_type NOT NULL DEFAULT 'PROD_OPERATOR',
    requires_qc BOOLEAN NOT NULL DEFAULT FALSE,
    estimated_duration_hours NUMERIC(5, 2) DEFAULT 2.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_stage_wf_code UNIQUE (workflow_id, stage_code)
);

CREATE TABLE IF NOT EXISTS workflow_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    from_stage_id UUID NOT NULL REFERENCES workflow_stages(id) ON DELETE CASCADE,
    to_stage_id UUID NOT NULL REFERENCES workflow_stages(id) ON DELETE CASCADE,
    is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9. Production Orders & History
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS production_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
    order_number VARCHAR(100) NOT NULL,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT,
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE RESTRICT,
    current_stage_id UUID REFERENCES workflow_stages(id) ON DELETE RESTRICT,
    planned_quantity NUMERIC(12, 4) NOT NULL,
    completed_quantity NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    rejected_quantity NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    status prod_order_status_enum NOT NULL DEFAULT 'PLANNED',
    priority INT NOT NULL DEFAULT 1, -- 1=Normal, 2=High, 3=Urgent
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_prod_order_num UNIQUE (organization_id, order_number)
);

CREATE TABLE IF NOT EXISTS workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_order_id UUID NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
    from_stage_id UUID REFERENCES workflow_stages(id),
    to_stage_id UUID REFERENCES workflow_stages(id),
    quantity_passed NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    quantity_rejected NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    operator_id UUID REFERENCES profiles(id),
    cycle_time_minutes INT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10. Audit Logs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11. Row-Level Security (RLS) Helper Functions & Policies
-- ----------------------------------------------------------------------------

-- Helper function: get list of organization IDs user belongs to
CREATE OR REPLACE FUNCTION current_user_org_ids()
RETURNS SETOF UUID AS $$
BEGIN
    RETURN QUERY
    SELECT organization_id
    FROM organization_members
    WHERE user_id = auth.uid() AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Enable RLS on core tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE units_of_measure ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_warehouse_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Dynamic Tenant Isolation Policies
CREATE POLICY rls_org_isolation ON organizations
    FOR ALL USING (id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_plants_isolation ON plants
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_profiles_isolation ON profiles
    FOR ALL USING (id = auth.uid() OR id IN (
        SELECT user_id FROM organization_members WHERE organization_id IN (SELECT current_user_org_ids())
    ));

CREATE POLICY rls_org_members_isolation ON organization_members
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_uom_isolation ON units_of_measure
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_categories_isolation ON product_categories
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_items_isolation ON items
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_warehouses_isolation ON warehouses
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_suppliers_isolation ON suppliers
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_customers_isolation ON customers
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_work_centers_isolation ON work_centers
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_operations_isolation ON operations
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_stock_movements_isolation ON stock_movements
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_item_warehouse_stock_isolation ON item_warehouse_stock
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_workflows_isolation ON workflows
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_prod_orders_isolation ON production_orders
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));

CREATE POLICY rls_audit_logs_isolation ON audit_logs
    FOR ALL USING (organization_id IN (SELECT current_user_org_ids()));
