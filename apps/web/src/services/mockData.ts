import { 
  Organization, 
  Plant, 
  UserProfile, 
  Item, 
  Warehouse, 
  WarehouseStock, 
  StockMovement, 
  WorkCenter, 
  Supplier, 
  Customer, 
  Operation, 
  Workflow 
} from '../types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-apex-01',
    name: 'Apex Precision Dynamics Ltd.',
    code: 'APEX',
    industry_type: 'Precision Mechanical Engineering',
    currency: 'USD'
  },
  {
    id: 'org-nordic-02',
    name: 'Nordic Timber Crafts & Furniture',
    code: 'NORDIC',
    industry_type: 'Commercial Furniture Manufacturing',
    currency: 'EUR'
  }
];

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 'plt-01',
    organization_id: 'org-apex-01',
    name: 'North Precision Machining Facility',
    code: 'PLT-01',
    city: 'Chicago, IL',
    country: 'USA'
  },
  {
    id: 'plt-02',
    organization_id: 'org-nordic-02',
    name: 'Gothenburg Woodworking Plant',
    code: 'PLT-SWE-01',
    city: 'Gothenburg',
    country: 'Sweden'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-vashim-01',
  email: 'admin@mfgos.io',
  full_name: 'Vashim Sipai',
  role: 'SUPER_ADMIN',
  avatar_url: ''
};

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-gear-01',
    sku: 'FG-GEAR-01',
    name: 'Industrial Helical Gear (Module 4, 32T)',
    description: 'Hardened chrome-moly spur gear for industrial speed reducers',
    item_type: 'FINISHED_GOOD',
    uom: 'pcs',
    category: 'Finished Transmissions',
    safety_stock: 30,
    reorder_point: 50,
    standard_cost: 48.50,
    lead_time_days: 2,
    is_active: true
  },
  {
    id: 'item-steel-02',
    sku: 'RM-STEEL-4140',
    name: 'AISI 4140 Alloy Steel Round Bar (120mm)',
    description: 'Hot-rolled chrome-molybdenum bar stock for precision turning',
    item_type: 'RAW_MATERIAL',
    uom: 'kg',
    category: 'Raw Metals & Alloys',
    safety_stock: 200,
    reorder_point: 400,
    standard_cost: 4.25,
    lead_time_days: 5,
    is_active: true
  },
  {
    id: 'item-brg-03',
    sku: 'RM-BRG-6205',
    name: 'Deep Groove Ball Bearing 6205-2RS',
    description: 'Rubber-sealed precision deep groove radial bearing',
    item_type: 'RAW_MATERIAL',
    uom: 'pcs',
    category: 'Hardware & Bearings',
    safety_stock: 80,
    reorder_point: 150,
    standard_cost: 6.80,
    lead_time_days: 3,
    is_active: true
  },
  {
    id: 'item-bolt-04',
    sku: 'RM-BOLT-M8',
    name: 'M8 x 35mm Grade 10.9 Flanged Hex Bolt',
    description: 'Zinc-dichromate plated high-tensile socket assembly bolts',
    item_type: 'RAW_MATERIAL',
    uom: 'pcs',
    category: 'Hardware & Bearings',
    safety_stock: 300,
    reorder_point: 600,
    standard_cost: 0.42,
    lead_time_days: 2,
    is_active: true
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-raw-01',
    plant_id: 'plt-01',
    name: 'Central Raw Materials Yard',
    code: 'WH-RAW-01',
    is_production_floor: false,
    is_active: true
  },
  {
    id: 'wh-wip-01',
    plant_id: 'plt-01',
    name: 'Machining Floor WIP Buffer',
    code: 'WH-WIP-01',
    is_production_floor: true,
    is_active: true
  },
  {
    id: 'wh-fg-01',
    plant_id: 'plt-01',
    name: 'Finished Goods Distribution Store',
    code: 'WH-FG-01',
    is_production_floor: false,
    is_active: true
  }
];

export const INITIAL_STOCK: WarehouseStock[] = [
  {
    id: 'stk-1',
    item_id: 'item-steel-02',
    warehouse_id: 'wh-raw-01',
    current_quantity: 550.0,
    allocated_quantity: 120.0,
    last_updated: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'stk-2',
    item_id: 'item-brg-03',
    warehouse_id: 'wh-raw-01',
    current_quantity: 240.0,
    allocated_quantity: 80.0,
    last_updated: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'stk-3',
    item_id: 'item-bolt-04',
    warehouse_id: 'wh-raw-01',
    current_quantity: 1200.0,
    allocated_quantity: 320.0,
    last_updated: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'stk-4',
    item_id: 'item-gear-01',
    warehouse_id: 'wh-fg-01',
    current_quantity: 45.0,
    allocated_quantity: 15.0,
    last_updated: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-001',
    item_id: 'item-steel-02',
    item_sku: 'RM-STEEL-4140',
    item_name: 'AISI 4140 Alloy Steel Round Bar',
    warehouse_id: 'wh-raw-01',
    warehouse_code: 'WH-RAW-01',
    movement_type: 'RECEIPT',
    quantity: 550,
    reference_type: 'PURCHASE_RECEIPT',
    reference_id: 'GRN-2026-081',
    batch_lot_number: 'HEAT-9843-A',
    remarks: 'Continental Alloys delivery verified & mill cert passed',
    created_by_name: 'Marcus Vance',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'mov-002',
    item_id: 'item-brg-03',
    item_sku: 'RM-BRG-6205',
    item_name: 'Deep Groove Ball Bearing 6205-2RS',
    warehouse_id: 'wh-raw-01',
    warehouse_code: 'WH-RAW-01',
    movement_type: 'RECEIPT',
    quantity: 240,
    reference_type: 'PURCHASE_RECEIPT',
    reference_id: 'GRN-2026-082',
    batch_lot_number: 'LOT-SKF-22B',
    remarks: 'Bearing inspection passed clearance test',
    created_by_name: 'Marcus Vance',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'mov-003',
    item_id: 'item-bolt-04',
    item_sku: 'RM-BOLT-M8',
    item_name: 'M8 x 35mm Grade 10.9 Flanged Hex Bolt',
    warehouse_id: 'wh-raw-01',
    warehouse_code: 'WH-RAW-01',
    movement_type: 'RECEIPT',
    quantity: 1200,
    reference_type: 'PURCHASE_RECEIPT',
    reference_id: 'GRN-2026-083',
    batch_lot_number: 'FAST-2026-09',
    remarks: 'Flange bolt shipment received into storage bin B-04',
    created_by_name: 'Elena Rostova',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'mov-004',
    item_id: 'item-gear-01',
    item_sku: 'FG-GEAR-01',
    item_name: 'Industrial Helical Gear (Module 4, 32T)',
    warehouse_id: 'wh-fg-01',
    warehouse_code: 'WH-FG-01',
    movement_type: 'RECEIPT',
    quantity: 45,
    reference_type: 'PROD_COMPLETION',
    reference_id: 'PO-2026-001',
    batch_lot_number: 'BATCH-GEAR-01',
    remarks: 'Production job completed & CMM inspection approved',
    created_by_name: 'Vashim Sipai',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Continental Alloy Steels Ltd.',
    code: 'SUP-STEEL',
    contact_person: 'Marcus Vance',
    email: 'orders@continentalalloys.com',
    phone: '+1-312-555-0192',
    lead_time_days: 5,
    rating: 4.8
  },
  {
    id: 'sup-2',
    name: 'SKF & Fastener Direct Group',
    code: 'SUP-FASTEN',
    contact_person: 'Elena Rostova',
    email: 'sales@skffasteners.com',
    phone: '+1-800-555-4890',
    lead_time_days: 3,
    rating: 4.9
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Caterpillar Heavy Drivetrain Division',
    code: 'CUST-CAT',
    contact_person: 'Robert Chen',
    email: 'supplychain@cat-drivetrain.com',
    shipping_address: 'Plant 7, Industrial Hub, Peoria, Illinois, USA'
  },
  {
    id: 'cust-2',
    name: 'Siemens Industrial Turbines & Gears',
    code: 'CUST-SIEMENS',
    contact_person: 'Anke Weber',
    email: 'purchasing@siemens-energy.de',
    shipping_address: 'Werner-von-Siemens-Strasse 1, Munich, Germany'
  }
];

export const INITIAL_WORK_CENTERS: WorkCenter[] = [
  {
    id: 'wc-cnc-01',
    plant_id: 'plt-01',
    code: 'WC-CNC-01',
    name: 'Haas ST-30Y High-Precision CNC Turning Center',
    capacity_hours_per_day: 16.0,
    hourly_cost: 68.0,
    is_active: true
  },
  {
    id: 'wc-hob-01',
    plant_id: 'plt-01',
    code: 'WC-HOB-01',
    name: 'Liebherr LC-280 CNC Gear Hobbing Machine',
    capacity_hours_per_day: 16.0,
    hourly_cost: 92.0,
    is_active: true
  },
  {
    id: 'wc-cmm-01',
    plant_id: 'plt-01',
    code: 'WC-CMM-01',
    name: 'Zeiss Contura CMM Optical & Contact Inspection Station',
    capacity_hours_per_day: 8.0,
    hourly_cost: 75.0,
    is_active: true
  }
];

export const INITIAL_OPERATIONS: Operation[] = [
  {
    id: 'op-turn',
    code: 'OP-TURN',
    name: 'Precision Bar Facing, Turning & Boring',
    description: 'Rough and finish turning of gear blanks to ±0.012mm tolerance',
    default_work_center_name: 'WC-CNC-01',
    standard_cycle_time_mins: 28
  },
  {
    id: 'op-hob',
    code: 'OP-HOB',
    name: 'High-Speed Involute Gear Teeth Hobbing',
    description: 'Module 4 helical profile tooth generation using carbide hobs',
    default_work_center_name: 'WC-HOB-01',
    standard_cycle_time_mins: 42
  },
  {
    id: 'op-cmm',
    code: 'OP-CMM',
    name: 'CMM Dimensional & Tooth Profile Quality Gate',
    description: '100% CMM pitch diameter, runout, and surface finish sign-off',
    default_work_center_name: 'WC-CMM-01',
    standard_cycle_time_mins: 15
  }
];

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf-gear-01',
    name: 'Precision Helical Gear Manufacturing Flow',
    code: 'WF-GEAR-PRECISION',
    description: '5-Stage precision machining, teeth hobbing, and mandatory Zeiss CMM quality gate.',
    industry_preset: 'Precision Mechanical Engineering',
    is_active: true,
    stages: [
      {
        id: 'stg-1',
        stage_code: 'STAGE_PREP',
        stage_name: 'Material Staging & Cut-Off Sawing',
        sequence_order: 1,
        required_role: 'WHS_MGR',
        requires_qc: false,
        estimated_duration_hours: 1.0
      },
      {
        id: 'stg-2',
        stage_code: 'STAGE_TURNING',
        stage_name: 'CNC Turning & Face Grooving',
        sequence_order: 2,
        required_role: 'PROD_OPERATOR',
        requires_qc: false,
        estimated_duration_hours: 3.5
      },
      {
        id: 'stg-3',
        stage_code: 'STAGE_HOBBING',
        stage_name: 'High-Speed Gear Teeth Hobbing',
        sequence_order: 3,
        required_role: 'PROD_OPERATOR',
        requires_qc: false,
        estimated_duration_hours: 4.0
      },
      {
        id: 'stg-4',
        stage_code: 'STAGE_QC_GATE',
        stage_name: 'CMM Quality Gate & Profile Inspection',
        sequence_order: 4,
        required_role: 'QC_INSPECTOR',
        requires_qc: true,
        estimated_duration_hours: 1.5
      },
      {
        id: 'stg-5',
        stage_code: 'STAGE_COMPLETED',
        stage_name: 'Finished Goods Inventory Transfer',
        sequence_order: 5,
        required_role: 'WHS_MGR',
        requires_qc: false,
        estimated_duration_hours: 0.5
      }
    ]
  },
  {
    id: 'wf-furn-02',
    name: 'Solid Oak Dining Table Fabrication Flow',
    code: 'WF-FURNITURE-01',
    description: 'Timber drying, CNC joinery routing, polyurethane spraying, and packing.',
    industry_preset: 'Commercial Furniture Manufacturing',
    is_active: true,
    stages: [
      {
        id: 'stg-f1',
        stage_code: 'STAGE_TIMBER_CUT',
        stage_name: 'Hardwood Planing & Sizing',
        sequence_order: 1,
        required_role: 'PROD_OPERATOR',
        requires_qc: false,
        estimated_duration_hours: 2.0
      },
      {
        id: 'stg-f2',
        stage_code: 'STAGE_JOINERY',
        stage_name: 'Mortise & Tenon CNC Joinery',
        sequence_order: 2,
        required_role: 'PROD_OPERATOR',
        requires_qc: false,
        estimated_duration_hours: 3.0
      },
      {
        id: 'stg-f3',
        stage_code: 'STAGE_COATING_QC',
        stage_name: 'Surface Sanding & Lacquer QC Signoff',
        sequence_order: 3,
        required_role: 'QC_INSPECTOR',
        requires_qc: true,
        estimated_duration_hours: 2.5
      },
      {
        id: 'stg-f4',
        stage_code: 'STAGE_PACKING',
        stage_name: 'Protective Packaging & Palletizing',
        sequence_order: 4,
        required_role: 'WHS_MGR',
        requires_qc: false,
        estimated_duration_hours: 1.0
      }
    ]
  }
];
