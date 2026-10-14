import React, { useState } from 'react';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './features/dashboard/DashboardView';
import { InventoryView } from './features/inventory/InventoryView';
import { MasterDataView } from './features/master-data/MasterDataView';
import { WorkflowsPreview } from './features/workflows/WorkflowsPreview';
import { DocsViewer } from './features/docs/DocsViewer';
import { StorageService } from './services/storage';
import { UserRole } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [activeOrgId, setActiveOrgId] = useState<string>(StorageService.getActiveOrgId());
  const [activePlantId, setActivePlantId] = useState<string>(StorageService.getActivePlantId());
  const [activeRole, setActiveRole] = useState<UserRole>(StorageService.getActiveRole());
  const [renderNonce, setRenderNonce] = useState(0);

  // Modals for Stock Operations
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);

  const forceRefresh = () => setRenderNonce(prev => prev + 1);

  const handleOrgChange = (orgId: string) => {
    StorageService.setActiveOrgId(orgId);
    setActiveOrgId(orgId);
    const availablePlants = StorageService.getPlants().filter(p => p.organization_id === orgId);
    if (availablePlants.length > 0) {
      StorageService.setActivePlantId(availablePlants[0].id);
      setActivePlantId(availablePlants[0].id);
    }
    forceRefresh();
  };

  const handlePlantChange = (plantId: string) => {
    StorageService.setActivePlantId(plantId);
    setActivePlantId(plantId);
    forceRefresh();
  };

  const handleRoleChange = (role: UserRole) => {
    StorageService.setActiveRole(role);
    setActiveRole(role);
    forceRefresh();
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo data back to clean initial engineering seed values?')) {
      StorageService.resetToDefault();
      setActiveOrgId(StorageService.getActiveOrgId());
      setActivePlantId(StorageService.getActivePlantId());
      setActiveRole('SUPER_ADMIN');
      forceRefresh();
    }
  };

  const closeAllModals = () => {
    setReceiveModalOpen(false);
    setIssueModalOpen(false);
    setTransferModalOpen(false);
    setAdjustModalOpen(false);
    forceRefresh();
  };

  return (
    <div className="app-container" key={renderNonce}>
      {/* Fixed Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar 
          activeOrgId={activeOrgId}
          activePlantId={activePlantId}
          activeRole={activeRole}
          onOrgChange={handleOrgChange}
          onPlantChange={handlePlantChange}
          onRoleChange={handleRoleChange}
          onResetData={handleResetDemoData}
        />

        <main className="page-body">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onOpenReceiveModal={() => setReceiveModalOpen(true)}
              onOpenIssueModal={() => setIssueModalOpen(true)}
              onOpenTransferModal={() => setTransferModalOpen(true)}
              onOpenAdjustModal={() => setAdjustModalOpen(true)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView 
              receiveModalOpen={receiveModalOpen}
              issueModalOpen={issueModalOpen}
              transferModalOpen={transferModalOpen}
              adjustModalOpen={adjustModalOpen}
              onCloseModals={closeAllModals}
              onOpenReceiveModal={() => setReceiveModalOpen(true)}
              onOpenIssueModal={() => setIssueModalOpen(true)}
              onOpenTransferModal={() => setTransferModalOpen(true)}
              onOpenAdjustModal={() => setAdjustModalOpen(true)}
            />
          )}

          {activeTab === 'master-data' && (
            <MasterDataView />
          )}

          {activeTab === 'workflows' && (
            <WorkflowsPreview />
          )}

          {activeTab === 'docs' && (
            <DocsViewer />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
