#!/usr/bin/env python3
import os
import subprocess
import sys

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MFGOS: 16-Week Engineering Development Roadmap</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 14mm 14mm 14mm 14mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
        font-weight: 600;
      }
      @bottom-left {
        content: "MFGOS Engineering Master Specification • 16-Week Release Roadmap";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
        font-weight: 500;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.42;
      font-size: 9pt;
      -webkit-font-smoothing: antialiased;
    }

    /* Cover / Header Section */
    .header-banner {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand-group {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .brand-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 7pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 2.5px 8px;
      border-radius: 4px;
      width: fit-content;
    }

    .doc-title {
      font-size: 18pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-top: 2px;
    }

    .doc-subtitle {
      font-size: 9pt;
      color: #64748b;
      margin-top: 2px;
      max-width: 500px;
    }

    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      text-align: right;
      font-size: 7.5pt;
      line-height: 1.5;
      color: #475569;
    }

    .meta-box strong {
      color: #0f172a;
    }

    /* Phase Architecture Grid */
    .overview-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 18px;
    }

    .section-label {
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #475569;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .phase-cards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .phase-pill-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .phase-pill-card.active {
      border-color: #0284c7;
      background: #f0f9ff;
    }

    .phase-pill-card .phase-num {
      font-size: 6.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0284c7;
      margin-bottom: 2px;
    }

    .phase-pill-card .phase-weeks {
      font-size: 7.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }

    .phase-pill-card .phase-desc {
      font-size: 7pt;
      color: #64748b;
      line-height: 1.3;
    }

    .phase-pill-card .phase-status-badge {
      font-size: 6pt;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 3px;
      margin-top: 6px;
      width: fit-content;
    }

    .status-delivered {
      background: #dcfce7;
      color: #15803d;
    }

    .status-scheduled {
      background: #f1f5f9;
      color: #475569;
    }

    /* Phase Header Banner */
    .phase-header-banner {
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .phase-1-bg { background: #0f172a; }
    .phase-2-bg { background: #1e1b4b; }
    .phase-3-bg { background: #0e7490; }
    .phase-4-bg { background: #065f46; }

    .phase-title-text {
      font-size: 10.5pt;
      font-weight: 800;
      letter-spacing: -0.01em;
    }

    .phase-title-tag {
      background: rgba(255, 255, 255, 0.18);
      font-size: 6.5pt;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    /* Weekly Card */
    .week-card {
      border: 1px solid #e2e8f0;
      border-radius: 7px;
      padding: 10px 14px;
      margin-bottom: 12px;
      background: #ffffff;
      page-break-inside: avoid;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .week-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 5px;
    }

    .week-title {
      font-size: 9.5pt;
      font-weight: 800;
      color: #0f172a;
    }

    .milestone-badge {
      font-size: 7pt;
      font-weight: 700;
      background: #f8fafc;
      color: #334155;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin-bottom: 8px;
    }

    .sub-section-title {
      font-size: 7pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 3px;
    }

    ul.clean-list {
      list-style-type: none;
      padding-left: 0;
    }

    ul.clean-list li {
      position: relative;
      padding-left: 12px;
      font-size: 8pt;
      color: #334155;
      margin-bottom: 2.5px;
      line-height: 1.35;
    }

    ul.clean-list li::before {
      content: "•";
      position: absolute;
      left: 1px;
      color: #0284c7;
      font-weight: bold;
      font-size: 9pt;
      top: -1px;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    /* Crisp Summary Callout */
    .summary-callout {
      background: #f0f9ff;
      border-left: 3px solid #0284c7;
      padding: 6px 10px;
      border-radius: 0 5px 5px 0;
      margin-top: 4px;
    }

    .summary-label {
      font-size: 6.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0369a1;
      margin-bottom: 1px;
    }

    .summary-text {
      font-size: 8pt;
      font-style: italic;
      color: #0c4a6e;
      line-height: 1.35;
    }

    /* Page Break Helper */
    .page-break {
      page-break-before: always;
    }

    /* Status Table */
    .status-table-container {
      margin-top: 14px;
      page-break-inside: avoid;
    }

    table.status-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }

    table.status-table th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 7px 10px;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7pt;
      letter-spacing: 0.05em;
    }

    table.status-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    table.status-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    .pill-complete {
      background: #dcfce7;
      color: #15803d;
      font-weight: 700;
      font-size: 6.5pt;
      padding: 2.5px 7px;
      border-radius: 999px;
      display: inline-block;
    }

    .pill-scheduled {
      background: #fef3c7;
      color: #b45309;
      font-weight: 700;
      font-size: 6.5pt;
      padding: 2.5px 7px;
      border-radius: 999px;
      display: inline-block;
    }
  </style>
</head>
<body>

  <!-- ==================================================================== -->
  <!-- PAGE 1: HEADER + TIMELINE OVERVIEW + PHASE 1 (WEEKS 01 - 02)         -->
  <!-- ==================================================================== -->
  
  <div class="header-banner">
    <div class="brand-group">
      <div class="brand-tag">MFGOS Platform Engineering</div>
      <h1 class="doc-title">16-Week Engineering Roadmap</h1>
      <p class="doc-subtitle">
        Master technical tracking specification for the development lifecycle of <strong>MFGOS (Configurable Manufacturing Operations System)</strong>.
      </p>
    </div>
    <div class="meta-box">
      <div><strong>Document Version:</strong> 1.0.0 (GA Specification)</div>
      <div><strong>Platform:</strong> Web (React/Vite) + Mobile (Flutter)</div>
      <div><strong>Database:</strong> PostgreSQL / Supabase Core</div>
      <div><strong>Current State:</strong> Phase 1 Delivered & Operational</div>
    </div>
  </div>

  <div class="overview-section">
    <div class="section-label">
      <span>Roadmap Architecture & Timeline Overview</span>
      <span style="color: #0284c7; font-weight: 700;">4 Months • 16 Sprints</span>
    </div>
    <div class="phase-cards-grid">
      <div class="phase-pill-card active">
        <div class="phase-num">Phase 1</div>
        <div class="phase-weeks">Weeks 01 – 04</div>
        <div class="phase-desc">Foundation, Multi-Tenant Schema, Auth, Master Data & Stock Ledger</div>
        <div class="phase-status-badge status-delivered">Delivered</div>
      </div>
      <div class="phase-pill-card">
        <div class="phase-num">Phase 2</div>
        <div class="phase-weeks">Weeks 05 – 08</div>
        <div class="phase-desc">Manufacturing Core, Multi-Level BOM, Routing & Production Orders</div>
        <div class="phase-status-badge status-scheduled">Scheduled</div>
      </div>
      <div class="phase-pill-card">
        <div class="phase-num">Phase 3</div>
        <div class="phase-weeks">Weeks 09 – 12</div>
        <div class="phase-desc">Configurable Workflow FSM, Quality Gates & Flutter Offline Sync</div>
        <div class="phase-status-badge status-scheduled">Scheduled</div>
      </div>
      <div class="phase-pill-card">
        <div class="phase-num">Phase 4</div>
        <div class="phase-weeks">Weeks 13 – 16</div>
        <div class="phase-desc">Executive Analytics, AI Insights, Testing & Production Release</div>
        <div class="phase-status-badge status-scheduled">Scheduled</div>
      </div>
    </div>
  </div>

  <div class="phase-header-banner phase-1-bg">
    <div class="phase-title-text">Phase 1: Foundation, Security & Operational Master Data</div>
    <div class="phase-title-tag">Weeks 01 – 04 • Completed & Operational</div>
  </div>

  <!-- Week 01 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 01: System Specifications, Architecture & Project Scaffolding</div>
      <div class="milestone-badge">Architecture & Foundation Setup</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Establish Software Requirements Specification (SRS) following IEEE standards.</li>
          <li>Architect system topology: Monorepo structure, data isolation model, and API contracts.</li>
          <li>Formulate database ER diagram and relational constraints.</li>
          <li>Initialize Git repository with branch policies, <code>.gitignore</code>, and CI/CD foundations.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li><code>docs/srs.md</code>, <code>docs/architecture.md</code>, <code>docs/database-design.md</code>, <code>docs/testing-strategy.md</code>.</li>
          <li>Monorepo layout (<code>apps/web</code>, <code>apps/mobile</code>, <code>supabase</code>, <code>docs</code>).</li>
          <li>Configured GitHub remote at <code>https://github.com/VashimSipai/mfgos</code>.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 1 finalized all core engineering documentation (IEEE-compliant SRS, System Architecture, Database Schema, and Testing Strategy), structured the monorepo workspace for Web and Mobile applications, and configured the Git repository with version control protocols.
      </div>
    </div>
  </div>

  <!-- Week 02 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 02: Multi-Tenant Schema, Supabase Auth & Role-Based Access Control (RBAC)</div>
      <div class="milestone-badge">Multi-Tenant Identity & Access Management</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Author and apply PostgreSQL migrations for organizations, plants, user profiles, roles, and permissions.</li>
          <li>Implement Row-Level Security (RLS) policies ensuring tenant and organization isolation.</li>
          <li>Setup authentication flow (Sign up, Sign in, Password recovery, Role attribution).</li>
          <li>Implement Super Admin, Production Manager, Warehouse Manager, and Operator role boundaries.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li><code>supabase/migrations/20261014000001_initial_schema.sql</code> (Tables, Foreign Keys, RLS policies).</li>
          <li>Web Authentication UI with responsive layout, session persistence, and role guards.</li>
          <li>Organization & Plant switcher in the navigation bar.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 2 deployed the multi-tenant database schema with strict Row-Level Security policies, configured role-based access control across 7 manufacturing roles, and implemented the full authentication and organization switching system.
      </div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PAGE 2: PHASE 1 (WEEKS 03 - 04)                                      -->
  <!-- ==================================================================== -->
  <div class="page-break"></div>

  <!-- Week 03 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 03: Master Data Management (MDM) Engine</div>
      <div class="milestone-badge">Foundational Manufacturing Catalog</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Products and Raw Materials with SKU, specifications, and barcode generation.</li>
          <li>Units of Measure (UOM) with conversion factors (kg, g, pieces, meters, liters).</li>
          <li>Suppliers and Customers with lead times and contact directory.</li>
          <li>Warehouses, Aisles, and Bin locations; Work Centers and Standard Production Operations.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Master Data UI modules in <code>apps/web/src/features/master-data/</code>.</li>
          <li>Client services, type-safe models, and validation schemas.</li>
          <li>Search, filtering, and pagination for items, suppliers, and locations.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 3 engineered the Master Data Management engine, enabling full lifecycle administration of products, raw materials, units of measure, warehouses, work centers, suppliers, and standard operation definitions.
      </div>
    </div>
  </div>

  <!-- Week 04 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 04: Inventory Engine, Stock Movement Ledger & Central Dashboard</div>
      <div class="milestone-badge">Transaction-Auditable Inventory Ledger</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Implement immutable stock movement ledger: receipts, issues, transfers, and adjustments.</li>
          <li>Build database triggers / stored procedures enforcing non-negative inventory rules and atomic balance calculations.</li>
          <li>Implement stock receipts against suppliers and stock adjustments with audit remarks.</li>
          <li>Develop primary Management Operations Dashboard featuring key inventory metrics, quick actions, and warehouse capacity cards.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li><code>supabase/migrations/20261014000002_inventory_ledger_functions.sql</code>.</li>
          <li>Inventory management screens in <code>apps/web/src/features/inventory/</code>.</li>
          <li>Interactive Management Dashboard with rich UI aesthetics, KPIs, and responsive charts.</li>
          <li>Full demo seed data covering an engineering gear manufacturing plant.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 4 delivered the transaction-safe inventory ledger with immutable stock movements, low-stock alerting, warehouse transfers, and the central Web Operations Dashboard equipped with real-time KPI metrics and seed data.
      </div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PAGE 3: PHASE 2 (WEEKS 05 - 06)                                      -->
  <!-- ==================================================================== -->
  <div class="page-break"></div>

  <div class="phase-header-banner phase-2-bg">
    <div class="phase-title-text">Phase 2: Manufacturing Core & Production Lifecycle</div>
    <div class="phase-title-tag">Weeks 05 – 08 • Scheduled</div>
  </div>

  <!-- Week 05 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 05: Bill of Materials (BOM) & Material Explosion Engine</div>
      <div class="milestone-badge">Product Engineering & Recipe Management</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Implement multi-level Bill of Materials (BOM) creation with revision tracking.</li>
          <li>Build component quantity calculators with scrap percentage allowance.</li>
          <li>Implement material explosion logic to calculate aggregate raw material needs for batch orders.</li>
          <li>Add BOM cost estimation based on standard material procurement prices.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Interactive BOM Builder with drag-and-drop hierarchy.</li>
          <li>Material calculation API ensuring unit-of-measure conversion accuracy.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 5 implemented the Bill of Materials (BOM) architecture with component revision control, scrap percentage estimation, and automated material requirement explosion for planned production runs.
      </div>
    </div>
  </div>

  <!-- Week 06 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 06: Manufacturing Routing & Work Center Scheduling</div>
      <div class="milestone-badge">Production Process Definition</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Define manufacturing routing sequences linking products to an ordered series of operations.</li>
          <li>Associate routing steps with target work centers, estimated cycle times, and setup durations.</li>
          <li>Implement work center capacity and bottleneck indicators.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Routing creation and visual sequence editor.</li>
          <li>Work center assignment matrix.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 6 created the manufacturing routing engine, mapping products to sequential operations, machine work centers, and estimated cycle times to enable accurate production planning.
      </div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PAGE 4: PHASE 2 (WEEKS 07 - 08)                                      -->
  <!-- ==================================================================== -->
  <div class="page-break"></div>

  <!-- Week 07 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 07: Production Order Lifecycle & Material Allocation</div>
      <div class="milestone-badge">Shop Floor Order Generation</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Build production order creation with target quantities, start/due dates, and batch identifiers.</li>
          <li>Automatic inventory check: highlight available, allocated, and shortage quantities.</li>
          <li>Implement transactional material reservation and material issuance to the shop floor.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Production order management workbench with status lifecycles (<code>Draft</code>, <code>Planned</code>, <code>Released</code>, <code>In-Progress</code>).</li>
          <li>Shop floor material dispatch slips.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 7 deployed the production order lifecycle manager, enabling automated material reservation, shortage detection, and material issue slips for release to the shop floor.
      </div>
    </div>
  </div>

  <!-- Week 08 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 08: Shop Floor Operation Execution & Scrap Tracking</div>
      <div class="milestone-badge">Work-In-Progress (WIP) Tracking</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Implement operator operation execution: Start, Pause, Resume, and Complete step.</li>
          <li>Record actual cycle times, operator identifiers, and completed vs. rejected counts.</li>
          <li>Automatic work-in-progress (WIP) transition to the next routing operation upon step completion.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Shop floor job traveler interface.</li>
          <li>WIP tracking matrix and defect reason classification logging.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 8 implemented shop-floor execution tracking for routing operations, capturing operator timestamps, real-time WIP transitions, and scrap quantity logging with defect categorization.
      </div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PAGE 5: PHASE 3 (WEEKS 09 - 10)                                      -->
  <!-- ==================================================================== -->
  <div class="page-break"></div>

  <div class="phase-header-banner phase-3-bg">
    <div class="phase-title-text">Phase 3: Configurability Engine & Mobile Offline Operations</div>
    <div class="phase-title-tag">Weeks 09 – 12 • Scheduled</div>
  </div>

  <!-- Week 09 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 09: Configurable Workflow State Machine</div>
      <div class="milestone-badge">Dynamic Process Engine</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Design the metadata-driven workflow engine storing stages, transition rules, and required roles in the database.</li>
          <li>Implement Administrative Visual Workflow Builder (customizing stages for Textile, Furniture, or Precision Engineering).</li>
          <li>Add transition validation: prevent unauthorized role jumps or skipping mandatory prerequisite stages.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li><code>workflows</code>, <code>workflow_stages</code>, and <code>workflow_transitions</code> database schema and API.</li>
          <li>Visual stage sequence builder with drag-and-drop reordering.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 9 built the configurable workflow engine, enabling administrators to dynamically define arbitrary manufacturing stages, permitted transitions, and mandatory role permissions without code modifications.
      </div>
    </div>
  </div>

  <!-- Week 10 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 10: Multi-Stage Approvals & Quality Inspection Gates</div>
      <div class="milestone-badge">Quality & Governance Checkpoints</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Implement configurable Quality Inspection Templates (parameters, tolerances, pass/fail thresholds).</li>
          <li>Enforce gating transitions: a production stage cannot complete until the required Quality Inspector approves the inspection form.</li>
          <li>Implement digital sign-off and historical audit log of all transition events.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Quality inspection template builder and execution modal.</li>
          <li>Audit log timeline showing "Who, What, When, and Outcome" for every order transition.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 10 incorporated configurable quality inspection gates into the workflow engine, enforcing mandatory quality sign-offs and maintaining an immutable audit history of all stage transitions.
      </div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PAGE 6: PHASE 3 (WEEKS 11 - 12)                                      -->
  <!-- ==================================================================== -->
  <div class="page-break"></div>

  <!-- Week 11 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 11: Flutter Factory Terminal & Mobile Operations</div>
      <div class="milestone-badge">Mobile Shop-Floor Client</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Build responsive Flutter mobile application targeting factory floor operators and supervisors.</li>
          <li>Implement operator authentication, role-tailored daily task dashboard, and assigned job lists.</li>
          <li>Provide barcode/QR scanning to rapidly pull up production order travelers and raw material lot tags.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Flutter application with clean Material 3 design in <code>apps/mobile/</code>.</li>
          <li>Operator task dispatch screen and mobile inspection forms.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 11 developed the Flutter mobile factory terminal with Material 3 design, delivering operator task queues, step execution interfaces, and rapid barcode/QR scanning for shop-floor job travelers.
      </div>
    </div>
  </div>

  <!-- Week 12 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 12: Offline-First Architecture & Bidirectional Sync Engine</div>
      <div class="milestone-badge">Industrial-Grade Offline Resilience</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Integrate SQLite / Drift for local caching of assigned orders, BOMs, and inspection templates.</li>
          <li>Implement offline mutation queue: write operations locally with UUIDs and idempotency keys.</li>
          <li>Build background sync manager: auto-detect connectivity restoration, drain the sync queue, handle optimistic UI updates, and resolve concurrency conflicts.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Local Drift database schema and repository layer in Flutter.</li>
          <li>Sync status indicator (Online / Offline / Syncing) with retry policies and duplicate protection.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 12 engineered the offline-first SQLite/Drift synchronization engine for Flutter, enabling operators to record completions and inspections without connectivity and auto-reconcile with Supabase upon reconnection.
      </div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PAGE 7: PHASE 4 (WEEKS 13 - 14)                                      -->
  <!-- ==================================================================== -->
  <div class="page-break"></div>

  <div class="phase-header-banner phase-4-bg">
    <div class="phase-title-text">Phase 4: Analytics, AI Insights, Hardening & Deployment</div>
    <div class="phase-title-tag">Weeks 13 – 16 • Scheduled</div>
  </div>

  <!-- Week 13 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 13: Executive Analytics & Operational Reporting</div>
      <div class="milestone-badge">Decision Intelligence & Metrics</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Build interactive charts using Recharts for production throughput, Overall Equipment Effectiveness (OEE) approximation, and scrap rates.</li>
          <li>Generate exportable reports for inventory valuations, supplier receipt ledgers, and order completion histories.</li>
          <li>Implement customizable date-range filtering and plant comparison views.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Executive Analytics dashboard in Web App.</li>
          <li>Report generator for management reviews.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 13 constructed the executive analytics suite with dynamic charts for production throughput, scrap percentages, inventory turnover, and exportable compliance reports.
      </div>
    </div>
  </div>

  <!-- Week 14 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 14: AI Operational Insights & Anomaly Detection</div>
      <div class="milestone-badge">Data-Backed Intelligence</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Integrate LLM API to analyze structured operational records and generate grounded narrative summaries.</li>
          <li>Identify scrap anomalies (e.g., "Work Center CNC-02 scrap rate spiked 4.2% on Material Lot ST-402").</li>
          <li>Predict potential stockout dates based on current production order burn rates.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>AI Insights widget on the Web Dashboard with prompt grounding against actual PostgreSQL aggregates.</li>
          <li>Anomaly detection alerts for supervisors.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 14 integrated the AI Operational Insights engine, providing automated, data-backed anomaly detection and scrap root-cause summaries without hallucinating metrics.
      </div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PAGE 8: PHASE 4 (WEEKS 15 - 16) + STATUS SUMMARY TABLE               -->
  <!-- ==================================================================== -->
  <div class="page-break"></div>

  <!-- Week 15 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 15: End-to-End Testing, Security Auditing & Performance Optimization</div>
      <div class="milestone-badge">System Verification & Validation</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Execute automated integration tests for inventory consistency and negative stock prevention.</li>
          <li>Perform RLS security audit verifying organization isolation across all endpoints.</li>
          <li>Stress test offline queue with 50+ bulk offline transactions to verify conflict-free sync.</li>
          <li>Optimize database indexes and bundle size for lightning-fast loads.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Automated test suites and test execution report.</li>
          <li>Security verification log documenting multi-tenant data isolation.</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 15 executed end-to-end testing, verifying atomic inventory transactions, multi-tenant RLS isolation, offline sync resilience under simulated network failure, and sub-second page performance.
      </div>
    </div>
  </div>

  <!-- Week 16 -->
  <div class="week-card">
    <div class="week-card-header">
      <div class="week-title">Week 16: Deployment, Final Documentation & Production Release</div>
      <div class="milestone-badge">Production Deployment & General Availability</div>
    </div>
    <div class="content-grid">
      <div>
        <div class="sub-section-title">Key Engineering Objectives</div>
        <ul class="clean-list">
          <li>Deploy Web Application to Vercel and Supabase cloud instance.</li>
          <li>Build Flutter production release bundle.</li>
          <li>Complete the comprehensive System Administration & Developer documentation.</li>
          <li>Prepare high-impact demonstration walkthrough video and operational scenario playbook.</li>
        </ul>
      </div>
      <div>
        <div class="sub-section-title">Technical Deliverables</div>
        <ul class="clean-list">
          <li>Live production web deployment link and downloadable Flutter release build.</li>
          <li>Technical Architecture Specification and API references.</li>
          <li>Dual-industry live demonstration scenario (Machining vs. Furniture).</li>
        </ul>
      </div>
    </div>
    <div class="summary-callout">
      <div class="summary-label">Crisp Weekly Summary</div>
      <div class="summary-text">
        Week 16 finalized the production deployments, compiled the complete system documentation package, and verified the dual-industry operational demonstration workflow.
      </div>
    </div>
  </div>

  <!-- STATUS SUMMARY TABLE -->
  <div class="status-table-container">
    <div class="section-label">
      <span>Lifecycle Status Summary</span>
      <span style="color: #15803d; font-weight: 700;">Phase 1 Operational</span>
    </div>
    <table class="status-table">
      <thead>
        <tr>
          <th style="width: 25%;">Phase</th>
          <th style="width: 55%;">Core Focus Area</th>
          <th style="width: 20%;">Operational Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Phase 1 (Weeks 01 – 04)</strong></td>
          <td>Foundation, Security, Master Data & Stock Movement Ledger</td>
          <td><span class="pill-complete">COMPLETED & OPERATIONAL</span></td>
        </tr>
        <tr>
          <td><strong>Phase 2 (Weeks 05 – 08)</strong></td>
          <td>Manufacturing Core, BOM, Routing & WIP Orders</td>
          <td><span class="pill-scheduled">SCHEDULED (Phase 2)</span></td>
        </tr>
        <tr>
          <td><strong>Phase 3 (Weeks 09 – 12)</strong></td>
          <td>Configurable Workflow Engine & Mobile Offline Sync</td>
          <td><span class="pill-scheduled">SCHEDULED (Phase 3)</span></td>
        </tr>
        <tr>
          <td><strong>Phase 4 (Weeks 13 – 16)</strong></td>
          <td>Analytics, AI Insights, Testing & Production Release</td>
          <td><span class="pill-scheduled">SCHEDULED (Phase 4)</span></td>
        </tr>
      </tbody>
    </table>
  </div>

</body>
</html>
"""

def main():
    workspace = "/Users/vashimsipai/Desktop/Major Project-2"
    html_path = os.path.join(workspace, "docs", "roadmap_print_view.html")
    pdf_path = os.path.join(workspace, "docs", "MFGOS_16_Week_Development_Roadmap.pdf")

    print(f"Generating print-formatted HTML at: {html_path}")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)

    chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if not os.path.exists(chrome_bin):
        print(f"Error: Google Chrome not found at {chrome_bin}", file=sys.stderr)
        sys.exit(1)

    cmd = [
        chrome_bin,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]

    print(f"Compiling PDF via headless Chrome engine...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 0:
        file_size_kb = os.path.getsize(pdf_path) / 1024
        print(f"Success! PDF created at: {pdf_path} ({file_size_kb:.1f} KB)")
    else:
        print(f"PDF creation failed: {res.stderr}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
