export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'PROD_MGR' 
  | 'PROD_OPERATOR' 
  | 'WHS_MGR' 
  | 'QC_INSPECTOR' 
  | 'PURCHASE_MGR' 
  | 'SALES_MGR';

export type ItemType = 'RAW_MATERIAL' | 'FINISHED_GOOD' | 'WIP_ASSEMBLY' | 'CONSUMABLE';

export type MovementType = 'RECEIPT' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN' | 'SCRAP';

export interface Organization {
  id: string;
  name: string;
  code: string;
  industry_type: string;
  currency: string;
}

export interface Plant {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  city: string;
  country: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

export interface UnitOfMeasure {
  id: string;
  name: string;
  symbol: string;
  category: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  code: string;
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  description: string;
  item_type: ItemType;
  uom: string;
  category: string;
  safety_stock: number;
  reorder_point: number;
  standard_cost: number;
  lead_time_days: number;
  is_active: boolean;
}

export interface Warehouse {
  id: string;
  plant_id: string;
  name: string;
  code: string;
  is_production_floor: boolean;
  is_active: boolean;
}

export interface WarehouseStock {
  id: string;
  item_id: string;
  warehouse_id: string;
  current_quantity: number;
  allocated_quantity: number;
  last_updated: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  item_sku?: string;
  item_name?: string;
  warehouse_id: string;
  warehouse_code?: string;
  movement_type: MovementType;
  quantity: number;
  reference_type: string;
  reference_id: string;
  batch_lot_number?: string;
  remarks: string;
  created_by_name: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact_person: string;
  email: string;
  phone: string;
  lead_time_days: number;
  rating: number;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  contact_person: string;
  email: string;
  shipping_address: string;
}

export interface WorkCenter {
  id: string;
  plant_id: string;
  code: string;
  name: string;
  capacity_hours_per_day: number;
  hourly_cost: number;
  is_active: boolean;
}

export interface Operation {
  id: string;
  code: string;
  name: string;
  description: string;
  default_work_center_name: string;
  standard_cycle_time_mins: number;
}

export interface WorkflowStage {
  id: string;
  stage_code: string;
  stage_name: string;
  sequence_order: number;
  required_role: UserRole;
  requires_qc: boolean;
  estimated_duration_hours: number;
}

export interface Workflow {
  id: string;
  name: string;
  code: string;
  description: string;
  industry_preset: string;
  stages: WorkflowStage[];
  is_active: boolean;
}
