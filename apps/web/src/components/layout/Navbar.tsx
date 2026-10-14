import React from 'react';
import { 
  Building2, 
  Factory, 
  ShieldCheck, 
  RotateCcw, 
  ChevronDown
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { UserRole } from '../../types';

interface NavbarProps {
  activeOrgId: string;
  activePlantId: string;
  activeRole: UserRole;
  onOrgChange: (orgId: string) => void;
  onPlantChange: (plantId: string) => void;
  onRoleChange: (role: UserRole) => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeOrgId,
  activePlantId,
  activeRole,
  onOrgChange,
  onPlantChange,
  onRoleChange,
  onResetData
}) => {
  const organizations = StorageService.getOrganizations();
  const plants = StorageService.getPlants().filter(
    p => p.organization_id === activeOrgId
  );

  const roleLabels: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Administrator',
    PROD_MGR: 'Production Manager',
    PROD_OPERATOR: 'Machine Operator',
    WHS_MGR: 'Warehouse Manager',
    QC_INSPECTOR: 'Quality Inspector',
    PURCHASE_MGR: 'Purchase Manager',
    SALES_MGR: 'Sales Manager'
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        {/* Multi-Tenant Organization Switcher */}
        <div className="context-selector-group">
          <Building2 size={16} style={{ color: 'var(--primary)' }} />
          <select 
            className="context-selector"
            value={activeOrgId}
            onChange={(e) => onOrgChange(e.target.value)}
            title="Active Organization Tenant"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.code})
              </option>
            ))}
          </select>

          <div className="context-divider" />

          {/* Plant Switcher */}
          <Factory size={16} style={{ color: 'var(--primary)' }} />
          <select 
            className="context-selector"
            value={activePlantId}
            onChange={(e) => onPlantChange(e.target.value)}
            title="Active Production Plant"
          >
            {plants.length > 0 ? (
              plants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))
            ) : (
              <option value="">No Plants Configured</option>
            )}
          </select>
        </div>
      </div>

      <div className="navbar-right">
        {/* Engine Status */}
        <div className="system-status-chip" title="Immutable Ledger & RLS Active">
          <div className="status-dot-pulse" />
          <span>Ledger Engine Active</span>
        </div>

        {/* Role-Based Access Control Switcher */}
        <div className="context-selector-group" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
          <select 
            className="context-selector"
            style={{ color: 'var(--primary)', fontWeight: 600 }}
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            title="Switch Simulated Role for Demonstration"
          >
            {(Object.keys(roleLabels) as UserRole[]).map(role => (
              <option key={role} value={role}>
                Role: {roleLabels[role]}
              </option>
            ))}
          </select>
          <ChevronDown size={14} style={{ color: 'var(--primary)' }} />
        </div>

        {/* Quick Reset Button for Viva Demo */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetData}
          title="Reset database to initial demonstration seed data"
        >
          <RotateCcw size={14} />
          <span>Reset Demo</span>
        </button>

        {/* User Profile */}
        <div className="user-profile-badge">
          <div className="user-avatar" title="Authenticated User">
            VS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff' }}>
              Vashim Sipai
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
              Chief Systems Architect
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
