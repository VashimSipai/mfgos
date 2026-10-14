import React, { useState } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Workflow, WorkflowStage, UserRole } from '../../types';

export const WorkflowsPreview: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(StorageService.getWorkflows());
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [addStageModalOpen, setAddStageModalOpen] = useState(false);

  // New Stage form
  const [stageName, setStageName] = useState('');
  const [stageCode, setStageCode] = useState('');
  const [requiredRole, setRequiredRole] = useState<UserRole>('PROD_OPERATOR');
  const [requiresQc, setRequiresQc] = useState(false);
  const [durationHours, setDurationHours] = useState(2.0);

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName || !stageCode) return;

    const newStage: WorkflowStage = {
      id: `stg-${Date.now()}`,
      stage_code: stageCode.toUpperCase(),
      stage_name: stageName,
      sequence_order: (activeWorkflow?.stages.length || 0) + 1,
      required_role: requiredRole,
      requires_qc: requiresQc,
      estimated_duration_hours: Number(durationHours)
    };

    const updatedWorkflows = workflows.map(wf => {
      if (wf.id === activeWorkflow.id) {
        return {
          ...wf,
          stages: [...wf.stages, newStage]
        };
      }
      return wf;
    });

    setWorkflows(updatedWorkflows);
    setStageName('');
    setStageCode('');
    setAddStageModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-cyan">Core Project Innovation</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>Metadata-Driven Architecture</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: 6 }}>
            Configurable Manufacturing Workflow Engine
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Adapt production routes, gating quality checkpoints, and role access dynamically without rewriting code.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setAddStageModalOpen(true)}>
          <Plus size={16} />
          <span>Add Custom Stage</span>
        </button>
      </div>

      {/* Industry Workflow Selector (Dynamic Adaptability Showcase) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16, marginBottom: 28 }}>
        {workflows.map(wf => {
          const isSelected = wf.id === activeWorkflow.id;
          return (
            <div 
              key={wf.id}
              onClick={() => setSelectedWorkflowId(wf.id)}
              className="glass-card"
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                background: isSelected ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(129, 140, 248, 0.04))' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="sku-tag">{wf.code}</span>
                <span className="badge badge-purple">{wf.industry_preset}</span>
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                {wf.name}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                {wf.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <span>Stages: <strong style={{ color: '#fff' }}>{wf.stages.length}</strong></span>
                <span>QC Gates: <strong style={{ color: 'var(--accent-purple)' }}>{wf.stages.filter(s => s.requires_qc).length}</strong></span>
                <span style={{ color: isSelected ? 'var(--primary)' : 'var(--text-dim)', fontWeight: 600 }}>
                  {isSelected ? '● Active in Pipeline' : 'Click to inspect'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Pipeline Representation */}
      <div className="glass-card" style={{ marginBottom: 28 }}>
        <div className="card-header-row">
          <div>
            <h2 className="card-title">Live Visual Execution Pipeline</h2>
            <p className="card-subtitle">
              Current state machine configuration for <strong>{activeWorkflow.name}</strong>
            </p>
          </div>
          <span className="badge badge-emerald">
            <CheckCircle2 size={12} />
            <span>FSM Schema Valid</span>
          </span>
        </div>

        <div className="workflow-stepper">
          {activeWorkflow.stages.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              <div className={`workflow-step-card ${stage.requires_qc ? 'active' : ''}`} style={{ minWidth: 200 }}>
                <div className="step-num-badge">
                  <span>STAGE 0{stage.sequence_order}</span>
                  {stage.requires_qc && (
                    <span className="badge badge-purple" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                      Mandatory QC
                    </span>
                  )}
                </div>
                <div className="step-name">
                  {stage.stage_name}
                </div>
                <div className="step-meta" style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div>Code: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{stage.stage_code}</strong></div>
                  <div>Role: <strong style={{ color: 'var(--primary)' }}>{stage.required_role}</strong></div>
                  <div>Est: <strong>{stage.estimated_duration_hours}h</strong></div>
                </div>
              </div>
              {idx < activeWorkflow.stages.length - 1 && (
                <div className="step-arrow" style={{ fontSize: '1.25rem' }}>
                  <ArrowRight size={18} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Table: Configured Stages Breakdown */}
      <div className="glass-card" style={{ padding: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 className="card-title">Configured Stage Rules & Role Attribution</h3>
          <p className="card-subtitle">
            Database records read by web dashboard and Flutter mobile app to enforce stage transitions
          </p>
        </div>

        <div className="table-wrapper" style={{ border: 'none' }}>
          <table className="mfgos-table">
            <thead>
              <tr>
                <th>Seq #</th>
                <th>Stage Identifier</th>
                <th>Stage Display Title</th>
                <th>Permitted Execution Role</th>
                <th>Quality Gate Required?</th>
                <th>Est. Cycle Time</th>
                <th>Transition Status</th>
              </tr>
            </thead>
            <tbody>
              {activeWorkflow.stages.map((stage) => (
                <tr key={stage.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    0{stage.sequence_order}
                  </td>
                  <td>
                    <span className="sku-tag">{stage.stage_code}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#fff' }}>{stage.stage_name}</strong>
                  </td>
                  <td>
                    <span className="badge badge-cyan">{stage.required_role}</span>
                  </td>
                  <td>
                    {stage.requires_qc ? (
                      <span className="badge badge-purple">
                        <ShieldCheck size={12} />
                        <span>Quality Inspector Signoff</span>
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Standard Step</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {stage.estimated_duration_hours} Hours
                  </td>
                  <td>
                    <span className="badge badge-emerald">Enforced</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Stage Modal */}
      {addStageModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Configure Additional Manufacturing Stage</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setAddStageModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddStage}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Target Workflow Template</label>
                  <input 
                    type="text" 
                    disabled 
                    className="form-input" 
                    value={activeWorkflow.name}
                    style={{ opacity: 0.6 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Stage Code (Unique ID)</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. STAGE_HEAT_TREAT"
                      className="form-input"
                      value={stageCode}
                      onChange={(e) => setStageCode(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Est. Duration (Hours)</label>
                    <input 
                      type="number"
                      step="any"
                      min="0.5"
                      className="form-input"
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Stage Display Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Induction Hardening & Stress Relief"
                    className="form-input"
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Authorized Role Required for Execution</label>
                  <select 
                    className="form-select"
                    value={requiredRole}
                    onChange={(e) => setRequiredRole(e.target.value as UserRole)}
                  >
                    <option value="PROD_OPERATOR">Production Operator</option>
                    <option value="QC_INSPECTOR">Quality Inspector</option>
                    <option value="WHS_MGR">Warehouse Manager</option>
                    <option value="PROD_MGR">Production Manager</option>
                  </select>
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <input 
                    type="checkbox"
                    id="chkQc"
                    checked={requiresQc}
                    onChange={(e) => setRequiresQc(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <label htmlFor="chkQc" style={{ fontSize: '0.875rem', color: '#fff', cursor: 'pointer' }}>
                    Require formal Quality Inspector sign-off gate before proceeding
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAddStageModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stage to Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
