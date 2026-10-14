import React, { useState } from 'react';
import { 
  Boxes, 
  History, 
  PlusCircle, 
  ArrowRightLeft, 
  Sliders, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle,
  X
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface InventoryViewProps {
  receiveModalOpen: boolean;
  issueModalOpen: boolean;
  transferModalOpen: boolean;
  adjustModalOpen: boolean;
  onCloseModals: () => void;
  onOpenReceiveModal: () => void;
  onOpenIssueModal: () => void;
  onOpenTransferModal: () => void;
  onOpenAdjustModal: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  receiveModalOpen,
  issueModalOpen,
  transferModalOpen,
  adjustModalOpen,
  onCloseModals,
  onOpenReceiveModal,
  onOpenIssueModal,
  onOpenTransferModal,
  onOpenAdjustModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'balances' | 'ledger'>('balances');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState('ALL');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form States
  // 1. Receive
  const [receiveItemId, setReceiveItemId] = useState('');
  const [receiveWhId, setReceiveWhId] = useState('');
  const [receiveQty, setReceiveQty] = useState<number>(100);
  const [receiveBatch, setReceiveBatch] = useState('HEAT-2026-X1');
  const [receiveRef, setReceiveRef] = useState('GRN-2026-901');
  const [receiveRemarks, setReceiveRemarks] = useState('Standard supplier batch delivery');

  // 2. Issue
  const [issueItemId, setIssueItemId] = useState('');
  const [issueWhId, setIssueWhId] = useState('');
  const [issueQty, setIssueQty] = useState<number>(50);
  const [issueWorkOrder, setIssueWorkOrder] = useState('PO-2026-001');
  const [issueRemarks, setIssueRemarks] = useState('Material issue to shop-floor CNC line');

  // 3. Transfer
  const [transferItemId, setTransferItemId] = useState('');
  const [transferSourceWh, setTransferSourceWh] = useState('');
  const [transferDestWh, setTransferDestWh] = useState('');
  const [transferQty, setTransferQty] = useState<number>(25);
  const [transferRemarks, setTransferRemarks] = useState('Inter-facility buffer replenishment');

  // 4. Adjust
  const [adjustItemId, setAdjustItemId] = useState('');
  const [adjustWhId, setAdjustWhId] = useState('');
  const [adjustCountedQty, setAdjustCountedQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Physical cycle count discrepancy audit');

  const items = StorageService.getItems();
  const warehouses = StorageService.getWarehouses();
  const stockBalances = StorageService.getStockBalances();
  const movements = StorageService.getStockMovements();

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  // Handlers
  const handleReceiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedItem = items.find(i => i.id === (receiveItemId || items[0].id));
      const targetWh = warehouses.find(w => w.id === (receiveWhId || warehouses[0].id));
      
      StorageService.recordStockReceipt({
        itemId: selectedItem?.id || items[0].id,
        warehouseId: targetWh?.id || warehouses[0].id,
        quantity: Number(receiveQty),
        referenceId: receiveRef,
        batchLot: receiveBatch,
        remarks: receiveRemarks
      });

      showToast('success', `Successfully received ${receiveQty} ${selectedItem?.uom} of ${selectedItem?.sku} into ${targetWh?.code}.`);
      onCloseModals();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedItem = items.find(i => i.id === (issueItemId || items[0].id));
      const targetWh = warehouses.find(w => w.id === (issueWhId || warehouses[0].id));

      StorageService.issueMaterialToProduction({
        itemId: selectedItem?.id || items[0].id,
        warehouseId: targetWh?.id || warehouses[0].id,
        quantity: Number(issueQty),
        workOrderNumber: issueWorkOrder,
        remarks: issueRemarks
      });

      showToast('success', `Issued ${issueQty} ${selectedItem?.uom} of ${selectedItem?.sku} to job ${issueWorkOrder}.`);
      onCloseModals();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedItem = items.find(i => i.id === (transferItemId || items[0].id));
      const srcWh = warehouses.find(w => w.id === (transferSourceWh || warehouses[0].id));
      const dstWh = warehouses.find(w => w.id === (transferDestWh || warehouses[1]?.id || warehouses[0].id));

      StorageService.executeStockTransfer({
        itemId: selectedItem?.id || items[0].id,
        sourceWarehouseId: srcWh?.id || warehouses[0].id,
        destWarehouseId: dstWh?.id || warehouses[1].id,
        quantity: Number(transferQty),
        remarks: transferRemarks
      });

      showToast('success', `Transferred ${transferQty} ${selectedItem?.uom} from ${srcWh?.code} to ${dstWh?.code}.`);
      onCloseModals();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedItem = items.find(i => i.id === (adjustItemId || items[0].id));
      const targetWh = warehouses.find(w => w.id === (adjustWhId || warehouses[0].id));

      StorageService.executeStockAdjustment({
        itemId: selectedItem?.id || items[0].id,
        warehouseId: targetWh?.id || warehouses[0].id,
        countedQuantity: Number(adjustCountedQty),
        reason: adjustReason
      });

      showToast('success', `Inventory count for ${selectedItem?.sku} reconciled to ${adjustCountedQty} ${selectedItem?.uom}.`);
      onCloseModals();
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  // Filtered lists
  const filteredBalances = stockBalances.filter(s => {
    const itm = items.find(i => i.id === s.item_id);
    if (!itm) return false;
    const matchesSearch = itm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          itm.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWh = selectedWarehouseFilter === 'ALL' || s.warehouse_id === selectedWarehouseFilter;
    return matchesSearch && matchesWh;
  });

  const filteredMovements = movements.filter(m => {
    return (m.item_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (m.item_sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (m.reference_id || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      {/* Toast Alert */}
      {feedbackMessage && (
        <div style={{
          position: 'fixed',
          top: 84,
          right: 32,
          zIndex: 150,
          background: feedbackMessage.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${feedbackMessage.type === 'success' ? '#34d399' : '#f87171'}`,
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.875rem',
          fontWeight: 600
        }}>
          {feedbackMessage.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Header and Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Inventory Management & Stock Ledger
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Transaction-safe inventory balances backed by double-entry auditable ledger movements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={onOpenReceiveModal}>
            <PlusCircle size={16} />
            <span>Receive Goods</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenIssueModal}>
            <span>Issue Material</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenTransferModal}>
            <ArrowRightLeft size={16} />
            <span>Transfer</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenAdjustModal}>
            <Sliders size={16} />
            <span>Adjust Count</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="tab-list">
        <button 
          className={`tab-btn ${activeSubTab === 'balances' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('balances')}
        >
          <Boxes size={16} />
          <span>Current Warehouse Balances</span>
          <span className="badge badge-cyan" style={{ fontSize: '0.6875rem' }}>
            {filteredBalances.length}
          </span>
        </button>

        <button 
          className={`tab-btn ${activeSubTab === 'ledger' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('ledger')}
        >
          <History size={16} />
          <span>Stock Movement Ledger (Audit Stream)</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.6875rem' }}>
            {movements.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10, 
          background: 'rgba(255, 255, 255, 0.04)', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: 'var(--radius-md)', 
          padding: '8px 14px',
          flex: 1
        }}>
          <Search size={16} style={{ color: 'var(--text-dim)' }} />
          <input 
            type="text"
            placeholder="Search by SKU, item name, reference ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.875rem',
              width: '100%'
            }}
          />
        </div>

        {activeSubTab === 'balances' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={16} style={{ color: 'var(--text-dim)' }} />
            <select 
              className="form-select"
              value={selectedWarehouseFilter}
              onChange={(e) => setSelectedWarehouseFilter(e.target.value)}
              style={{ padding: '8px 12px' }}
            >
              <option value="ALL">All Warehouses</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* View Content */}
      {activeSubTab === 'balances' ? (
        <div className="glass-card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="mfgos-table">
              <thead>
                <tr>
                  <th>Item SKU & Description</th>
                  <th>Type</th>
                  <th>Warehouse Location</th>
                  <th>Physical On Hand</th>
                  <th>Allocated</th>
                  <th>Available</th>
                  <th>Safety Stock</th>
                  <th>Standard Cost</th>
                  <th>Total Valuation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBalances.length > 0 ? (
                  filteredBalances.map(stock => {
                    const itm = items.find(i => i.id === stock.item_id);
                    const wh = warehouses.find(w => w.id === stock.warehouse_id);
                    const available = stock.current_quantity - stock.allocated_quantity;
                    const isLow = itm && stock.current_quantity <= itm.safety_stock;
                    const valuation = stock.current_quantity * (itm?.standard_cost || 0);

                    return (
                      <tr key={stock.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{itm?.name}</div>
                          <span className="sku-tag">{itm?.sku}</span>
                        </td>
                        <td>
                          <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>
                            {itm?.item_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{wh?.name}</div>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            {wh?.code} {wh?.is_production_floor ? '• (Shop Floor)' : ''}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '1rem', color: isLow ? 'var(--accent-amber)' : '#fff' }}>
                            {stock.current_quantity.toFixed(1)}
                          </strong>{' '}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{itm?.uom}</span>
                        </td>
                        <td style={{ color: 'var(--text-dim)' }}>
                          {stock.allocated_quantity.toFixed(1)} {itm?.uom}
                        </td>
                        <td>
                          <strong style={{ color: available > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                            {available.toFixed(1)}
                          </strong>{' '}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{itm?.uom}</span>
                        </td>
                        <td style={{ color: 'var(--text-dim)' }}>
                          {itm?.safety_stock} {itm?.uom}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>
                          ${itm?.standard_cost.toFixed(2)}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
                          ${valuation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td>
                          {isLow ? (
                            <span className="badge badge-amber">Low Stock</span>
                          ) : (
                            <span className="badge badge-emerald">Optimal</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-dim)' }}>
                      No stock records matched your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Stock Movement Ledger Table */
        <div className="glass-card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table className="mfgos-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Movement Type</th>
                  <th>Item SKU & Name</th>
                  <th>Warehouse</th>
                  <th>Quantity Shift</th>
                  <th>Reference Document</th>
                  <th>Batch / Heat Lot</th>
                  <th>Remarks / Audit Reason</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map(mov => {
                  const isPositive = mov.quantity > 0;
                  return (
                    <tr key={mov.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {new Date(mov.created_at).toLocaleString()}
                      </td>
                      <td>
                        <span className={`movement-tag movement-${mov.movement_type}`}>
                          {mov.movement_type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{mov.item_name}</div>
                        <span className="sku-tag">{mov.item_sku}</span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                          {mov.warehouse_code}
                        </span>
                      </td>
                      <td>
                        <strong style={{ 
                          fontSize: '1rem', 
                          fontFamily: 'var(--font-mono)',
                          color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)' 
                        }}>
                          {isPositive ? `+${mov.quantity}` : mov.quantity}
                        </strong>
                      </td>
                      <td>
                        <span style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '0.75rem', 
                          background: 'rgba(255, 255, 255, 0.05)', 
                          padding: '2px 6px', 
                          borderRadius: 4 
                        }}>
                          {mov.reference_id}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {mov.batch_lot_number || 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: 260 }}>
                        {mov.remarks}
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        {mov.created_by_name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: RECEIVE GOODS INTO WAREHOUSE */}
      {receiveModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Record Stock Goods Receipt</h3>
              <button className="btn btn-secondary btn-sm" onClick={onCloseModals}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleReceiveSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Item (Raw Material or Product)</label>
                  <select 
                    className="form-select"
                    value={receiveItemId}
                    onChange={(e) => setReceiveItemId(e.target.value)}
                  >
                    {items.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.sku} — {i.name} ({i.uom})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Warehouse</label>
                  <select 
                    className="form-select"
                    value={receiveWhId}
                    onChange={(e) => setReceiveWhId(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Quantity to Receive</label>
                    <input 
                      type="number"
                      step="any"
                      min="1"
                      required
                      className="form-input"
                      value={receiveQty}
                      onChange={(e) => setReceiveQty(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Batch / Heat Lot Code</label>
                    <input 
                      type="text"
                      required
                      className="form-input"
                      value={receiveBatch}
                      onChange={(e) => setReceiveBatch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reference ID (PO / GRN)</label>
                  <input 
                    type="text"
                    required
                    className="form-input"
                    value={receiveRef}
                    onChange={(e) => setReceiveRef(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Inspection & Delivery Remarks</label>
                  <textarea 
                    className="form-textarea"
                    rows={2}
                    value={receiveRemarks}
                    onChange={(e) => setReceiveRemarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onCloseModals}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Receipt to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ISSUE MATERIAL TO PRODUCTION */}
      {issueModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Issue Raw Materials to Production Floor</h3>
              <button className="btn btn-secondary btn-sm" onClick={onCloseModals}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleIssueSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Material</label>
                  <select 
                    className="form-select"
                    value={issueItemId}
                    onChange={(e) => setIssueItemId(e.target.value)}
                  >
                    {items.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.sku} — {i.name} ({i.uom})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Source Warehouse</label>
                  <select 
                    className="form-select"
                    value={issueWhId}
                    onChange={(e) => setIssueWhId(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Quantity to Issue</label>
                    <input 
                      type="number"
                      step="any"
                      min="1"
                      required
                      className="form-input"
                      value={issueQty}
                      onChange={(e) => setIssueQty(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Order Reference</label>
                    <input 
                      type="text"
                      required
                      className="form-input"
                      value={issueWorkOrder}
                      onChange={(e) => setIssueWorkOrder(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Remarks</label>
                  <textarea 
                    className="form-textarea"
                    rows={2}
                    value={issueRemarks}
                    onChange={(e) => setIssueRemarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onCloseModals}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald">
                  Deduct & Issue to Shop Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INTER-WAREHOUSE TRANSFER */}
      {transferModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Inter-Warehouse Stock Transfer</h3>
              <button className="btn btn-secondary btn-sm" onClick={onCloseModals}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleTransferSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Item</label>
                  <select 
                    className="form-select"
                    value={transferItemId}
                    onChange={(e) => setTransferItemId(e.target.value)}
                  >
                    {items.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.sku} — {i.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Source Warehouse</label>
                    <select 
                      className="form-select"
                      value={transferSourceWh}
                      onChange={(e) => setTransferSourceWh(e.target.value)}
                    >
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.code} ({w.name})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Destination Warehouse</label>
                    <select 
                      className="form-select"
                      value={transferDestWh}
                      onChange={(e) => setTransferDestWh(e.target.value)}
                    >
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.code} ({w.name})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity to Transfer</label>
                  <input 
                    type="number"
                    step="any"
                    min="1"
                    required
                    className="form-input"
                    value={transferQty}
                    onChange={(e) => setTransferQty(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason / Transfer Order Notes</label>
                  <textarea 
                    className="form-textarea"
                    rows={2}
                    value={transferRemarks}
                    onChange={(e) => setTransferRemarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onCloseModals}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Execute Atomic Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PHYSICAL CYCLE COUNT ADJUSTMENT */}
      {adjustModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Cycle Count Physical Adjustment</h3>
              <button className="btn btn-secondary btn-sm" onClick={onCloseModals}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAdjustSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Item</label>
                  <select 
                    className="form-select"
                    value={adjustItemId}
                    onChange={(e) => setAdjustItemId(e.target.value)}
                  >
                    {items.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.sku} — {i.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Warehouse to Audit</label>
                  <select 
                    className="form-select"
                    value={adjustWhId}
                    onChange={(e) => setAdjustWhId(e.target.value)}
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.code} ({w.name})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Actual Physical Count Verified</label>
                  <input 
                    type="number"
                    step="any"
                    min="0"
                    required
                    className="form-input"
                    value={adjustCountedQty}
                    onChange={(e) => setAdjustCountedQty(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Audit Discrepancy Reason</label>
                  <textarea 
                    className="form-textarea"
                    rows={2}
                    required
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onCloseModals}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Reconcile & Record Variance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
