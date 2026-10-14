# ZENITH — Team No. 5 | Evaluator Demonstration Checklist

| **Document Metadata** | **Value** |
| :--- | :--- |
| **Project Title** | ZENITH — Team No. 5 (mPOWER Placement Training Program) |
| **Document Purpose** | Pre-Flight, In-Flight & Post-Flight Operational Verification Checklist |
| **Target Audience** | Presentation Team, Demo Operators, Technical Leads |
| **Last Verified Commit** | [`6d4d43d`](https://github.com/Anurag3215/zenith-app/commit/6d4d43d) on branch `main` |

---

## 1. Pre-Flight Verification Checklist

Execute these checks systematically leading up to the evaluation session to ensure zero technical glitches.

### 1.1 T-60 Minutes: Hardware & AV Setup

| Checkpoint | Target State | Verification Method | Status |
| :--- | :--- | :--- | :---: |
| **Presentation Laptop** | AC Power connected, battery > 90% | Power indicator solid green | [ ] |
| **Projector / External Display** | 16:9 Aspect Ratio (1920x1080), contrast verified | Projector test slide readable from back row | [ ] |
| **Primary Mobile Device (Android)** | USB Debugging / Wi-Fi connected, battery > 80% | Standalone APK installed or Expo running | [ ] |
| **Secondary Mobile Device / Emulator** | Read-only member session ready | Simulator launched or secondary device primed | [ ] |
| **Do-Not-Disturb Mode** | OS notifications, calendar alerts, Slack muted | System Focus / Do-Not-Disturb enabled | [ ] |

### 1.2 T-30 Minutes: Cloud Infrastructure & Server Health

| Checkpoint | Target State | Verification Command / Step | Status |
| :--- | :--- | :--- | :---: |
| **Shared Domain Tests** | 44 / 44 tests passing | `npm run test --workspace=@zenith/shared` | [ ] |
| **TypeScript Compilation** | 0 errors across 3 workspaces | `npm run typecheck --workspaces --if-present` | [ ] |
| **Showcase Web Production Build** | Static pages prerendered (`/`, `/present`, `/report`) | `npm run build:showcase` | [ ] |
| **Showcase Dev Server Active** | Running on `http://localhost:3000` | `npm run dev:showcase` (HTTP 200) | [ ] |
| **Mobile Metro Bundler Active** | Running on port `8081` | `npm run dev:mobile` | [ ] |
| **Supabase Cloud Connectivity** | PostgreSQL & Auth responsive | Query `SELECT COUNT(*) FROM profiles` returns 8 | [ ] |

### 1.3 T-15 Minutes: Test Credentials & Pre-Seeded Sessions

| User Account | Role | Login Verification | Pre-Seeded Session State | Status |
| :--- | :--- | :--- | :--- | :---: |
| `captain@zenith5.edu` | `captain` | Verified (`zenith2026`) | Active on Device A (Mobile) | [ ] |
| `member4@zenith5.edu` | `member` | Verified (`zenith2026`) | Active on Device B (Mobile / Second Tab) | [ ] |
| `admin@zenith5.edu` | `team_admin` | Verified (`zenith2026`) | Standby for audit trail inspection | [ ] |
| `vicecaptain@zenith5.edu`| `vice_captain` | Verified (`zenith2026`) | Standby backup score editor | [ ] |

### 1.4 T-5 Minutes: Browser Tabs & Display Staging

| Browser Tab / Window | URL / Route | Initial Visual State | Status |
| :--- | :--- | :--- | :---: |
| **Tab 1: Landing Page** | `http://localhost:3000/` | Scrolled to top Hero section | [ ] |
| **Tab 2: Projector Mode** | `http://localhost:3000/present` | Fullscreen toggled (`F11`), Slide 1 loaded | [ ] |
| **Tab 3: Executive Dossier**| `http://localhost:3000/report` | Ready for print dialog (`Ctrl+P` test passed) | [ ] |
| **Device A Screen** | Mobile App > Scoreboard Tab | Scoreboard rendered, Rank 2 visible (465 pts) | [ ] |
| **Device B Screen** | Mobile App > Workspace Tab | Ordinary member profile active | [ ] |

---

## 2. In-Flight Demonstration Execution Checklist

Follow the 11-step presentation sequence strictly during the 12-minute demo:

```
[ ] Step 01 (0:00 - 1:15): Introduce Team No. 5 & mPOWER Placement Mission
    ↳ Highlight dual-interface architecture (Private Mobile App + Public Web Showcase).

[ ] Step 02 (1:15 - 2:30): Open Public Evaluator Showcase
    ↳ Demonstrate frictionless zero-auth entry, Executive Dark Navy palette, and public roster sanitization.

[ ] Step 03 (2:30 - 3:45): Present Four-Day Training Journey
    ↳ Review Day 1 completed syllabus (Aptitude, Logic, STAR); highlight Days 2-4 honestly marked upcoming.

[ ] Step 04 (3:45 - 5:00): Present Live Scoreboard & Verified Standings
    ↳ Demonstrate 10 tracked groups, Team 5 at Rank 2 (465 pts), 1224 tie rule, and authentic rank movement.

[ ] Step 05 (5:00 - 6:30): Demonstrate Captain Score-Editing Workflow
    ↳ Open modal on Device A, enter +15 delta with justification, verify pessimistic lock & audit record.

[ ] Step 06 (6:30 - 7:30): Demonstrate Ordinary Member Authorization Shield
    ↳ Show Device B: Edit button hidden; navigate to /admin and demonstrate clean 403 Access Denied screen.

[ ] Step 07 (7:30 - 8:30): Demonstrate Real-Time Shared Persistence
    ↳ Place devices side-by-side; trigger update on Device A and verify sub-50ms sync on Device B.

[ ] Step 08 (8:30 - 9:30): Present Reflections & Learning Resources Hub
    ↳ Show private draft reflections vs approved showcase entries; explain 15 MB file size limit and access tiers.

[ ] Step 09 (9:30 - 10:30): Generate & Export Certified Executive Dossier
    ↳ Open /report, review growth metrics and verified standings, trigger print preview to show clean PDF layout.

[ ] Step 10 (10:30 - 11:15): Explain Architecture & Core Technical Decisions
    ↳ Explain React Native Expo + Next.js App Router monorepo, closed 8-account provisioning, and RLS.

[ ] Step 11 (11:15 - 12:00): State Project Limitations & Future Roadmap Honestly
    ↳ Explain direct APK vs store review gating, upcoming curriculum status, and future biometric roadmap.
```

---

## 3. Post-Flight Clean-Up Checklist

Immediately following the evaluator presentation:

| Action Item | Procedure | Verification | Status |
| :--- | :--- | :--- | :---: |
| **Reset Demo Score Adjustments** | Revert test points added during demo | Team 5 score restored to official 465 pts | [ ] |
| **Purge Test Audit Entries** | Mark demo audit logs or leave labeled `[DEMO TEST]` | Audit log maintains clean chronology | [ ] |
| **Log Out Test Sessions** | Sign out of `captain` and `member` on demo devices | Mobile client returns to Login screen | [ ] |
| **Export Final Executive Dossier** | Save `/report` as `ZENITH_Team5_Final_Dossier.pdf` | PDF archived with release commit hash | [ ] |
| **Deliver Dossier to Evaluators** | Provide PDF and repository link to evaluation panel | Confirmation received from jury | [ ] |

---

## 4. Emergency Contingency Quick-Reference Card

Keep this quick reference visible to the technical operator during the demonstration:

| Emergency Scenario | Immediate Trigger | Spoken Action / Transition |
| :--- | :--- | :--- |
| **Projector Disconnects / Flikers** | Press `Win + P` > Duplicate | *"While the display recalibrates, our co-presenter will pass around the mobile client on Device A."* |
| **Wi-Fi Drops Completely** | Stay on current screen | *"Notice our offline engine: the scoreboard gracefully displays cached data with an amber Stale Data banner."* |
| **WebSocket Dropped (No Push)** | Tap **Pull-to-Refresh** | *"Our resilient sync engine automatically falls back to HTTP polling and manual pull-to-refresh."* |
| **Mobile Simulator Freezes** | Open Browser DevTools (`F12`) | *"Our responsive web showcase mirrors the exact mobile viewport and layout through our shared domain package."* |
| **Evaluator Questions Score Validity** | Open `/report` Dossier | *"All standings are mathematically certified under the 1224 competition tie rule and traceable in our audit log."* |
