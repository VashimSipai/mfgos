import { 
  Item, 
  Warehouse, 
  WarehouseStock, 
  StockMovement, 
  Supplier, 
  Customer, 
  WorkCenter, 
  Operation, 
  Workflow, 
  UserRole,
  Organization,
  Plant
} from '../types';

import { 
  INITIAL_ITEMS, 
  INITIAL_WAREHOUSES, 
  INITIAL_STOCK, 
  INITIAL_MOVEMENTS, 
  INITIAL_SUPPLIERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_WORK_CENTERS, 
  INITIAL_OPERATIONS, 
  INITIAL_WORKFLOWS, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_PLANTS 
} from './mockData';

const STORAGE_KEYS = {
  ORGANIZATIONS: 'mfgos_organizations',
  PLANTS: 'mfgos_plants',
  ITEMS: 'mfgos_items',
  WAREHOUSES: 'mfgos_warehouses',
  STOCK: 'mfgos_warehouse_stock',
  MOVEMENTS: 'mfgos_stock_movements',
  SUPPLIERS: 'mfgos_suppliers',
  CUSTOMERS: 'mfgos_customers',
  WORK_CENTERS: 'mfgos_work_centers',
  OPERATIONS: 'mfgos_operations',
  WORKFLOWS: 'mfgos_workflows',
  ACTIVE_ROLE: 'mfgos_active_role',
  ACTIVE_ORG: 'mfgos_active_org_id',
  ACTIVE_PLANT: 'mfgos_active_plant_id'
};

function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export class StorageService {
  // Organizations & Context
  static getOrganizations(): Organization[] {
    return getStorageItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
  }

  static getPlants(): Plant[] {
    return getStorageItem(STORAGE_KEYS.PLANTS, INITIAL_PLANTS);
  }

  static getActiveOrgId(): string {
    return getStorageItem(STORAGE_KEYS.ACTIVE_ORG, INITIAL_ORGANIZATIONS[0].id);
  }

  static setActiveOrgId(orgId: string): void {
    setStorageItem(STORAGE_KEYS.ACTIVE_ORG, orgId);
  }

  static getActivePlantId(): string {
    return getStorageItem(STORAGE_KEYS.ACTIVE_PLANT, INITIAL_PLANTS[0].id);
  }

  static setActivePlantId(plantId: string): void {
    setStorageItem(STORAGE_KEYS.ACTIVE_PLANT, plantId);
  }

  static getActiveRole(): UserRole {
    return getStorageItem(STORAGE_KEYS.ACTIVE_ROLE, 'SUPER_ADMIN');
  }

  static setActiveRole(role: UserRole): void {
    setStorageItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  }

  // Master Data
  static getItems(): Item[] {
    return getStorageItem(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
  }

  static addItem(newItem: Omit<Item, 'id'>): Item {
    const items = this.getItems();
    const item: Item = {
      ...newItem,
      id: `item-${Date.now()}`
    };
    items.unshift(item);
    setStorageItem(STORAGE_KEYS.ITEMS, items);
    return item;
  }

  static getWarehouses(): Warehouse[] {
    return getStorageItem(STORAGE_KEYS.WAREHOUSES, INITIAL_WAREHOUSES);
  }

  static getStockBalances(): WarehouseStock[] {
    return getStorageItem(STORAGE_KEYS.STOCK, INITIAL_STOCK);
  }

  static getStockMovements(): StockMovement[] {
    return getStorageItem(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
  }

  static getSuppliers(): Supplier[] {
    return getStorageItem(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
  }

  static getCustomers(): Customer[] {
    return getStorageItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }

  static getWorkCenters(): WorkCenter[] {
    return getStorageItem(STORAGE_KEYS.WORK_CENTERS, INITIAL_WORK_CENTERS);
  }

  static getOperations(): Operation[] {
    return getStorageItem(STORAGE_KEYS.OPERATIONS, INITIAL_OPERATIONS);
  }

  static getWorkflows(): Workflow[] {
    return getStorageItem(STORAGE_KEYS.WORKFLOWS, INITIAL_WORKFLOWS);
  }

  // Transaction-Safe Stock Ledger Mutations

  /**
   * Receive goods into a warehouse
   */
  static recordStockReceipt(params: {
    itemId: string;
    warehouseId: string;
    quantity: number;
    referenceId: string;
    batchLot?: string;
    remarks?: string;
    userName?: string;
  }): StockMovement {
    const { itemId, warehouseId, quantity, referenceId, batchLot, remarks, userName } = params;

    if (quantity <= 0) {
      throw new Error('Received quantity must be greater than zero');
    }

    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) throw new Error(`Item ${itemId} not found`);

    const warehouses = this.getWarehouses();
    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (!warehouse) throw new Error(`Warehouse ${warehouseId} not found`);

    // 1. Update cached stock balance
    const stockList = this.getStockBalances();
    const existingIndex = stockList.findIndex(
      s => s.item_id === itemId && s.warehouse_id === warehouseId
    );

    if (existingIndex >= 0) {
      stockList[existingIndex].current_quantity += quantity;
      stockList[existingIndex].last_updated = new Date().toISOString();
    } else {
      stockList.push({
        id: `stk-${Date.now()}`,
        item_id: itemId,
        warehouse_id: warehouseId,
        current_quantity: quantity,
        allocated_quantity: 0,
        last_updated: new Date().toISOString()
      });
    }
    setStorageItem(STORAGE_KEYS.STOCK, stockList);

    // 2. Append immutable ledger movement
    const movements = this.getStockMovements();
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      item_id: itemId,
      item_sku: item.sku,
      item_name: item.name,
      warehouse_id: warehouseId,
      warehouse_code: warehouse.code,
      movement_type: 'RECEIPT',
      quantity: quantity,
      reference_type: 'PURCHASE_RECEIPT',
      reference_id: referenceId || `GRN-${Date.now().toString().slice(-6)}`,
      batch_lot_number: batchLot || 'BATCH-STD',
      remarks: remarks || 'Purchase goods receipt verified',
      created_by_name: userName || 'Warehouse Team',
      created_at: new Date().toISOString()
    };

    movements.unshift(newMovement);
    setStorageItem(STORAGE_KEYS.MOVEMENTS, movements);
    return newMovement;
  }

  /**
   * Issue material to production floor with strict non-negative check
   */
  static issueMaterialToProduction(params: {
    itemId: string;
    warehouseId: string;
    quantity: number;
    workOrderNumber: string;
    remarks?: string;
    userName?: string;
  }): StockMovement {
    const { itemId, warehouseId, quantity, workOrderNumber, remarks, userName } = params;

    if (quantity <= 0) {
      throw new Error('Issue quantity must be greater than zero');
    }

    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');

    const warehouses = this.getWarehouses();
    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (!warehouse) throw new Error('Warehouse not found');

    const stockList = this.getStockBalances();
    const stockIndex = stockList.findIndex(
      s => s.item_id === itemId && s.warehouse_id === warehouseId
    );

    const available = stockIndex >= 0 ? stockList[stockIndex].current_quantity : 0;

    // Strict non-negative inventory rule
    if (available < quantity) {
      throw new Error(
        `ERR_INSUFFICIENT_STOCK: Available stock is ${available} ${item.uom}, but attempted to issue ${quantity} ${item.uom}. (Deficit: ${(quantity - available).toFixed(2)})`
      );
    }

    // Deduct stock
    stockList[stockIndex].current_quantity -= quantity;
    stockList[stockIndex].last_updated = new Date().toISOString();
    setStorageItem(STORAGE_KEYS.STOCK, stockList);

    // Ledger entry (negative quantity)
    const movements = this.getStockMovements();
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      item_id: itemId,
      item_sku: item.sku,
      item_name: item.name,
      warehouse_id: warehouseId,
      warehouse_code: warehouse.code,
      movement_type: 'ISSUE',
      quantity: -quantity,
      reference_type: 'PRODUCTION_ORDER',
      reference_id: workOrderNumber || 'PO-2026-WIP',
      remarks: remarks || `Issued to shop floor for job ${workOrderNumber}`,
      created_by_name: userName || 'Warehouse Manager',
      created_at: new Date().toISOString()
    };

    movements.unshift(newMovement);
    setStorageItem(STORAGE_KEYS.MOVEMENTS, movements);
    return newMovement;
  }

  /**
   * Transfer material between two warehouses atomically
   */
  static executeStockTransfer(params: {
    itemId: string;
    sourceWarehouseId: string;
    destWarehouseId: string;
    quantity: number;
    remarks?: string;
    userName?: string;
  }): { outMovement: StockMovement; inMovement: StockMovement } {
    const { itemId, sourceWarehouseId, destWarehouseId, quantity, remarks, userName } = params;

    if (quantity <= 0) throw new Error('Transfer quantity must be positive');
    if (sourceWarehouseId === destWarehouseId) {
      throw new Error('Source and destination warehouses cannot be the same');
    }

    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');

    const warehouses = this.getWarehouses();
    const sourceWh = warehouses.find(w => w.id === sourceWarehouseId);
    const destWh = warehouses.find(w => w.id === destWarehouseId);
    if (!sourceWh || !destWh) throw new Error('Warehouse not found');

    const stockList = this.getStockBalances();
    const sourceIndex = stockList.findIndex(
      s => s.item_id === itemId && s.warehouse_id === sourceWarehouseId
    );

    const available = sourceIndex >= 0 ? stockList[sourceIndex].current_quantity : 0;
    if (available < quantity) {
      throw new Error(
        `ERR_INSUFFICIENT_STOCK: Source warehouse ${sourceWh.code} has only ${available} ${item.uom} available.`
      );
    }

    // Deduct source
    stockList[sourceIndex].current_quantity -= quantity;
    stockList[sourceIndex].last_updated = new Date().toISOString();

    // Increment destination
    const destIndex = stockList.findIndex(
      s => s.item_id === itemId && s.warehouse_id === destWarehouseId
    );
    if (destIndex >= 0) {
      stockList[destIndex].current_quantity += quantity;
      stockList[destIndex].last_updated = new Date().toISOString();
    } else {
      stockList.push({
        id: `stk-${Date.now()}`,
        item_id: itemId,
        warehouse_id: destWarehouseId,
        current_quantity: quantity,
        allocated_quantity: 0,
        last_updated: new Date().toISOString()
      });
    }
    setStorageItem(STORAGE_KEYS.STOCK, stockList);

    // Ledger entries
    const movements = this.getStockMovements();
    const transferRef = `TRF-${Date.now().toString().slice(-6)}`;

    const outMovement: StockMovement = {
      id: `mov-${Date.now()}-out`,
      item_id: itemId,
      item_sku: item.sku,
      item_name: item.name,
      warehouse_id: sourceWarehouseId,
      warehouse_code: sourceWh.code,
      movement_type: 'TRANSFER',
      quantity: -quantity,
      reference_type: 'TRANSFER_OUT',
      reference_id: transferRef,
      remarks: remarks || `Transferred to ${destWh.name}`,
      created_by_name: userName || 'Warehouse Manager',
      created_at: new Date().toISOString()
    };

    const inMovement: StockMovement = {
      id: `mov-${Date.now()}-in`,
      item_id: itemId,
      item_sku: item.sku,
      item_name: item.name,
      warehouse_id: destWarehouseId,
      warehouse_code: destWh.code,
      movement_type: 'TRANSFER',
      quantity: quantity,
      reference_type: 'TRANSFER_IN',
      reference_id: transferRef,
      remarks: remarks || `Received from ${sourceWh.name}`,
      created_by_name: userName || 'Warehouse Manager',
      created_at: new Date().toISOString()
    };

    movements.unshift(inMovement);
    movements.unshift(outMovement);
    setStorageItem(STORAGE_KEYS.MOVEMENTS, movements);

    return { outMovement, inMovement };
  }

  /**
   * Execute physical cycle count stock adjustment
   */
  static executeStockAdjustment(params: {
    itemId: string;
    warehouseId: string;
    countedQuantity: number;
    reason: string;
    userName?: string;
  }): StockMovement {
    const { itemId, warehouseId, countedQuantity, reason, userName } = params;

    if (countedQuantity < 0) {
      throw new Error('Counted inventory quantity cannot be negative');
    }

    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (!item) throw new Error('Item not found');

    const warehouses = this.getWarehouses();
    const warehouse = warehouses.find(w => w.id === warehouseId);
    if (!warehouse) throw new Error('Warehouse not found');

    const stockList = this.getStockBalances();
    const stockIndex = stockList.findIndex(
      s => s.item_id === itemId && s.warehouse_id === warehouseId
    );

    const currentQty = stockIndex >= 0 ? stockList[stockIndex].current_quantity : 0;
    const variance = countedQuantity - currentQty;

    if (stockIndex >= 0) {
      stockList[stockIndex].current_quantity = countedQuantity;
      stockList[stockIndex].last_updated = new Date().toISOString();
    } else {
      stockList.push({
        id: `stk-${Date.now()}`,
        item_id: itemId,
        warehouse_id: warehouseId,
        current_quantity: countedQuantity,
        allocated_quantity: 0,
        last_updated: new Date().toISOString()
      });
    }
    setStorageItem(STORAGE_KEYS.STOCK, stockList);

    const movements = this.getStockMovements();
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      item_id: itemId,
      item_sku: item.sku,
      item_name: item.name,
      warehouse_id: warehouseId,
      warehouse_code: warehouse.code,
      movement_type: 'ADJUSTMENT',
      quantity: variance,
      reference_type: 'PHYSICAL_AUDIT',
      reference_id: `AUDIT-${Date.now().toString().slice(-6)}`,
      remarks: reason || `Count reconciliation (Was ${currentQty}, Now ${countedQuantity})`,
      created_by_name: userName || 'Quality/Warehouse Auditor',
      created_at: new Date().toISOString()
    };

    movements.unshift(newMovement);
    setStorageItem(STORAGE_KEYS.MOVEMENTS, movements);
    return newMovement;
  }

  /**
   * Reset store to clean demonstration state
   */
  static resetToDefault(): void {
    localStorage.clear();
    setStorageItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
    setStorageItem(STORAGE_KEYS.PLANTS, INITIAL_PLANTS);
    setStorageItem(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    setStorageItem(STORAGE_KEYS.WAREHOUSES, INITIAL_WAREHOUSES);
    setStorageItem(STORAGE_KEYS.STOCK, INITIAL_STOCK);
    setStorageItem(STORAGE_KEYS.MOVEMENTS, INITIAL_MOVEMENTS);
    setStorageItem(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    setStorageItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    setStorageItem(STORAGE_KEYS.WORK_CENTERS, INITIAL_WORK_CENTERS);
    setStorageItem(STORAGE_KEYS.OPERATIONS, INITIAL_OPERATIONS);
    setStorageItem(STORAGE_KEYS.WORKFLOWS, INITIAL_WORKFLOWS);
    setStorageItem(STORAGE_KEYS.ACTIVE_ROLE, 'SUPER_ADMIN');
    setStorageItem(STORAGE_KEYS.ACTIVE_ORG, INITIAL_ORGANIZATIONS[0].id);
    setStorageItem(STORAGE_KEYS.ACTIVE_PLANT, INITIAL_PLANTS[0].id);
  }
}
