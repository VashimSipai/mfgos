# MFGOS — Configurable Manufacturing Operations System

> **An adaptive, metadata-driven manufacturing execution and operations platform for modern discrete manufacturing.**  
> **Repository:** [https://github.com/VashimSipai/mfgos](https://github.com/VashimSipai/mfgos)

[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-blue.svg)](docs/architecture.md)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase%2015+-336791.svg)](supabase/migrations/)
[![Frontend](https://img.shields.io/badge/React%2018-TypeScript%20%7C%20Vite-61DAFB.svg)](apps/web/)
[![Mobile](https://img.shields.io/badge/Flutter-Dart%20%7C%20Drift%20SQLite-02569B.svg)](apps/mobile/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🏭 1. Overview & Core Problem

### The Problem
Discrete manufacturing enterprises (precision machining, industrial equipment, timber fabrication, textile processing) encounter operational friction due to software limitations:
- **Monolithic Legacy ERPs** enforce rigid, inflexible workflows that are prohibitively expensive to customize and fail to adapt to agile shop-floor requirements.
- **Custom-Coded Software** hardcodes routing states (`enum` values) into application code. Modifying an operation sequence or inserting a quality inspection checkpoint requires code refactoring, testing, and system redeployment.
- **Disconnected Shadow Systems** (spreadsheets, paper travelers) lead to inventory discrepancies, phantom stock, delayed stockout alerts, and broken audit trails.
- **Industrial Connectivity Dead Zones** cause cloud-only platforms to fail during shop-floor execution.

### The Solution: MFGOS
**MFGOS** decouples manufacturing execution workflows from application code:
1. **Configurable Workflow Engine:** Define operational sequences, permitted state transitions, mandatory role permissions, and gating quality checks directly via database metadata.
2. **Double-Entry Auditable Inventory Ledger:** Stock balances are computed from an immutable transaction ledger (`stock_movements`), guarded by PostgreSQL triggers and non-negative inventory invariants.
3. **Offline-Resilient Mobile Terminal:** Built with Flutter and Drift (SQLite) to enable operators to execute work orders and log quality results offline, automatically synchronizing via background queue upon reconnection.

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
                       │  • Multi-Tenant Row Level Security│
                       │  • Immutable Stock Movements      │
                       │  • Configurable Workflow FSM      │
                       │  • Atomic Stored Procedures       │
                       └───────────────────────────────────┘
```

---

## 🧩 3. Core Modules

| Module | Purpose | Status |
| :--- | :--- | :---: |
| **Authentication & Multi-Tenancy** | Organization data isolation via PostgreSQL RLS & role-based permissions (7 roles) | **Operational** |
| **Master Data Management (MDM)** | Central catalog for Items, UOM conversions, Warehouses, Work Centers & Routing Operations | **Operational** |
| **Inventory & Stock Movement Ledger** | Transaction-safe ledger, non-negative stock invariants, transfers & physical audit adjustments | **Operational** |
| **Configurable Workflow Engine** | Metadata-driven production finite state machine (FSM) with dynamic stage sequencing | **Operational** |
| **Bill of Materials (BOM) & Routing** | Multi-level component explosion, scrap estimation & work center capacity scheduling | Planned |
| **Production Order Lifecycle** | Work order release, shop-floor dispatching & work-in-progress (WIP) tracking | Planned |
| **Quality Management & Gates** | Configurable inspection forms, tolerance thresholds & defect categorization | Planned |
| **Mobile Factory Terminal** | Flutter cross-platform operator client with offline Drift SQLite persistence | **Operational** |
| **Analytics & Operational Insights** | Production throughput metrics, scrap analysis, and data-backed operational summaries | Planned |

---

## 📂 4. Repository Structure

```
mfgos/
├── apps/
│   ├── web/                    # React 18 + TypeScript + Vite Management Portal
│   │   ├── src/
│   │   │   ├── features/       # Modular domains: dashboard, inventory, master-data, workflows
│   │   │   ├── components/     # UI components (Navigation, Layout, Modals)
│   │   │   ├── services/       # Supabase client & local storage fallback provider
│   │   │   └── types/          # Domain TypeScript type definitions
│   │   └── package.json
│   └── mobile/                 # Flutter + Dart Shop-Floor Application
│       ├── lib/                # Modular Clean Architecture (Data, Domain, Presentation)
│       └── pubspec.yaml
├── supabase/
│   ├── migrations/             # Production-grade PostgreSQL DDL + RLS + Triggers
│   │   ├── 20261014000001_initial_schema.sql
│   │   └── 20261014000002_inventory_ledger_functions.sql
│   └── seed.sql                # Demonstration seed dataset (Apex Precision Dynamics)
├── docs/                       # Engineering Specifications & Architectural Documentation
│   ├── problem-statement.md    # Problem statement & technical value proposition
│   ├── weekly-development-roadmap.md # Detailed engineering development roadmap
│   ├── srs.md                  # IEEE Std 830-1998 compliant specification
│   ├── architecture.md         # Modular monolith topology & sync engine
│   ├── database-design.md      # Relational schema, ER diagram & index strategy
│   └── testing-strategy.md     # Verification matrix & end-to-end testing script
├── .gitignore
└── README.md
```

---

## 🚀 5. Quick Start

### Web Management Application
```bash
# Navigate to web application directory
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173`. The application includes an in-memory storage fallback preloaded with realistic engineering manufacturing data, allowing immediate testing without external dependencies.

To connect to a live Supabase instance:
1. Apply migrations `supabase/migrations/` in your Supabase SQL Editor.
2. Run `supabase/seed.sql`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `apps/web/.env`.

### Mobile Terminal (Flutter)
```bash
cd apps/mobile
flutter run
```

---

## 🧪 6. Testing & Validation

The system includes automated tests and validation scripts covering:
- **Transaction Consistency:** Non-negative inventory enforcement and ledger reconciliation (`SUM(movements) == balance`).
- **Data Isolation:** PostgreSQL Row-Level Security verification across organization tenants.
- **Offline Resilience:** Drift SQLite mutation queueing, idempotency key replay, and server synchronization.

See [`docs/testing-strategy.md`](docs/testing-strategy.md) for full verification procedures.
