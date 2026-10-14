# ZENITH — Team No. 5 | Security Model & Access Control Architecture

| **Document Version** | 1.0.0 |
| **Status** | Approved for Architecture / Pending Implementation |
| **Domain** | Security, Identity, Row Level Security (RLS) & Secrets Governance |

---

## 1. Security Philosophy & Principles

The ZENITH security architecture is built on a **Zero-Trust Client Model** and the **Principle of Least Privilege (PoLP)**:
1. **Clients are Untrusted:** Mobile applications and web browsers are execution environments that can be inspected, decompiled, or manipulated. No client-side check is ever considered a security boundary.
2. **Database-Enforced Authorization:** Every data read, mutation, and deletion is authorized at the PostgreSQL engine level via Row Level Security (RLS).
3. **Closed Account Provisioning:** No self-registration or open signup endpoints exist. Exactly 8 accounts are provisioned and audited.
4. **Credential Isolation:** Service-role and master credentials exist solely in secure server environments and are never shipped within client bundles.

---

## 2. Authentication Architecture

```mermaid
flowchart TD
    subgraph Provisioning Phase
        ADM["Team Admin / System Setup"] -->|Admin API / Seed CLI| SUPA_AUTH["Supabase Auth Engine"]
        SUPA_AUTH -->|Pre-creates| USR["8 Authorized Member Accounts"]
        SUPA_AUTH -.->|Signup Endpoint| BLK["DISABLED (HTTP 403)"]
    end

    subgraph Mobile Client Authentication
        M_DEV["Mobile Device (Android / iOS)"] -->|Email + Secure Credential| LOGIN["POST /auth/v1/token?grant_type=password"]
        LOGIN --> SUPA_AUTH
        SUPA_AUTH -->|Issues JWT + Refresh Token| M_DEV
        M_DEV -->|Store Refresh Token| KEYSTORE["OS Hardware Keystore / iOS Keychain<br/>(via expo-secure-store)"]
    end

    subgraph Authenticated Operations
        M_DEV -->|Bearer JWT Header| PG_GATEWAY["PostgREST / Supabase API"]
        PG_GATEWAY -->|Decodes auth.uid()| RLS_ENGINE["PostgreSQL Row Level Security"]
    end
```

### 2.1 Provisioning Rules
- **No Public Signups:** `enable_signup` is configured to `false` in Supabase Auth configuration.
- **Account Ceiling:** The database maintains an active check constraint ensuring the number of active member profiles in Team 5 does not exceed 8.
- **Credential Storage on Devices:** Tokens are managed via `expo-secure-store`. Sensitive tokens are never written to unencrypted `AsyncStorage` or file systems.

---

## 3. PostgreSQL Row Level Security (RLS) Matrix

Row Level Security is enabled on **100% of public tables** (`ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;`).

| Table Name | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy |
| :--- | :--- | :--- | :--- | :--- |
| **`teams`** | Authenticated members & Public Evaluators | Disabled (Admin Migration Only) | Team Admin Only | Disabled |
| **`profiles`** | Authenticated: Full team profiles.<br/>Evaluator: Public fields only (`full_name`, `role`, `avatar_url`, `skills`, `bio`). | Disabled (Auto-created via Auth Trigger) | Self (`auth.uid() = id`) for bio/skills.<br/>Team Admin for roles. | Disabled |
| **`scoreboard_groups`**| Authenticated & Public Evaluator | Team Admin | Captain, Vice-Captain, Team Admin | Team Admin |
| **`score_transactions`**| Authenticated members | Captain, Vice-Captain via `adjust_group_score` | Disabled (Immutable Ledger) | Disabled (Immutable Ledger) |
| **`training_days`** | Authenticated & Public Evaluator | Team Admin | Team Admin | Team Admin |
| **`reflections`** | Authenticated: All team reflections.<br/>Evaluator: Only where `is_approved_for_showcase = true`. | Self (`auth.uid() = member_id`) | Self (`auth.uid() = member_id`) for text.<br/>Captain/Admin for approval flag. | Self (`auth.uid() = member_id`) |
| **`resources_documents`**| Authenticated: All records.<br/>Evaluator: Only where `access_level = 'showcase_public'`. | Authenticated members | Uploader or Team Admin | Uploader or Team Admin |
| **`gallery_items`** | Authenticated: All records.<br/>Evaluator: Only where `is_featured_showcase = true`. | Authenticated members | Uploader or Captain/Admin | Uploader or Team Admin |
| **`audit_logs`** | Team Admin Only | Trigger function only (`SECURITY DEFINER`) | Disabled (Immutable) | Disabled (Immutable) |

---

## 4. Supabase Storage Security & Bucket Policies

Storage is split into distinct buckets with strictly partitioned policies:

```text
Storage Buckets:
├── documents/       [PRIVATE BUCKET] - Internal study guides, resume drafts, notes
├── gallery/         [PUBLIC-READ CONDITIONAL] - Event photos, milestone pictures
└── avatars/         [PUBLIC-READ] - Member profile portraits
```

### Bucket RLS Policies
1. **`documents` (Private):**
   - **Read:** Only authenticated users where `auth.role() = 'authenticated'`. Evaluators cannot access unless an individual asset is copied or signed with a time-limited token.
   - **Upload:** Authenticated members only. Max file size: $15\text{ MB}$. Supported MIME: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `image/*`.
2. **`gallery` (Public-Read Conditional):**
   - **Read:** Public anonymous access allowed.
   - **Upload:** Authenticated members only. Max file size: $10\text{ MB}$. Supported MIME: `image/jpeg`, `image/png`, `image/webp`.
3. **`avatars` (Public-Read):**
   - **Read:** Public anonymous access allowed.
   - **Upload:** Authenticated user can upload only to their own subfolder: `avatars/{auth.uid()}/*`.

---

## 5. Secrets Management & Environment Isolation

### 5.1 Client Bundle Sanitization
- **Mobile Client:** Only environment variables prefixed with `EXPO_PUBLIC_` are bundled into the binary.
  - Allowed: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `EXPO_PUBLIC_APP_ENV`.
  - Strictly Forbidden: `SUPABASE_SERVICE_ROLE_KEY`, Database Passwords, Signing Keystore credentials.
- **Web Showcase Client:** Only environment variables prefixed with `NEXT_PUBLIC_` are exposed to browsers.
  - Server components may utilize server-only environment variables if necessary, but all client reads rely on the anon key constrained by RLS.

### 5.2 CI/CD and Build Pipeline Secrets
- Production signing certificates (Android Keystore `.jks`, Apple Provisioning Profiles) are stored directly inside Expo Application Services (EAS) encrypted secret manager.
- GitHub Actions workflows use repository secrets and OIDC tokens; zero raw credentials exist in YAML files.

---

## 6. Audit Trail & Non-Repudiation

To prevent unauthorized score manipulation or contentious disputes during the live mPOWER competition:
1. Every score modification creates an entry in `score_transactions` containing the authenticated actor's UID, exact point delta, timestamp, and textual reason.
2. A database-level trigger intercepts all DML operations on `scoreboard_groups`, `profiles`, and `reflections`, archiving the prior state (`old_values`) and subsequent state (`new_values`) into the immutable `audit_logs` table.
3. Neither Captains nor ordinary members possess `DELETE` or `UPDATE` permissions on the `audit_logs` or `score_transactions` tables.

---

## 7. Backup, Disaster Recovery & High Availability

1. **Point-In-Time Recovery (PITR):** PostgreSQL Write-Ahead Log (WAL) archiving enables restoring database state to any specific second within a 7-day window.
2. **Daily Schema Dumps:** Automated GitHub Actions job exports schema DDL and sanitizes seed templates daily.
3. **Emergency Circuit Breaker:** An administrative configuration flag `system_freeze` allows Team Admin to freeze all score updates and uploads instantly if abnormal activity is detected.
