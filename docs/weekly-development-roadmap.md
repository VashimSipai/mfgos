# MFGOS: 16-Week Engineering Development Roadmap

This document serves as the master tracking specification for the 4-month (16-week) lifecycle of **MFGOS (Configurable Manufacturing Operations System)**. Every week outlines concrete objectives, tasks, deliverables, and a short summary of accomplishments.

---

## Roadmap Overview & Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MFGOS 16-WEEK TIMELINE                          │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┤
│    MONTH 1      │     MONTH 2      │     MONTH 3     │     MONTH 4     │
│ (WEEKS 01 - 04) │ (WEEKS 05 - 08)  │ (WEEKS 09 - 12) │ (WEEKS 13 - 16) │
├─────────────────┼──────────────────┼─────────────────┼─────────────────┤
│ Foundation,     │ Manufacturing    │ Configurability │ Analytics,      │
│ Schema, Auth &  │ Core, BOM &      │ Engine & Mobile │ Testing, QA &   │
│ Master Data,    │ Production Order │ Offline Sync    │ Viva Submission │
│ Stock Ledger    │ Execution        │                 │                 │
└─────────────────┴──────────────────┴─────────────────┴─────────────────┘
```

---

## Month 1: Foundation, Security & Operational Master Data

### Week 01: System Specifications, Architecture & Project Scaffolding
- **Milestone:** Project Blueprint & Foundation Setup
- **Objectives:**
  - Establish complete Software Requirements Specification (SRS) following IEEE guidelines.
  - Architect system topology: Monorepo structure, data isolation model, and API contracts.
  - Formulate database ER diagram and relational constraints.
  - Initialize Git repository with branch policies, `.gitignore`, and CI/CD foundations.
- **Deliverables:**
  - `docs/srs.md`, `docs/architecture.md`, `docs/database-design.md`, `docs/testing-strategy.md`.
  - Monorepo folder layout (`apps/web`, `apps/mobile`, `supabase`, `docs`).
  - Git remote configured to `https://github.com/VashimSipai/mfgos`.
- **Crisp Weekly Summary:**
  > *Week 1 finalized all core engineering documentation (IEEE-compliant SRS, System Architecture, Database Schema, and Testing Strategy), structured the monorepo workspace for Web and Mobile applications, and configured the Git repository with version control protocols.*

---

### Week 02: Multi-Tenant Schema, Supabase Auth & Role-Based Access Control (RBAC)
- **Milestone:** Secure Foundation & Identity Management
- **Objectives:**
  - Author and apply PostgreSQL migrations for organizations, plants, user profiles, roles, and permissions.
  - Implement Row-Level Security (RLS) policies ensuring tenant and organization isolation.
  - Setup authentication flow (Sign up, Sign in, Password recovery, Role attribution).
  - Implement Super Admin, Production Manager, Warehouse Manager, and Operator role boundaries.
- **Deliverables:**
  - `supabase/migrations/20261014000001_initial_schema.sql` (Tables, Foreign Keys, RLS policies).
  - Web Authentication UI with responsive layout, session persistence, and role guards.
  - Organization & Plant switcher in the navigation bar.
- **Crisp Weekly Summary:**
  > *Week 2 deployed the multi-tenant database schema with strict Row-Level Security policies, configured role-based access control across 7 manufacturing roles, and implemented the full authentication and organization switching system.*

---

### Week 03: Master Data Management (MDM) Engine
- **Milestone:** Foundational Manufacturing Entities
- **Objectives:**
  - Implement CRUD interfaces and database contracts for:
    - Products (Finished Goods) and Raw Materials with SKU, specifications, and barcode generation.
    - Units of Measure (UOM) with conversion factors (kg, g, pieces, meters, liters).
    - Suppliers and Customers with lead times and contact directory.
    - Warehouses, Aisles, and Bin locations.
    - Work Centers (Machines, Assembly stations) with hourly capacities.
    - Standard Production Operations (Cutting, Machining, Welding, Assembly, Polishing, QC).
- **Deliverables:**
  - Master Data UI modules in `apps/web/src/features/master-data/`.
  - Client services, type-safe models, and validation schemas.
  - Search, filtering, and pagination for items, suppliers, and locations.
- **Crisp Weekly Summary:**
  > *Week 3 engineered the Master Data Management engine, enabling full lifecycle administration of products, raw materials, units of measure, warehouses, work centers, suppliers, and standard operation definitions.*

---

### Week 04: Inventory Engine, Stock Movement Ledger & Initial Operations Dashboard
- **Milestone:** Transaction-Auditable Inventory Ledger
- **Objectives:**
  - Implement immutable stock movement ledger: receipts, issues, transfers, and adjustments.
  - Build database triggers / stored procedures enforcing non-negative inventory rules and atomic balance calculations.
  - Implement stock receipts against suppliers and stock adjustments with audit remarks.
  - Build low-stock alert thresholds with visual status indicators.
  - Develop the primary Management Operations Dashboard featuring key inventory metrics, quick actions, stock movement timeline, and warehouse capacity cards.
- **Deliverables:**
  - `supabase/migrations/20261014000002_inventory_ledger_functions.sql`.
  - Inventory management screens in `apps/web/src/features/inventory/`.
  - Interactive Management Dashboard with rich UI aesthetics, KPIs, and responsive charts.
  - Full demo seed data covering an engineering gear manufacturing plant.
- **Crisp Weekly Summary:**
  > *Week 4 delivered the transaction-safe inventory ledger with immutable stock movements, low-stock alerting, warehouse transfers, and the central Web Operations Dashboard equipped with real-time KPI metrics and seed data.*

---

## Month 2: Manufacturing Core & Production Lifecycle

### Week 05: Bill of Materials (BOM) & Material Explosion Engine
- **Milestone:** Product Engineering & Recipe Management
- **Objectives:**
  - Implement multi-level Bill of Materials (BOM) creation with revision tracking.
  - Build component quantity calculators with scrap percentage allowance.
  - Implement material explosion logic to calculate aggregate raw material needs for batch orders.
  - Add BOM cost estimation based on standard material procurement prices.
- **Deliverables:**
  - Interactive BOM Builder with drag-and-drop hierarchy.
  - Material calculation API ensuring unit-of-measure conversion accuracy.
- **Crisp Weekly Summary:**
  > *Week 5 implemented the Bill of Materials (BOM) architecture with component revision control, scrap percentage estimation, and automated material requirement explosion for planned production runs.*

---

### Week 06: Manufacturing Routing & Work Center Scheduling
- **Milestone:** Production Process Definition
- **Objectives:**
  - Define manufacturing routing sequences linking products to an ordered series of operations.
  - Associate routing steps with target work centers, estimated cycle times, and setup durations.
  - Implement work center capacity and bottleneck indicators.
- **Deliverables:**
  - Routing creation and visual sequence editor.
  - Work center assignment matrix.
- **Crisp Weekly Summary:**
  > *Week 6 created the manufacturing routing engine, mapping products to sequential operations, machine work centers, and estimated cycle times to enable accurate production planning.*

---

### Week 07: Production Order Lifecycle & Material Allocation
- **Milestone:** Shop Floor Order Generation
- **Objectives:**
  - Build production order creation with target quantities, start/due dates, and batch identifiers.
  - Automatic inventory check: highlight available, allocated, and shortage quantities.
  - Implement transactional material reservation and material issuance to the shop floor.
- **Deliverables:**
  - Production order management workbench with status lifecycles (`Draft`, `Planned`, `Released`, `In-Progress`).
  - Shop floor material dispatch slips.
- **Crisp Weekly Summary:**
  > *Week 7 deployed the production order lifecycle manager, enabling automated material reservation, shortage detection, and material issue slips for release to the shop floor.*

---

### Week 08: Shop Floor Operation Execution & Scrap Tracking
- **Milestone:** Work-In-Progress (WIP) Tracking
- **Objectives:**
  - Implement operator operation execution: Start, Pause, Resume, and Complete step.
  - Record actual cycle times, operator identifiers, and completed vs. rejected counts.
  - Automatic work-in-progress (WIP) transition to the next routing operation upon step completion.
- **Deliverables:**
  - Shop floor job traveler interface.
  - WIP tracking matrix and defect reason classification logging.
- **Crisp Weekly Summary:**
  > *Week 8 implemented shop-floor execution tracking for routing operations, capturing operator timestamps, real-time WIP transitions, and scrap quantity logging with defect categorization.*

---

## Month 3: Configurability Engine & Mobile Offline Operations

### Week 09: Configurable Workflow State Machine
- **Milestone:** The Core Differentiator: Dynamic Process Engine
- **Objectives:**
  - Design the metadata-driven workflow engine storing stages, transition rules, and required roles in the database.
  - Implement the Administrative Visual Workflow Builder (customizing stages for Textile, Furniture, or Precision Engineering).
  - Add transition validation: prevent unauthorized role jumps or skipping mandatory prerequisite stages.
- **Deliverables:**
  - `workflows`, `workflow_stages`, and `workflow_transitions` database schema and API.
  - Visual stage sequence builder with drag-and-drop reordering.
- **Crisp Weekly Summary:**
  > *Week 9 built the configurable workflow engine, enabling administrators to dynamically define arbitrary manufacturing stages, permitted transitions, and mandatory role permissions without code modifications.*

---

### Week 10: Multi-Stage Approvals & Quality Inspection Gates
- **Milestone:** Quality & Governance Checkpoints
- **Objectives:**
  - Implement configurable Quality Inspection Templates (parameters, tolerances, pass/fail thresholds).
  - Enforce gating transitions: a production stage cannot complete until the required Quality Inspector approves the inspection form.
  - Implement digital sign-off and historical audit log of all transition events.
- **Deliverables:**
  - Quality inspection template builder and execution modal.
  - Audit log timeline showing "Who, What, When, and Outcome" for every order transition.
- **Crisp Weekly Summary:**
  > *Week 10 incorporated configurable quality inspection gates into the workflow engine, enforcing mandatory quality sign-offs and maintaining an immutable audit history of all stage transitions.*

---

### Week 11: Flutter Factory Terminal & Mobile Operations
- **Milestone:** Mobile Shop-Floor Client
- **Objectives:**
  - Build responsive Flutter mobile application targeting factory floor operators and supervisors.
  - Implement operator authentication, role-tailored daily task dashboard, and assigned job lists.
  - Provide barcode/QR scanning to rapidly pull up production order travelers and raw material lot tags.
- **Deliverables:**
  - Flutter application with clean Material 3 design in `apps/mobile/`.
  - Operator task dispatch screen and mobile inspection forms.
- **Crisp Weekly Summary:**
  > *Week 11 developed the Flutter mobile factory terminal with Material 3 design, delivering operator task queues, step execution interfaces, and rapid barcode/QR scanning for shop-floor job travelers.*

---

### Week 12: Offline-First Architecture & Bidirectional Sync Engine
- **Milestone:** Industrial-Grade Offline Resilience
- **Objectives:**
  - Integrate SQLite / Drift for local caching of assigned orders, BOMs, and inspection templates.
  - Implement offline mutation queue: write operations locally with UUIDs and idempotency keys.
  - Build background sync manager: auto-detect connectivity restoration, drain the sync queue, handle optimistic UI updates, and resolve concurrency conflicts.
- **Deliverables:**
  - Local Drift database schema and repository layer in Flutter.
  - Sync status indicator (Online / Offline / Syncing) with retry policies and duplicate protection.
- **Crisp Weekly Summary:**
  > *Week 12 engineered the offline-first SQLite/Drift synchronization engine for Flutter, enabling operators to record completions and inspections without connectivity and auto-reconcile with Supabase upon reconnection.*

---

## Month 4: Analytics, AI Insights, Hardening & Academic Submission

### Week 13: Executive Analytics & Operational Reporting
- **Milestone:** Decision Intelligence & Metrics
- **Objectives:**
  - Build interactive charts using Recharts for production throughput, Overall Equipment Effectiveness (OEE) approximation, and scrap rates.
  - Generate PDF/CSV exportable reports for inventory valuations, supplier receipt ledgers, and order completion histories.
  - Implement customizable date-range filtering and plant comparison views.
- **Deliverables:**
  - Executive Analytics dashboard in Web App.
  - Report generator for management reviews.
- **Crisp Weekly Summary:**
  > *Week 13 constructed the executive analytics suite with dynamic charts for production throughput, scrap percentages, inventory turnover, and exportable compliance reports.*

---

### Week 14: AI Operational Insights & Anomaly Detection
- **Milestone:** Data-Backed Intelligence
- **Objectives:**
  - Integrate LLM API to analyze structured operational records and generate grounded narrative summaries.
  - Identify scrap anomalies (e.g., "Work Center CNC-02 scrap rate spiked 4.2% on Material Lot ST-402").
  - Predict potential stockout dates based on current production order burn rates.
- **Deliverables:**
  - AI Insights widget on the Web Dashboard with prompt grounding against actual PostgreSQL aggregates.
  - Anomaly detection alerts for supervisors.
- **Crisp Weekly Summary:**
  > *Week 14 integrated the AI Operational Insights engine, providing automated, data-backed anomaly detection and scrap root-cause summaries without hallucinating metrics.*

---

### Week 15: End-to-End Testing, Security Auditing & Performance Optimization
- **Milestone:** System Verification & Validation
- **Objectives:**
  - Execute automated integration tests for inventory consistency and negative stock prevention.
  - Perform RLS security audit verifying organization isolation across all endpoints.
  - Stress test offline queue with 50+ bulk offline transactions to verify conflict-free sync.
  - Optimize database indexes and bundle size for lightning-fast loads.
- **Deliverables:**
  - Automated test suites and test execution report.
  - Security verification log documenting multi-tenant data isolation.
- **Crisp Weekly Summary:**
  > *Week 15 executed end-to-end testing, verifying atomic inventory transactions, multi-tenant RLS isolation, offline sync resilience under simulated network failure, and sub-second page performance.*

---

### Week 16: Deployment, Final Documentation & Viva Defense Package
- **Milestone:** Production Deployment & Project Submission
- **Objectives:**
  - Deploy Web Application to Vercel and Supabase cloud instance.
  - Build Flutter production APK / release bundle.
  - Complete the comprehensive Major Project Report (100+ pages covering SRS, ERD, DFDs, Test Cases, and Viva Q&A).
  - Prepare high-impact Viva presentation slide deck and backup 4K demonstration video walkthrough.
- **Deliverables:**
  - Live production web deployment link and downloadable Flutter APK.
  - Final Academic Project Report (`MFGOS_Final_Report.pdf`) and Presentation Deck.
  - Dual-industry live viva demonstration script (Machining vs. Furniture).
- **Crisp Weekly Summary:**
  > *Week 16 finalized the production deployments, compiled the complete academic dissertation and viva presentation deck, and verified the dual-industry live demonstration workflow for final-year defense.*

---

## Current Status Summary (End of Week 4)

| Week Range | Focus Area | Status |
| :--- | :--- | :--- |
| **Weeks 01 - 04** | Foundation, Security, Master Data & Stock Ledger | **COMPLETED & OPERATIONAL** |
| **Weeks 05 - 08** | Manufacturing Core, BOM, Routing & WIP Orders | **SCHEDULED (Month 2)** |
| **Weeks 09 - 12** | Configurable Workflow Engine & Mobile Offline Sync | **SCHEDULED (Month 3)** |
| **Weeks 13 - 16** | Analytics, AI Insights, Testing & Final Viva Defense | **SCHEDULED (Month 4)** |
