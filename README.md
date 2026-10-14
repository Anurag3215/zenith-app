# ZENITH — Team No. 5

> **mPOWER Placement Training Program — Flagship Cross-Platform Mobile Application & Evaluator Companion Ecosystem**

[![Stack: React Native](https://img.shields.io/badge/Mobile-React%20Native%20%7C%20Expo-000000?style=for-the-badge&logo=expo)](https://expo.dev)
[![Web: Next.js](https://img.shields.io/badge/Showcase-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Backend: Supabase](https://img.shields.io/badge/Backend-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-Strict%205.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tests: 44 Passing](https://img.shields.io/badge/Tests-44%20Passing%20(6%20Suites)-success?style=for-the-badge)](docs/FINAL_HANDOVER.md)

---

## 1. Executive Summary

**ZENITH — Team No. 5** is an enterprise-grade mobile application and companion web showcase engineered for the **mPOWER Placement Training Program**. Designed for live demonstration before evaluators and mentors, the application provides an authenticated private workspace for Team 5's eight enrolled members alongside a public, read-only companion web portal for program evaluation panels.

### Key Capabilities
- **Native Cross-Platform Mobile App:** Built with Expo SDK 52 and Expo Router for Android and iOS.
- **Login-First Private Workspace:** Pre-provisioned for exactly 8 team members with zero public sign-ups.
- **Role-Based Authorization (RBAC):** Database-enforced permissions for Team Admin, Captain, Vice-Captain, and ordinary members.
- **Live Competition Scoreboard:** Real-time multi-group standings with standard 1224 competition tie rules, authentic rank movement calculation, and optimistic updates.
- **Restricted Score Editing:** Score updates restricted exclusively to Captain and Vice-Captain with mandatory audit justifications and immutable transaction logging.
- **Curriculum & Growth Engine:** 4-Day training journey timeline, structured daily reflection submission, document management, and photo gallery.
- **Public Evaluator Showcase:** Companion Next.js 14 web application enabling frictionless, zero-login evaluation, live scoreboard viewing, distraction-free projector mode (`/present`), and certified executive dossier export (`/report`).

---

## 2. Monorepo Repository Structure

```text
d:/ZENITH-app/
├── apps/
│   ├── mobile/             # React Native Expo SDK 52 application (Android & iOS)
│   └── showcase/           # Companion Evaluator Web Portal (Next.js 14 App Router)
├── packages/
│   ├── shared/             # Shared TypeScript domain models, 1224 ranking algorithm, sanitization allowlists
│   └── config/             # Shared ESLint and TypeScript base configurations
├── supabase/
│   ├── migrations/         # PostgreSQL schema migrations, RLS policies, and concurrency functions
│   └── seed.sql            # Seed dataset (10 Groups, 8 Provisioned Accounts, 4-Day Curriculum)
├── docs/                   # Formal Architecture & Production Release Documentation
│   ├── PROJECT_OVERVIEW.md # ★ Executive Overview & Technical Specifications
│   ├── EVALUATOR_DEMO_SCRIPT.md # ★ 12-Minute Evaluator Demo Script & Speaking Prompts
│   ├── DEMO_CHECKLIST.md   # ★ Pre-Flight, In-Flight & Post-Flight Operational Checklist
│   ├── FINAL_HANDOVER.md   # ★ Master Release Handover Dossier & Status Matrix
│   ├── RUNBOOKS.md         # ★ Operational Runbooks (PITR, Mobile/Web Rollbacks, Key Rotation)
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── SECURITY_MODEL.md
│   ├── UI_DESIGN_SYSTEM.md
│   ├── TEST_PLAN.md
│   ├── DEPLOYMENT_PLAN.md
│   └── DECISIONS.md
├── .env.example            # Safe environment variables template
└── README.md
```

---

## 3. Project Documentation Index

Detailed specifications for each layer of the application are maintained in the `docs/` directory:

| Document | Purpose |
| :--- | :--- |
| [**Project Overview**](docs/PROJECT_OVERVIEW.md) | **Executive project summary, technical stack specifications, and quality benchmarks.** |
| [**Evaluator Demo Script**](docs/EVALUATOR_DEMO_SCRIPT.md) | **12-minute stage-by-stage presentation script, speaker prompts, and fallback contingencies.** |
| [**Demo Execution Checklist**](docs/DEMO_CHECKLIST.md) | **Pre-flight, in-flight, and post-flight operational verification checklists.** |
| [**Final Production Handover**](docs/FINAL_HANDOVER.md) | **Master release dossier, deliverable status matrix, production verification evidence.** |
| [**Operational Runbooks**](docs/RUNBOOKS.md) | **Disaster recovery runbooks (PITR restore, EAS OTA rollback, Vercel edge rollback, key rotation).** |
| [Product Requirements (PRD)](docs/PRODUCT_REQUIREMENTS.md) | User personas, functional requirements (FR-01 to FR-15), NFRs, and scope boundaries. |
| [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md) | Monorepo layout, system topology, data flow diagrams, and state management. |
| [Database Design](docs/DATABASE_DESIGN.md) | PostgreSQL schema definitions, ER diagrams, foreign keys, and stored procedures. |
| [Security Model](docs/SECURITY_MODEL.md) | Zero-trust model, PostgreSQL RLS matrix, token storage, and audit logs. |
| [UI/UX Design System](docs/UI_DESIGN_SYSTEM.md) | Executive Dark Navy color palette, tokens, typography, component specs, and UI states. |
| [Quality Assurance & Test Plan](docs/TEST_PLAN.md) | Test pyramid, test case matrix (TC-AUTH, TC-RBAC, TC-SCORE), and live demo checklist. |
| [Deployment & Release Plan](docs/DEPLOYMENT_PLAN.md) | EAS Build pipelines (APK/IPA), Vercel web deployment, and Supabase cloud setup. |
| [Architecture Decisions (ADRs)](docs/DECISIONS.md) | Formal records for technology selections, closed provisioning, and score RBAC. |

---

## 4. Development Environment & Setup

### Prerequisites
- **Node.js:** v20+ LTS (Tested on v24.19.0)
- **Package Manager:** npm v10+ (Workspaces enabled)
- **Git:** Version 2.40+
- **Expo Go App** (for physical device testing) or Android Studio / Xcode Simulator.

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anurag3215/zenith-app.git
   cd zenith-app
   ```

2. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   *Fill in your Supabase Project URL and Anon Key. Never commit production secrets.*

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run Automated Test Suites (44 Tests across 6 Suites):**
   ```bash
   npm run test --workspace=@zenith/shared
   ```

5. **Run TypeScript Typechecks (0 Errors):**
   ```bash
   npm run typecheck --workspaces --if-present
   ```

6. **Run Development Services:**
   - **Launch Mobile App (Expo):**
     ```bash
     npm run dev:mobile
     ```
   - **Launch Evaluator Web Showcase (Next.js):**
     ```bash
     npm run dev:showcase
     ```

7. **Build Production Evaluator Showcase:**
   ```bash
   npm run build:showcase
   ```

8. **Build Android Preview Universal APK (Direct Sideloading):**
   ```bash
   cd apps/mobile
   eas build --platform android --profile preview
   ```

---

## 5. Security & Account Provisioning Notice

- **No Public Sign-ups:** Self-registration is strictly disabled. Only the 8 authorized member accounts provisioned during team onboarding can access the mobile workspace.
- **Placeholder Policy:** To ensure absolute integrity during evaluations, no fake names, photos, or official logos are fabricated. All unverified elements utilize standardized `[Pending Official Verification]` placeholders.
- **Service Role Key:** The `SUPABASE_SERVICE_ROLE_KEY` is strictly for backend administrative operations and must never be included in mobile or web client bundles.
