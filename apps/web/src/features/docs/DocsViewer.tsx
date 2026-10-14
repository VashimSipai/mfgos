import React, { useState } from 'react';
import { 
  FileText, 
  Map, 
  Layers, 
  Database, 
  CheckSquare, 
  ExternalLink,
  Code
} from 'lucide-react';

export const DocsViewer: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<'roadmap' | 'problem' | 'srs' | 'architecture' | 'database' | 'testing'>('roadmap');

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-purple">Academic Documentation Package</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>IEEE-Compliant Major Project</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: 6 }}>
            MFGOS Engineering Blueprint & Viva Documentation
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Formal specifications, architectural models, and 16-week developmental milestones for examination.
          </p>
        </div>

        <a 
          href="https://github.com/VashimSipai/mfgos" 
          target="_blank" 
          rel="noreferrer"
          className="btn btn-secondary"
        >
          <Code size={16} />
          <span>GitHub: VashimSipai/mfgos</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Doc Navigation Tabs */}
      <div className="tab-list">
        <button 
          className={`tab-btn ${selectedDoc === 'roadmap' ? 'active' : ''}`}
          onClick={() => setSelectedDoc('roadmap')}
        >
          <Map size={16} />
          <span>16-Week Roadmap & Weekly Summaries</span>
        </button>

        <button 
          className={`tab-btn ${selectedDoc === 'problem' ? 'active' : ''}`}
          onClick={() => setSelectedDoc('problem')}
        >
          <FileText size={16} />
          <span>Problem Statement & Value Prop</span>
        </button>

        <button 
          className={`tab-btn ${selectedDoc === 'srs' ? 'active' : ''}`}
          onClick={() => setSelectedDoc('srs')}
        >
          <CheckSquare size={16} />
          <span>IEEE 830 SRS Specification</span>
        </button>

        <button 
          className={`tab-btn ${selectedDoc === 'architecture' ? 'active' : ''}`}
          onClick={() => setSelectedDoc('architecture')}
        >
          <Layers size={16} />
          <span>System Architecture</span>
        </button>

        <button 
          className={`tab-btn ${selectedDoc === 'database' ? 'active' : ''}`}
          onClick={() => setSelectedDoc('database')}
        >
          <Database size={16} />
          <span>Relational Schema & Ledger</span>
        </button>

        <button 
          className={`tab-btn ${selectedDoc === 'testing' ? 'active' : ''}`}
          onClick={() => setSelectedDoc('testing')}
        >
          <CheckSquare size={16} />
          <span>Testing Strategy & Viva Script</span>
        </button>
      </div>

      {/* Document Content Container */}
      <div className="glass-card" style={{ padding: 32, lineHeight: 1.7 }}>
        {selectedDoc === 'roadmap' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                16-Week Master Engineering Development Roadmap
              </h2>
              <span className="badge badge-emerald">Weeks 1-4 Delivered</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Month 1 */}
              <div style={{ background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Month 1 (Weeks 01 - 04): Foundation, Security, Master Data & Stock Ledger
                  </h3>
                  <span className="badge badge-emerald">COMPLETED</span>
                </div>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-main)', fontSize: '0.875rem' }}>
                  <li>
                    <strong>Week 01 — Specifications & Architecture:</strong> IEEE SRS, Monorepo layout, PostgreSQL schema design, and GitHub repository configuration.
                    <br />
                    <em>Crisp Summary: Finalized all foundational engineering specs and structured monorepo workspace for web and mobile terminals.</em>
                  </li>
                  <li>
                    <strong>Week 02 — Multi-Tenant Schema & RBAC:</strong> Row-Level Security (RLS) policies, organization and plant hierarchy, user profile linking, and 7 manufacturing role boundaries.
                    <br />
                    <em>Crisp Summary: Deployed multi-tenant database schema with strict RLS isolation and role-based access control.</em>
                  </li>
                  <li>
                    <strong>Week 03 — Master Data Management (MDM):</strong> Products, raw materials, units of measure, warehouses, work centers, suppliers, customers, and standard operations.
                    <br />
                    <em>Crisp Summary: Engineered the master data catalog with type-safe domain models, validation, and search.</em>
                  </li>
                  <li>
                    <strong>Week 04 — Inventory Ledger & Central Dashboard:</strong> Immutable double-entry stock movement ledger, non-negative invariants, warehouse transfers, adjustments, and operations dashboard.
                    <br />
                    <em>Crisp Summary: Delivered the transaction-safe inventory ledger with non-negative stock guards, audit trails, and executive operations dashboard.</em>
                  </li>
                </ul>
              </div>

              {/* Month 2 */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
                    Month 2 (Weeks 05 - 08): Manufacturing Core, BOM, Routing & WIP Orders
                  </h3>
                  <span className="badge badge-amber">SCHEDULED</span>
                </div>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <li><strong>Week 05:</strong> Multi-level Bill of Materials (BOM) creation, revision control, and automated material explosion.</li>
                  <li><strong>Week 06:</strong> Manufacturing routing sequences, work center scheduling, and hourly capacity planning.</li>
                  <li><strong>Week 07:</strong> Production order releases, shortage detection, and transactional material reservation.</li>
                  <li><strong>Week 08:</strong> Shop-floor operation execution, cycle time tracking, and scrap/defect classification.</li>
                </ul>
              </div>

              {/* Month 3 */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
                    Month 3 (Weeks 09 - 12): Configurable Workflow Engine & Flutter Mobile Offline Sync
                  </h3>
                  <span className="badge badge-cyan">SCHEDULED</span>
                </div>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <li><strong>Week 09:</strong> Dynamic FSM workflow engine with visual administrative stage sequence builder.</li>
                  <li><strong>Week 10:</strong> Quality inspection templates, mandatory sign-off checkpoints, and transition history audit log.</li>
                  <li><strong>Week 11:</strong> Flutter mobile terminal development, operator task dispatching, and barcode/QR scanner integration.</li>
                  <li><strong>Week 12:</strong> Offline SQLite/Drift persistence, idempotent background synchronization, and conflict resolution.</li>
                </ul>
              </div>

              {/* Month 4 */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
                    Month 4 (Weeks 13 - 16): Executive Analytics, Testing, Hardening & Viva Defense
                  </h3>
                  <span className="badge badge-purple">SCHEDULED</span>
                </div>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <li><strong>Week 13:</strong> Executive analytics dashboard with dynamic Recharts for throughput, scrap rates, and stock turnover.</li>
                  <li><strong>Week 14:</strong> Grounded AI operational insights for scrap anomaly detection and stockout burn rate warnings.</li>
                  <li><strong>Week 15:</strong> Stress testing, RLS security audit, concurrency testing, and sub-second performance optimization.</li>
                  <li><strong>Week 16:</strong> Cloud deployment (Vercel + Supabase), comprehensive 100+ page project dissertation, and viva presentation deck.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedDoc === 'problem' && (
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              Crisp Problem Statement & Core Value Proposition
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--text-main)', fontSize: '0.9375rem' }}>
              <p>
                <strong>The Operational Paradox in Modern Manufacturing:</strong> Small and Medium discrete manufacturing enterprises (precision machining, timber fabrication, textile finishing) face a severe operational trilemma:
              </p>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 18, borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li><strong>Commercial ERP Rigidity:</strong> Monolithic enterprise solutions (SAP, Oracle) demand exorbitant licensing and force rigid, inflexible workflows that fail to reflect agile SME shop-floor operations.</li>
                  <li><strong>Custom Software Fragility:</strong> Bespoke applications hardcode stage transitions in code. Introducing a new turning, heat treatment, or ultrasonic testing stage requires software redeployment and engineering overhead.</li>
                  <li><strong>Spreadsheet & Shop-Floor Blind Spots:</strong> Disconnected paper travelers and Excel logs cause phantom inventory, delayed stockout discoveries, and zero audit traceability.</li>
                </ol>
              </div>
              <p>
                <strong>MFGOS Solution:</strong> Decouples the manufacturing execution pipeline from the underlying software code. By storing production routing, required roles, and gating quality checks as database entities, one unified platform executes high-precision machining, custom furniture fabrication, or textile processing seamlessly.
              </p>
            </div>
          </div>
        )}

        {selectedDoc === 'srs' && (
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              IEEE 830-1998 Software Requirements Specification (Summary)
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
              Full specification available in <code className="sku-tag">docs/srs.md</code> in the repository root.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>FR-INV-01: Immutable Ledger</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Every stock shift MUST record an immutable entry in <code className="sku-tag">stock_movements</code>. Destructive total overrides are prohibited.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>FR-INV-03: Non-Negative Invariant</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Database transactions abort with <code className="sku-tag">ERR_INSUFFICIENT_STOCK</code> if any operation attempts to drive stock below zero.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>FR-ENG-01: Dynamic FSM Routing</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Workflows, stages, required operator roles, and quality checks are metadata-driven and dynamically loaded at runtime.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ color: 'var(--primary)', fontWeight: 700, marginBottom: 8 }}>FR-MOB-01: Offline-First Drift</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Flutter terminal persists assigned jobs to local SQLite via Drift with UUID v4 idempotency keys for automatic replay upon reconnect.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedDoc === 'architecture' && (
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              Modular Monolith & Topology Architecture
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
              Full specification available in <code className="sku-tag">docs/architecture.md</code>.
            </p>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: 20, borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-muted)', overflowX: 'auto' }}>
              <pre>{`MFGOS PLATFORM TOPOLOGY:
========================================================================
Management Web (React + TS + Vite)   <-->   Supabase PostgREST Gateway
Mobile Shop Terminal (Flutter + Dart) <-->   Local Drift (SQLite) & Queue
PostgreSQL 15+ Core:
  ├── Row-Level Security (Tenant Isolation via auth.uid())
  ├── Double-Entry Stock Movement Ledger
  ├── Dynamic Workflow Finite State Machine
  └── Atomic Stored Procedures & Invariant Triggers
========================================================================`}</pre>
            </div>
          </div>
        )}

        {selectedDoc === 'database' && (
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              Database Schema & Double-Entry Ledger
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
              Full DDL migrations available in <code className="sku-tag">supabase/migrations/</code>.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 14 }}>
              The schema enforces multi-tenant isolation, immutable stock audit trails, and atomic inventory shifts:
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span className="sku-tag">organizations</span>
              <span className="sku-tag">plants</span>
              <span className="sku-tag">organization_members (RBAC)</span>
              <span className="sku-tag">items (Products/Raw)</span>
              <span className="sku-tag">warehouses</span>
              <span className="sku-tag">stock_movements (Ledger)</span>
              <span className="sku-tag">item_warehouse_stock (Balances)</span>
              <span className="sku-tag">workflows</span>
              <span className="sku-tag">workflow_stages</span>
              <span className="sku-tag">production_orders</span>
            </div>
          </div>
        )}

        {selectedDoc === 'testing' && (
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              Testing Strategy & Academic Viva Defense Script
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
              Full verification procedures documented in <code className="sku-tag">docs/testing-strategy.md</code>.
            </p>
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <h4 style={{ color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: 8 }}>
                The 10-Step Live Viva Demonstration Flow:
              </h4>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8125rem', color: 'var(--text-main)' }}>
                <li>Log in as Super Admin; showcase multi-plant and organization switcher.</li>
                <li>Inspect Industrial Gear master record and associated raw materials (Alloy Steel, Bearings, Bolts).</li>
                <li>Receive 500 kg Alloy Steel into Raw Materials Yard; inspect real-time ledger timestamp.</li>
                <li>Display Configurable Workflow Builder: show 5-stage precision turning route.</li>
                <li>Release Order #PO-2026-001 for 100 Industrial Gears.</li>
                <li>Issue materials to production; verify negative stock prevention trigger.</li>
                <li>Record operator execution: 96 accepted, 4 scrap.</li>
                <li>Quality Inspector records CMM sign-off; approve batch.</li>
                <li>Verify finished goods stock increments by exactly +96 units.</li>
                <li>Switch to Furniture Workflow and prove configurability without changing application code!</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
