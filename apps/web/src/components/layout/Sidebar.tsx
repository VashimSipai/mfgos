import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Database, 
  GitFork, 
  FileText, 
  Cpu, 
  GraduationCap
} from 'lucide-react';

export type NavigationTab = 'dashboard' | 'inventory' | 'master-data' | 'workflows' | 'docs';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-icon-box">
          <Cpu size={22} />
        </div>
        <div className="logo-text-group">
          <div className="logo-title">
            MFGOS <span>v1.0</span>
          </div>
          <div className="logo-subtitle">
            Manufacturing OS
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Core Operations</div>
        
        <button 
          className={`nav-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          <LayoutDashboard size={18} />
          <span>Operations Dashboard</span>
        </button>

        <button 
          className={`nav-link-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => onTabChange('inventory')}
        >
          <Boxes size={18} />
          <span>Inventory & Ledger</span>
        </button>

        <button 
          className={`nav-link-btn ${activeTab === 'master-data' ? 'active' : ''}`}
          onClick={() => onTabChange('master-data')}
        >
          <Database size={18} />
          <span>Master Data (MDM)</span>
        </button>

        <div className="nav-section-label">Configurability Engine</div>

        <button 
          className={`nav-link-btn ${activeTab === 'workflows' ? 'active' : ''}`}
          onClick={() => onTabChange('workflows')}
        >
          <GitFork size={18} />
          <span>Configurable Workflows</span>
        </button>

        <div className="nav-section-label">Engineering Docs</div>

        <button 
          className={`nav-link-btn ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => onTabChange('docs')}
        >
          <FileText size={18} />
          <span>Major Project Blueprint</span>
        </button>
      </nav>

      {/* Academic Defense Footer */}
      <div className="sidebar-footer">
        <div className="academic-badge">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GraduationCap size={14} style={{ color: 'var(--primary)' }} />
            <span className="academic-badge-title">Final-Year B.Tech</span>
          </div>
          <span className="academic-badge-desc">
            Computer Engineering Major Project
          </span>
          <span style={{ fontSize: '0.625rem', color: 'var(--primary)', fontWeight: 600 }}>
            Month 1 (Weeks 1-4) Delivered
          </span>
        </div>
      </div>
    </aside>
  );
};
