# ZENITH — Team No. 5 | Architecture Decision Records (ADRs)

| **Document Version** | 1.0.0 |
| **Status** | Formally Recorded & Approved |

---

## Table of Decisions

- [ADR-001: Monorepo Architecture with Workspaces](#adr-001-monorepo-architecture-with-workspaces)
- [ADR-002: Mobile Framework Selection (Expo & Expo Router)](#adr-002-mobile-framework-selection-expo--expo-router)
- [ADR-003: Backend & Database Selection (Supabase PostgreSQL)](#adr-003-backend--database-selection-supabase-postgresql)
- [ADR-004: Closed 8-Account Member Provisioning Strategy](#adr-004-closed-8-account-member-provisioning-strategy)
- [ADR-005: Scoreboard Modification RBAC & Audit Ledger](#adr-005-scoreboard-modification-rbac--audit-ledger)
- [ADR-006: Realtime Synchronization with Polling Fallback](#adr-006-realtime-synchronization-with-polling-fallback)
- [ADR-007: Public Evaluator Companion Architecture (Next.js)](#adr-007-public-evaluator-companion-architecture-nextjs)
- [ADR-008: Placeholder Policy & Synthetic Data Prohibition](#adr-008-placeholder-policy--synthetic-data-prohibition)

---

### ADR-001: Monorepo Architecture with Workspaces
- **Status:** Accepted
- **Context:** The system includes a cross-platform mobile app, a public companion web showcase, shared schemas, and database migrations. Maintaining separate repositories would create schema drift, duplicate types, and complicate CI/CD.
- **Decision:** Adopt an npm workspace monorepo structure containing `apps/mobile`, `apps/showcase`, `packages/shared`, and `packages/config`.
- **Consequences:** Single source of truth for TypeScript types, shared Zod validation schemas, and synchronized versioning.

---

### ADR-002: Mobile Framework Selection (Expo & Expo Router)
- **Status:** Accepted
- **Context:** We require native Android and iOS applications with fluid navigation, deep linking, reliable camera/file handling, and rapid binary compilation for demonstration devices.
- **Decision:** Use React Native with Expo (SDK 52+) and Expo Router v4+.
- **Consequences:** Eliminates brittle native Xcode/Android Studio configuration drift; enables direct standalone APK distribution via EAS Build for presentation devices; provides file-system routing identical to modern web frameworks.

---

### ADR-003: Backend & Database Selection (Supabase PostgreSQL)
- **Status:** Accepted
- **Context:** A shared persistent database with instant multi-device synchronization, secure authentication, file storage, and database-enforced authorization is required.
- **Decision:** Use Supabase Managed PostgreSQL with Row Level Security (RLS), GoTrue Auth, Realtime engine, and Storage.
- **Consequences:** Zero custom server infrastructure to maintain or patch; authorization enforced directly at the SQL level; native CDC replication over WebSockets; built-in private S3-compatible storage.

---

### ADR-004: Closed 8-Account Member Provisioning Strategy
- **Status:** Accepted
- **Context:** The workspace is strictly for Team No. 5 (exactly 8 members). Public registration, open invites, or anonymous write access would undermine data integrity and evaluation rigor.
- **Decision:** Explicitly disable public registration (`enable_signup: false`). Pre-provision exactly 8 user accounts linked 1-to-1 with the `profiles` table.
- **Consequences:** Unauthorized third parties cannot sign up; evaluators can test account switching across roles deterministically; team roster is strictly bounded.

---

### ADR-005: Scoreboard Modification RBAC & Audit Ledger
- **Status:** Accepted
- **Context:** Score editing must be strictly restricted to Captain and Vice-Captain, with absolute transparency to prevent scoring disputes during live training rounds.
- **Decision:** Restrict score update execution to the `adjust_group_score` stored procedure, which checks caller role via `auth.uid() = profiles.id`. Require an explicit reason text for every score modification and append the change to the immutable `score_transactions` table.
- **Consequences:** Impossible for ordinary members or external observers to alter scores; full auditability for evaluators to review point history.

---

### ADR-006: Realtime Synchronization with Polling Fallback
- **Status:** Accepted
- **Context:** Evaluator presentations often occur in auditoriums with high Wi-Fi congestion, where persistent WebSockets may intermittently disconnect.
- **Decision:** Combine Supabase Realtime WebSocket subscriptions with an automatic TanStack Query polling fallback (10s interval) whenever connection state is degraded.
- **Consequences:** Guarantees instantaneous push updates under normal network conditions while seamlessly retaining freshness during connectivity hiccups without user intervention.

---

### ADR-007: Public Evaluator Companion Architecture (Next.js)
- **Status:** Accepted
- **Context:** Evaluators and mentors need instant access to team standings, curriculum reflections, and growth reports from laptops or mobile browsers without installing an app or logging in.
- **Decision:** Build a companion web application using Next.js App Router deployed on Vercel, querying only rows flagged with `is_approved_for_showcase = true` or public tables via anonymous Supabase access.
- **Consequences:** Zero barrier to entry for evaluators; optimal SEO and rendering performance via React Server Components; zero exposure of private member data.

---

### ADR-008: Placeholder Policy & Synthetic Data Prohibition
- **Status:** Accepted
- **Context:** Official university logos, verified member biographies, official photos, and final program scores have not yet been formally issued. Inventing realistic fake names or credentials damages project authenticity.
- **Decision:** Strictly prohibit synthetic or invented credentials. Use standardized, descriptive placeholders: `[Candidate Name Pending]`, `[Official Motto Pending Formal Adoption]`, and geometric placeholder avatars until authentic assets are supplied.
- **Consequences:** Maintains high professional standards and integrity; clear distinction between functional architecture and content ingestion.
