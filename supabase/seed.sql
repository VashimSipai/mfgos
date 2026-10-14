-- ============================================================================
-- MFGOS: Seed Data
-- Description: Demonstration Seed Data for Apex Precision Dynamics
-- ============================================================================

-- 1. Create Organization
INSERT INTO organizations (id, name, code, industry_type, currency)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Apex Precision Dynamics Ltd.',
    'APEX',
    'Precision Mechanical Engineering',
    'USD'
) ON CONFLICT (code) DO NOTHING;

-- 2. Create Plant
INSERT INTO plants (id, organization_id, name, code, address, city, country)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'North Precision Machining Facility',
    'PLT-01',
    '740 Industrial Parkway, Sector 9',
    'Chicago',
    'USA'
) ON CONFLICT (organization_id, code) DO NOTHING;

-- 3. Units of Measure
INSERT INTO units_of_measure (id, organization_id, name, symbol, category)
VALUES 
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Kilogram', 'kg', 'Weight'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Piece', 'pcs', 'Count'),
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Meter', 'm', 'Length'),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Liter', 'L', 'Volume')
ON CONFLICT DO NOTHING;

-- 4. Categories
INSERT INTO product_categories (id, organization_id, name, code, description)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Raw Metals & Bar Stock', 'CAT-METALS', 'Steel rods, billets, and aluminum extrusions'),
    ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Bearings & Fasteners', 'CAT-HARDWARE', 'Commercial grade bearings, bolts, and pins'),
    ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Finished Gears & Transmissions', 'CAT-FINISHED', 'Fully machined and heat treated power transmission components')
ON CONFLICT (organization_id, code) DO NOTHING;

-- 5. Items (Products & Raw Materials)
INSERT INTO items (id, organization_id, category_id, sku, name, description, item_type, uom_id, safety_stock, reorder_point, standard_cost)
VALUES
    -- Finished Product
    ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'FG-GEAR-01', 'Industrial Helical Gear (Module 4, 32-Teeth)', 'Hardened alloy steel spur gear for industrial speed reducers', 'FINISHED_GOOD', 'c0000000-0000-0000-0000-000000000002', 30.0, 50.0, 48.50),
    
    -- Raw Material: Steel
    ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'RM-STEEL-4140', 'AISI 4140 Chrome-Moly Round Bar (Dia 120mm)', 'High-tensile alloy steel bar stock for gear turning', 'RAW_MATERIAL', 'c0000000-0000-0000-0000-000000000001', 200.0, 400.0, 4.25),
    
    -- Raw Material: Bearings
    ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'RM-BRG-6205', 'Deep Groove Ball Bearing 6205-2RS', 'Sealed metric bearing 25x52x15mm', 'RAW_MATERIAL', 'c0000000-0000-0000-0000-000000000002', 80.0, 150.0, 6.80),
    
    -- Raw Material: Bolts
    ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'RM-BOLT-M8', 'M8 x 35mm Grade 10.9 Flanged Hex Bolt', 'High tensile zinc-plated assembly fasteners', 'RAW_MATERIAL', 'c0000000-0000-0000-0000-000000000002', 300.0, 600.0, 0.42)
ON CONFLICT (organization_id, sku) DO NOTHING;

-- 6. Warehouses
INSERT INTO warehouses (id, organization_id, plant_id, name, code, is_production_floor)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Central Raw Materials Yard', 'WH-RAW-01', FALSE),
    ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Machining Floor WIP Buffer', 'WH-WIP-01', TRUE),
    ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Finished Goods Distribution Store', 'WH-FG-01', FALSE)
ON CONFLICT (organization_id, code) DO NOTHING;

-- 7. Suppliers & Customers
INSERT INTO suppliers (id, organization_id, name, code, contact_person, email, phone, lead_time_days)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Continental Alloy Steels Ltd.', 'SUP-STEEL', 'Marcus Vance', 'orders@continentalalloys.com', '+1-312-555-0192', 5),
    ('10000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'SKF & Fastener Direct Group', 'SUP-FASTEN', 'Elena Rostova', 'sales@skffasteners.com', '+1-800-555-4890', 3)
ON CONFLICT (organization_id, code) DO NOTHING;

INSERT INTO customers (id, organization_id, name, code, contact_person, email, shipping_address)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Caterpillar Transmission Systems', 'CUST-CAT', 'Robert Chen', 'supplychain@cat-drivetrain.com', 'Plant 7, Peoria, Illinois, USA')
ON CONFLICT (organization_id, code) DO NOTHING;

-- 8. Work Centers & Operations
INSERT INTO work_centers (id, organization_id, plant_id, code, name, capacity_hours_per_day, hourly_cost)
VALUES
    ('30000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'WC-CNC-01', 'Haas ST-30Y CNC Turning Center', 16.0, 68.00),
    ('30000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'WC-HOB-01', 'Liebherr LC-280 CNC Gear Hobber', 16.0, 92.00),
    ('30000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'WC-CMM-01', 'Zeiss Contura CMM Inspection Station', 8.0, 75.00)
ON CONFLICT (organization_id, code) DO NOTHING;

-- 9. Workflows (The Configurable Manufacturing Engine)
INSERT INTO workflows (id, organization_id, name, code, description, industry_preset)
VALUES
    ('40000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Precision Helical Gear Routing', 'WF-GEAR-PRECISION', 'Standard 5-stage precision turning, gear hobbing, case hardening, and CMM quality gate.', 'Precision Mechanical Engineering'),
    ('40000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Modular Furniture Assembly Flow', 'WF-FURNITURE-01', 'Timber cutting, joint routing, spray coating, and assembly for contract furniture.', 'Commercial Wood Furniture')
ON CONFLICT (organization_id, code) DO NOTHING;

-- Workflow Stages for Precision Gear
INSERT INTO workflow_stages (id, workflow_id, stage_code, stage_name, sequence_order, required_role, requires_qc, estimated_duration_hours)
VALUES
    ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'STAGE_PREP', 'Material Preparation & Bar Sawing', 1, 'WHS_MGR', FALSE, 1.0),
    ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'STAGE_TURNING', 'CNC Turning & Face Grooving', 2, 'PROD_OPERATOR', FALSE, 3.5),
    ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'STAGE_HOBBING', 'High-Speed Gear Teeth Hobbing', 3, 'PROD_OPERATOR', FALSE, 4.0),
    ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'STAGE_QC_GATE', 'CMM Quality Gate & Profile Inspection', 4, 'QC_INSPECTOR', TRUE, 1.5),
    ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'STAGE_COMPLETED', 'Finished Goods Stock Transfer', 5, 'WHS_MGR', FALSE, 0.5)
ON CONFLICT (workflow_id, stage_code) DO NOTHING;

-- 10. Initial Stock Movements (Demonstration Stock)
INSERT INTO stock_movements (organization_id, item_id, warehouse_id, movement_type, quantity, reference_type, reference_id, remarks)
VALUES
    -- 550 kg Alloy Steel received from Continental
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'RECEIPT', 550.0000, 'PURCHASE_RECEIPT', 'GRN-2026-081', 'PO-9843 Initial heat batch inspection passed'),
    
    -- 240 pcs Bearings received
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 'RECEIPT', 240.0000, 'PURCHASE_RECEIPT', 'GRN-2026-082', 'Batch 2026-A1 bearings accepted'),
    
    -- 1200 pcs Bolts received
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', 'RECEIPT', 1200.0000, 'PURCHASE_RECEIPT', 'GRN-2026-083', 'High-tensile zinc plated M8 bolts'),

    -- 45 pcs Finished Gears in finished stock
    ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003', 'RECEIPT', 45.0000, 'INITIAL_STOCK', 'PROD-INIT-001', 'Opening finished goods balance');
