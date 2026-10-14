# MFGOS: Problem Statement & Value Proposition

## Executive Summary
**MFGOS (Configurable Manufacturing Operations System)** addresses the operational friction in small-to-medium and high-mix manufacturing enterprises caused by fragmented point solutions, spreadsheet silos, and rigid legacy ERP systems. By providing an **adaptive, metadata-driven manufacturing workflow engine** backed by a **transaction-auditable inventory ledger** and an **offline-resilient mobile factory terminal**, MFGOS enables diverse industries (e.g., engineering precision machining, furniture assembly, textile processing) to configure, execute, and monitor production without modifying underlying application code.

---

## 1. The Core Problem Statement

### 1.1 The Operational Paradox in Manufacturing
Small and Medium Enterprises (SMEs) and modern discrete manufacturing facilities operate in highly dynamic environments requiring agility, rapid product turnaround, and strict quality conformance. However, modern factory operations suffer from three acute failure modes:

1. **The Legacy Rigidity vs. Custom Software Dilemma:**
   - **Monolithic Commercial ERPs (e.g., SAP, Oracle):** Prohibitively expensive, require multi-month consultancy configurations, and enforce rigid, standard operating procedures that do not fit specialized or evolving manufacturing lines.
   - **Custom-Built Boutique Applications:** Built for a single manufacturing line or client. When business logic changes (e.g., introducing an intermediate heat-treatment or ultrasonic inspection stage), code refactoring and redeployment are required, creating technical debt and vendor lock-in.

2. **The "Spreadsheet & Paper" Shadow Operations:**
   - Factory floors frequently operate on disconnected physical job cards, paper travelers, and localized Excel spreadsheets for inventory counts and machine utilization.
   - **Consequences:** 
     - **Information Lag:** Management discovers material stockouts hours or days after production halts.
     - **Phantom Inventory:** Discrepancies between physical stock in bins and recorded stock lead to accidental over-promising or stalled production orders.
     - **Zero Traceability:** When a customer reports a defective finished component, tracing the specific batch of raw steel, operator shift, or quality inspection sign-off requires forensic paper searches.

3. **The Shop-Floor Connectivity Gap:**
   - Industrial factory floors are notorious for Wi-Fi dead zones, steel-reinforced structural interference, and remote plant basements.
   - Most modern web-only ERPs fail instantly when connection drops, forcing operators to revert to handwritten notes and manual back-entry, which introduces human transcription error and lost audit trails.

---

## 2. The Proposed Solution: MFGOS

MFGOS bridges this gap by decoupling the **manufacturing execution workflow** from the **underlying application code**. 

### Key Innovations:
1. **Configurable Workflow Engine (Data-Driven Routing):**
   - Workflows are treated as database-defined directed acyclic state graphs rather than hardcoded `enum` states.
   - A single platform instance can execute:
     - **Precision Machining:** `Raw Material Issue -> CNC Turning -> Milling -> Deburring -> CMM Inspection -> Anti-Rust Coating -> Finished Stock`
     - **Custom Wood Furniture:** `Lumber Sizing -> Joinery -> Sanding -> Stain Spraying -> Hardware Assembly -> Final QC -> Packaging`
   - Administrators configure stages, mandatory operator roles, gating quality checks, and transition rules directly via the administrative portal.

2. **Immutable Double-Entry Stock Movement Ledger:**
   - Stock quantities are never overwritten with naive `UPDATE inventory SET qty = qty - 5`.
   - Every physical movement creates an immutable `stock_movements` ledger entry linked to a source warehouse, destination warehouse, work order, or supplier receipt with atomic transaction guarantees and strict negative stock prevention.

3. **Offline-First Hybrid Operational Architecture:**
   - **Management Layer (Web):** Real-time analytics, order planning, Bill of Materials (BOM) hierarchy, supplier purchase orders, and dynamic workflow builder.
   - **Execution Layer (Flutter Mobile Terminal):** Distributed local SQLite/Drift database caching assigned jobs. Operators execute operations, scan barcodes, and log scrap/accept quantities offline; changes are queued and synced with idempotency keys upon reconnect.

---

## 3. Measurable Objectives & Evaluation Metrics

| Metric | Target | Verification Method |
| :--- | :--- | :--- |
| **Workflow Adaptability** | Deploy 2 completely distinct industry workflows (e.g., Industrial Gear vs. Modular Desk) | Database-configured routing without touching backend or frontend code |
| **Data Integrity & Traceability** | 100% auditable stock movement reconciliation | Ledger balance check: `SUM(ledger movements) == current warehouse balance` |
| **Operational Continuity** | Zero data loss during network disconnection | Simulating shop floor network drop, recording 10 batch operations, and verifying sync |
| **Transaction Atomicity** | Zero phantom consumption or negative inventory | PostgreSQL transaction rollback & check constraints under simulated concurrent requests |
