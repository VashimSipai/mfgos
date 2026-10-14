import React from 'react';
import { 
  DollarSign, 
  Package, 
  AlertTriangle, 
  History, 
  PlusCircle, 
  ArrowRightLeft, 
  Sliders, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  FileDown
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface DashboardViewProps {
  onOpenReceiveModal: () => void;
  onOpenIssueModal: () => void;
  onOpenTransferModal: () => void;
  onOpenAdjustModal: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenReceiveModal,
  onOpenIssueModal,
  onOpenTransferModal,
  onOpenAdjustModal,
  onNavigateToTab
}) => {
  const items = StorageService.getItems();
  const warehouses = StorageService.getWarehouses();
  const stockList = StorageService.getStockBalances();
  const movements = StorageService.getStockMovements();
  const workflows = StorageService.getWorkflows();
  const activeWf = workflows[0];

  // Calculate Metrics
  const totalValue = stockList.reduce((acc, curr) => {
    const itm = items.find(i => i.id === curr.item_id);
    return acc + (curr.current_quantity * (itm?.standard_cost || 0));
  }, 0);

  const lowStockCount = stockList.filter(s => {
    const itm = items.find(i => i.id === s.item_id);
    return itm && s.current_quantity <= itm.safety_stock;
  }).length;

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Manufacturing Operations Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Real-time shop-floor execution, immutable stock ledger, and configurable routing.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={onOpenReceiveModal}>
            <PlusCircle size={16} />
            <span>Receive Goods</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenIssueModal}>
            <FileDown size={16} />
            <span>Issue Material</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenTransferModal}>
            <ArrowRightLeft size={16} />
            <span>Transfer</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenAdjustModal}>
            <Sliders size={16} />
            <span>Audit Count</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="metrics-grid">
        <div className="kpi-card" style={{ '--kpi-glow': 'var(--primary)' } as React.CSSProperties}>
          <div className="kpi-top">
            <span className="kpi-label">Total Inventory Valuation</span>
            <div className="kpi-icon-box">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="kpi-value">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-footer">
            <TrendingUp size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Reconciled across {warehouses.length} active warehouses</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-glow': 'var(--secondary)' } as React.CSSProperties}>
          <div className="kpi-top">
            <span className="kpi-label">Active Items & SKUs</span>
            <div className="kpi-icon-box">
              <Package size={20} />
            </div>
          </div>
          <div className="kpi-value">
            {items.length}
          </div>
          <div className="kpi-footer">
            <span>Finished Goods, Raw Bars & Fasteners</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-glow': lowStockCount > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)' } as React.CSSProperties}>
          <div className="kpi-top">
            <span className="kpi-label">Low Stock Alerts</span>
            <div className="kpi-icon-box">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: lowStockCount > 0 ? 'var(--accent-amber)' : '#fff' }}>
            {lowStockCount}
          </div>
          <div className="kpi-footer">
            <span>{lowStockCount > 0 ? 'Items below safety threshold' : 'All inventory within safe levels'}</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-glow': 'var(--accent-cyan)' } as React.CSSProperties}>
          <div className="kpi-top">
            <span className="kpi-label">Ledger Movements</span>
            <div className="kpi-icon-box">
              <History size={20} />
            </div>
          </div>
          <div className="kpi-value">
            {movements.length}
          </div>
          <div className="kpi-footer">
            <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>100% Immutable transaction audit trail</span>
          </div>
        </div>
      </div>

      {/* Main Innovation Banner: Configurable Workflow Pipeline Showcase */}
      <div className="glass-card" style={{ marginBottom: 28, borderLeft: '4px solid var(--primary)' }}>
        <div className="card-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-cyan">Major Project Innovation</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {activeWf?.code}
              </span>
            </div>
            <h2 className="card-title" style={{ marginTop: 6 }}>
              Configurable Workflow Engine: {activeWf?.name}
            </h2>
            <p className="card-subtitle">
              {activeWf?.description} (Configured via database metadata without code modification)
            </p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigateToTab('workflows')}
          >
            <span>Explore Workflows</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Stepper Pipeline */}
        <div className="workflow-stepper">
          {activeWf?.stages.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              <div className={`workflow-step-card ${stage.requires_qc ? 'active' : ''}`}>
                <div className="step-num-badge">
                  <span>STAGE 0{stage.sequence_order}</span>
                  {stage.requires_qc && (
                    <span className="badge badge-purple" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                      QC Gate
                    </span>
                  )}
                </div>
                <div className="step-name">
                  {stage.stage_name}
                </div>
                <div className="step-meta">
                  Role: <strong style={{ color: 'var(--primary)' }}>{stage.required_role}</strong>
                </div>
              </div>
              {idx < activeWf.stages.length - 1 && (
                <div className="step-arrow">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Warehouse Inventory vs. Recent Ledger Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 24 }}>
        
        {/* Left: Current Stock Summary */}
        <div className="glass-card">
          <div className="card-header-row">
            <div>
              <h2 className="card-title">Real-Time Warehouse Balances</h2>
              <p className="card-subtitle">Current physical balances vs safety stock</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigateToTab('inventory')}
            >
              <span>View Full Ledger</span>
            </button>
          </div>

          <div className="table-wrapper">
            <table className="mfgos-table">
              <thead>
                <tr>
                  <th>Item SKU</th>
                  <th>Warehouse</th>
                  <th>On Hand</th>
                  <th>Safety</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stockList.map(stock => {
                  const itm = items.find(i => i.id === stock.item_id);
                  const wh = warehouses.find(w => w.id === stock.warehouse_id);
                  const isLow = itm && stock.current_quantity <= itm.safety_stock;

                  return (
                    <tr key={stock.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{itm?.name}</div>
                        <span className="sku-tag">{itm?.sku}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {wh?.code}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1rem', color: isLow ? 'var(--accent-amber)' : '#fff' }}>
                          {stock.current_quantity}
                        </strong>{' '}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{itm?.uom}</span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                        {itm?.safety_stock} {itm?.uom}
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
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Immutable Stock Movements Feed */}
        <div className="glass-card">
          <div className="card-header-row">
            <div>
              <h2 className="card-title">Auditable Stock Movement Ledger</h2>
              <p className="card-subtitle">Zero-overwrite chronological transaction stream</p>
            </div>
            <span className="badge badge-emerald">
              <ShieldCheck size={12} />
              <span>ACID Verified</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {movements.slice(0, 5).map(mov => {
              const isPositive = mov.quantity > 0;
              return (
                <div 
                  key={mov.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`movement-tag movement-${mov.movement_type}`}>
                      {mov.movement_type}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                        {mov.item_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Ref: <strong style={{ color: 'var(--text-muted)' }}>{mov.reference_id}</strong> • Whs: {mov.warehouse_code}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)' 
                    }}>
                      {isPositive ? `+${mov.quantity}` : mov.quantity}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
                      {new Date(mov.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
