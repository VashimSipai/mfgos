import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Database, 
  GitFork, 
  FileText, 
  Cpu
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
        <div className="nav-section-label">Operations</div>
        
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

        <div className="nav-section-label">Configurability</div>

        <button 
          className={`nav-link-btn ${activeTab === 'workflows' ? 'active' : ''}`}
          onClick={() => onTabChange('workflows')}
        >
          <GitFork size={18} />
          <span>Configurable Workflows</span>
        </button>

        <div className="nav-section-label">Documentation</div>

        <button 
          className={`nav-link-btn ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => onTabChange('docs')}
        >
          <FileText size={18} />
          <span>System Specifications</span>
        </button>
      </nav>

      {/* System Status Footer */}
      <div className="sidebar-footer">
        <div className="system-tier-badge">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cpu size={14} style={{ color: 'var(--primary)' }} />
            <span className="system-tier-title">MFGOS Core</span>
          </div>
          <span className="system-tier-desc">
            Configurable Manufacturing Platform
          </span>
          <span style={{ fontSize: '0.625rem', color: 'var(--accent-emerald)', fontWeight: 600, marginTop: 2 }}>
            ● Engine v1.0.0 Online
          </span>
        </div>
      </div>
    </aside>
  );
};
