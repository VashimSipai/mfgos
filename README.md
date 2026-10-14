# MFGOS — Configurable Manufacturing Operations System

> **A configurable operating system for modern discrete manufacturing.**  
> *Final-Year B.Tech Computer Engineering Major Project (4-Month Timeline)*  
> **Repository:** [https://github.com/VashimSipai/mfgos](https://github.com/VashimSipai/mfgos)

[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-blue.svg)](docs/architecture.md)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase%2015+-336791.svg)](supabase/migrations/)
[![Frontend](https://img.shields.io/badge/React%2018-TypeScript%20%7C%20Vite-61DAFB.svg)](apps/web/)
[![Mobile](https://img.shields.io/badge/Flutter-Dart%20%7C%20Drift%20SQLite-02569B.svg)](apps/mobile/)
[![Status](https://img.shields.io/badge/Status-Month%201%20Foundation%20Delivered-success.svg)](docs/weekly-development-roadmap.md)

---

## 🏭 1. Project Identity & Problem Statement

### The Problem
Discrete manufacturing SMEs (engineering machining, furniture fabrication, textile finishing) struggle with a painful operational dilemma:
- **Rigid Commercial ERPs** (SAP, Oracle) cost tens of thousands of dollars and enforce rigid, standard workflows that fail to fit specialized shop-floor operations.
- **Custom-Coded Software** is built for a single workflow. Any change in routing or quality gate requires modifying code, redeploying, and risking technical debt.
- **Paper & Spreadsheet Silos** lead to phantom stock, inventory discrepancies, delayed stockout alerts, and zero traceability.
- **Factory Dead Zones** cause cloud-only web applications to crash when Wi-Fi drops on the shop floor.

### The Solution: MFGOS
**MFGOS** is a unified, metadata-driven manufacturing operations platform with three core pillars:
1. **Configurable Workflow Engine:** Factory administrators can define operations, stage sequences, mandatory operator roles, and quality inspection gates directly via the UI without touching code.
2. **Double-Entry Auditable Inventory Ledger:** Stock balances are maintained via an immutable transaction ledger (`stock_movements`) protected by atomic PostgreSQL triggers and non-negative stock invariants.
3. **Offline-Resilient Mobile Factory Terminal:** Built with Flutter and Drift (SQLite) to allow shop-floor operators to execute jobs and log scrap offline, synchronizing automatically when connectivity returns.

---

## 📐 2. System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │              MFGOS PLATFORM             │
                    └────────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
    ┌───────────────────────────┐                 ┌───────────────────────────┐
    │     MANAGEMENT WEB APP    │                 │   MOBILE SHOP TERMINAL    │
    │     React + TypeScript    │                 │      Flutter + Dart       │
    │     Modern CSS System     │                 │   Material 3 + Barcodes   │
    └────────────┬──────────────┘                 └─────────────┬─────────────┘
                 │                                              │
                 │                                     ┌────────┴────────┐
                 │                                     │  SQLite / Drift │
                 │                                     │  Offline Queue  │
                 │                                     └────────┬────────┘
                 │                                              │
                 └───────────────────────┬──────────────────────┘
                                         │
                       ┌─────────────────┴─────────────────┐
                       │     SUPABASE CLOUD / POSTGRES     │
                       ├───────────────────────────────────┤
                       │  • Supabase GoTrue Auth (JWT)     │
                       │  • Multi-Tenant Row Level Security│
                       │  • Immutable Stock Movements      │
                       │  • Configurable Workflow FSM      │
                       │  • Edge Functions & Stored Procs  │
                       └───────────────────────────────────┘
```

---

## 📅 3. 16-Week Development Roadmap

| Month | Weeks | Focus Area | Status |
| :---: | :---: | :--- | :---: |
| **Month 1** | **W01 - W04** | **Foundation, SRS, Multi-Tenant Schema, RBAC, Master Data & Inventory Ledger** | **DELIVERED** |
| **Month 2** | **W05 - W08** | Multi-Level BOM, Manufacturing Routing, Work Orders, WIP Execution | Scheduled |
| **Month 3** | **W09 - W12** | Configurable Workflow State Machine, QC Gates, Flutter Mobile & Offline Sync | Scheduled |
| **Month 4** | **W13 - W16** | Executive Dashboards, AI Insights, Integration Testing, Viva Submission | Scheduled |

> Detailed week-by-week technical deliverables and weekly accomplishment summaries are documented in [`docs/weekly-development-roadmap.md`](docs/weekly-development-roadmap.md).

---

## 📂 4. Repository Structure

```
mfgos/
├── apps/
│   ├── web/                    # React 18 + TypeScript + Vite Management Portal
│   │   ├── src/
│   │   │   ├── features/       # Modular domains: auth, master-data, inventory, dashboard
│   │   │   ├── components/     # Reusable UI library (Glassmorphism, Badges, Modals)
│   │   │   ├── services/       # Supabase client & Mock/Offline fallback provider
│   │   │   └── types/          # Strict TypeScript entity definitions
│   │   └── package.json
│   └── mobile/                 # Flutter + Dart Shop-Floor Application
│       └── lib/                # Modular Clean Architecture (Data, Domain, Presentation)
├── supabase/
│   ├── migrations/             # Production-grade PostgreSQL DDL + RLS + Triggers
│   │   ├── 20261014000001_initial_schema.sql
│   │   └── 20261014000002_inventory_ledger_functions.sql
│   └── seed.sql                # Demonstration seed dataset (Apex Precision Dynamics)
├── docs/                       # University Final-Year Engineering Documentation
│   ├── problem-statement.md    # Industry-grounded problem statement & metrics
│   ├── weekly-development-roadmap.md # 16-week timeline with crisp weekly summaries
│   ├── srs.md                  # IEEE Std 830-1998 compliant specification
│   ├── architecture.md         # Modular monolith topology & sync engine
│   ├── database-design.md      # Relational schema, ER diagram & index strategy
│   └── testing-strategy.md     # Test matrix, consistency invariants & viva script
├── .gitignore
└── README.md
```

---

## 🚀 5. Quick Start (Web Application)

### Prerequisites
- Node.js `v18+` (Tested on `v24.5.0`)
- npm `v9+` (Tested on `11.3.0`)

### Running the Web Application
```bash
# Navigate to web application directory
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

The web application opens at `http://localhost:5173`.  
It operates with a built-in **high-fidelity mock/local storage provider** preloaded with realistic engineering manufacturing data (Apex Precision Dynamics), meaning **it runs immediately out of the box** without requiring an external Supabase account.  

When you are ready to connect to your live Supabase instance:
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Execute `supabase/migrations/20261014000001_initial_schema.sql` and `20261014000002_inventory_ledger_functions.sql` in the Supabase SQL Editor.
3. Run `supabase/seed.sql`.
4. Copy `.env.example` to `.env` in `apps/web/` and add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 🎓 6. Academic Defense Scenario (Viva Proof)

The project includes a 10-step viva script demonstrating real-world manufacturing execution:
1. **Multi-Tenant Administration:** Switch between organizations and plants.
2. **Master Data Validation:** Inspect finished product (`FG-GEAR-01`) and raw materials (Steel, Bearings, Fasteners).
3. **Transaction-Safe Stock Receipt:** Receive 500 kg Alloy Steel with lot tracking into Raw Material Yard.
4. **Configurable Workflow Demonstration:** Show how routing is dynamically configured from database records rather than hardcoded UI screens.
5. **Double-Entry Ledger Audit:** Verify that stock adjustments and transfers produce immutable audit records in `stock_movements`.
