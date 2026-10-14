import React, { useState } from 'react';
import { 
  Database, 
  Package, 
  Building, 
  Wrench, 
  Truck, 
  Users, 
  Plus, 
  Search,
  X
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { ItemType } from '../../types';

export const MasterDataView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'warehouses' | 'workcenters' | 'partners' | 'operations'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);

  // Add Item Form
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<ItemType>('RAW_MATERIAL');
  const [newUom, setNewUom] = useState('pcs');
  const [newCategory, setNewCategory] = useState('Raw Materials');
  const [newSafetyStock, setNewSafetyStock] = useState<number>(50);
  const [newCost, setNewCost] = useState<number>(10.0);

  const items = StorageService.getItems();
  const warehouses = StorageService.getWarehouses();
  const workCenters = StorageService.getWorkCenters();
  const suppliers = StorageService.getSuppliers();
  const customers = StorageService.getCustomers();
  const operations = StorageService.getOperations();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    StorageService.addItem({
      sku: newSku.toUpperCase(),
      name: newName,
      description: newDesc,
      item_type: newType,
      uom: newUom,
      category: newCategory,
      safety_stock: Number(newSafetyStock),
      reorder_point: Number(newSafetyStock) * 1.5,
      standard_cost: Number(newCost),
      lead_time_days: 3,
      is_active: true
    });

    setNewSku('');
    setNewName('');
    setNewDesc('');
    setAddItemModalOpen(false);
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>
            Master Data Management (MDM)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            System of record for products, raw materials, plants, work centers, suppliers, and routing operations.
          </p>
        </div>

        {activeSubTab === 'items' && (
          <button className="btn btn-primary" onClick={() => setAddItemModalOpen(true)}>
            <Plus size={16} />
            <span>Create New Item</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button 
          className={`tab-btn ${activeSubTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('items')}
        >
          <Package size={16} />
          <span>Items & Products ({items.length})</span>
        </button>

        <button 
          className={`tab-btn ${activeSubTab === 'warehouses' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('warehouses')}
        >
          <Building size={16} />
          <span>Warehouses ({warehouses.length})</span>
        </button>

        <button 
          className={`tab-btn ${activeSubTab === 'workcenters' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('workcenters')}
        >
          <Wrench size={16} />
          <span>Work Centers ({workCenters.length})</span>
        </button>

        <button 
          className={`tab-btn ${activeSubTab === 'partners' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('partners')}
        >
          <Truck size={16} />
          <span>Partners ({suppliers.length + customers.length})</span>
        </button>

        <button 
          className={`tab-btn ${activeSubTab === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('operations')}
        >
          <Database size={16} />
          <span>Operations ({operations.length})</span>
        </button>
      </div>

      {/* Sub-tab 1: Items & Products */}
      {activeSubTab === 'items' && (
        <div className="glass-card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Search size={16} style={{ color: 'var(--text-dim)' }} />
            <input 
              type="text"
              placeholder="Search items by SKU or description..."
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

          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="mfgos-table">
              <thead>
                <tr>
                  <th>SKU Code</th>
                  <th>Product Name & Description</th>
                  <th>Item Type</th>
                  <th>Category</th>
                  <th>Unit of Measure</th>
                  <th>Standard Cost</th>
                  <th>Safety Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="sku-tag">{item.sku}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: 360 }}>
                        {item.description}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>
                        {item.item_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>{item.category}</td>
                    <td>
                      <span style={{ 
                        fontFamily: 'var(--font-mono)', 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        padding: '2px 8px', 
                        borderRadius: 4 
                      }}>
                        {item.uom}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      ${item.standard_cost.toFixed(2)}
                    </td>
                    <td style={{ color: 'var(--text-dim)' }}>
                      {item.safety_stock} {item.uom}
                    </td>
                    <td>
                      <span className="badge badge-emerald">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Warehouses */}
      {activeSubTab === 'warehouses' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {warehouses.map(wh => (
            <div key={wh.id} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="sku-tag">{wh.code}</span>
                {wh.is_production_floor ? (
                  <span className="badge badge-cyan">Shop Floor Line Buffer</span>
                ) : (
                  <span className="badge badge-emerald">Storage Yard</span>
                )}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                {wh.name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>
                Plant: <strong>North Machining Facility (PLT-01)</strong>
              </p>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Dedicated Bin Tracking: Active</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Operational</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 3: Work Centers */}
      {activeSubTab === 'workcenters' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {workCenters.map(wc => (
            <div key={wc.id} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="sku-tag">{wc.code}</span>
                <span className="badge badge-purple">${wc.hourly_cost}/hr</span>
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                {wc.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <div>Standard Daily Capacity: <strong>{wc.capacity_hours_per_day} Hours</strong></div>
                <div>Maintenance Status: <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Calibrated & Online</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 4: Partners (Suppliers & Customers) */}
      {activeSubTab === 'partners' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Suppliers */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={18} style={{ color: 'var(--primary)' }} />
              <span>Certified Suppliers</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {suppliers.map(sup => (
                <div key={sup.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#fff' }}>{sup.name}</strong>
                    <span className="sku-tag">{sup.code}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                    Contact: {sup.contact_person} • {sup.email}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 16 }}>
                    <span>Lead Time: <strong>{sup.lead_time_days} Days</strong></span>
                    <span>Rating: <strong style={{ color: 'var(--accent-amber)' }}>★ {sup.rating}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customers */}
          <div className="glass-card">
            <h3 className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} style={{ color: 'var(--secondary)' }} />
              <span>Enterprise Customers</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {customers.map(cust => (
                <div key={cust.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#fff' }}>{cust.name}</strong>
                    <span className="sku-tag">{cust.code}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                    Contact: {cust.contact_person} • {cust.email}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Dispatch Destination: {cust.shipping_address}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 5: Operations */}
      {activeSubTab === 'operations' && (
        <div className="glass-card" style={{ padding: 0 }}>
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="mfgos-table">
              <thead>
                <tr>
                  <th>Operation Code</th>
                  <th>Operation Name & Description</th>
                  <th>Default Work Center</th>
                  <th>Standard Cycle Time</th>
                  <th>Standard Setup</th>
                </tr>
              </thead>
              <tbody>
                {operations.map(op => (
                  <tr key={op.id}>
                    <td><span className="sku-tag">{op.code}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{op.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{op.description}</div>
                    </td>
                    <td>
                      <span className="badge badge-cyan">{op.default_work_center_name}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {op.standard_cycle_time_mins} mins / unit
                    </td>
                    <td style={{ color: 'var(--text-dim)' }}>15 mins</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {addItemModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Create New Master Item</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setAddItemModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Item SKU Code</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. RM-ALUM-6061"
                      className="form-input"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Item Type</label>
                    <select 
                      className="form-select"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as ItemType)}
                    >
                      <option value="RAW_MATERIAL">Raw Material</option>
                      <option value="FINISHED_GOOD">Finished Good</option>
                      <option value="WIP_ASSEMBLY">WIP Assembly</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Aluminum 6061-T6 Extruded Billet"
                    className="form-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description & Technical Specs</label>
                  <textarea 
                    className="form-textarea"
                    rows={2}
                    placeholder="Material specs, heat treat condition, dimensions..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Base UOM</label>
                    <select 
                      className="form-select"
                      value={newUom}
                      onChange={(e) => setNewUom(e.target.value)}
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="pcs">pcs (Piece)</option>
                      <option value="m">m (Meter)</option>
                      <option value="L">L (Liter)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input 
                      type="text"
                      className="form-input"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Safety Stock Threshold</label>
                    <input 
                      type="number"
                      step="any"
                      className="form-input"
                      value={newSafetyStock}
                      onChange={(e) => setNewSafetyStock(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Standard Cost ($)</label>
                    <input 
                      type="number"
                      step="any"
                      className="form-input"
                      value={newCost}
                      onChange={(e) => setNewCost(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddItemModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Master Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
