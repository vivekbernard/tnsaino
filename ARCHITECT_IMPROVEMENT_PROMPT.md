## LLM Prompt: Senior Full Stack Architecture Review and Improvement Plan

You are a **Senior Full Stack Architect**. Review and improve this monorepo:

- `admin-portal/frontend` (React + Vite)
- `admin-portal/backend` (Spring Boot 3 + Spring Cloud Function on AWS Lambda/SAM)
- `endusers-portal/frontend` (React + Vite)
- `endusers-portal/backend` (Spring Boot 3 + Spring Cloud Function on AWS Lambda/SAM)
- `website` (static HTML/CSS/JS)

Primary goal: produce a **pragmatic, security-first, implementation-ready improvement plan** with clear priorities and concrete changes.

### Non-negotiable issues to address (from current code)

1. Authorization and tenant isolation gaps (critical):
- `endusers-portal/backend/src/main/java/com/portal/handler/CompanyCrudApiHandler.java`
- `endusers-portal/backend/src/main/java/com/portal/handler/JobCrudApiHandler.java`
- `endusers-portal/backend/src/main/java/com/portal/handler/JobApplicationCrudApiHandler.java`
- `endusers-portal/backend/src/main/java/com/portal/handler/UserCrudApiHandler.java`
- `admin-portal/backend/src/main/java/com/portal/handler/*.java`

Design and enforce strict ownership/role checks (candidate/company/admin), and prevent cross-tenant data access.

2. Public route mismatch:
- Frontend exposes public browse pages, but `endusers-portal/backend/template.yaml` uses `DefaultAuthorizer` globally.
Define route-level auth explicitly (public `GET /api/job`, `GET /api/joblist` if required), and keep sensitive routes protected.

3. Hardcoded environment/config values:
- `admin-portal/frontend/src/api/axiosClient.js`
- `endusers-portal/frontend/src/api/axiosClient.js`


Remove hardcoded runtime endpoints/IDs, and design environment strategy for dev/staging/prod.


5. Error handling leakage:
- `admin-portal/backend/src/main/java/com/portal/handler/ApiRouterHandler.java`
- `endusers-portal/backend/src/main/java/com/portal/handler/ApiRouterHandler.java`

Stop returning raw exception messages to clients. Introduce structured error responses with correlation IDs.

6. Data consistency risks:
- `endusers-portal/backend/src/main/java/com/portal/service/JobApplicationService.java`
- `admin-portal/backend/src/main/java/com/portal/service/JobApplicationService.java`

Make apply/update flows transaction-safe, race-safe, and idempotent where needed.

7. Status model inconsistency:
- `admin-portal/backend/src/main/resources/db/seed/V2__seed_data.sql`
- `endusers-portal/backend/src/main/java/com/portal/service/JobApplicationService.java`

Unify allowed status enums across DB, backend, and frontend.

8. Resource/performance issues in S3 presign service:
- `admin-portal/backend/src/main/java/com/portal/service/PhotoPresignService.java`
- `endusers-portal/backend/src/main/java/com/portal/service/PhotoPresignService.java`

Avoid creating S3 clients per request and avoid swallowing all exceptions silently.

9. Frontend architecture issues:
- Navigate side effects during render:
  - `admin-portal/frontend/src/pages/public/Login.jsx`
  - `endusers-portal/frontend/src/pages/public/Login.jsx`
- Full reload navigation and auth redirects:
  - `*/frontend/src/api/axiosClient.js`
  - `endusers-portal/frontend/src/pages/public/JobDetail.jsx`
- Soft-delete pagination correctness:
  - `admin-portal/frontend/src/pages/admin/SoftDeletedView.jsx`

10. Maintainability and duplication:
- Large cross-portal duplication (`admin-portal` vs `endusers-portal`) in DTOs, utils, services, and frontend primitives.
Create a shared-core strategy with minimal coupling.

11. Missing quality gates:
- No CI workflows, no linting setup, and effectively no automated tests.
Define and bootstrap testing pyramid + CI/CD checks.

12. Static website asset path bug:
- `website/styles-2324.css` uses `url("../branding/assets/contactus.jpg")` while assets are under `website/branding/assets/...`.
Fix pathing and add static asset checks.

### Output required

Produce your response in this exact structure:

1. **Executive Summary (max 12 bullets)**
- Top risks, business impact, and expected outcomes.

2. **Prioritized Backlog**
- Table with columns: `Priority (P0/P1/P2)`, `Area`, `Issue`, `Fix`, `Effort (S/M/L)`, `Risk`, `Dependencies`.

3. **Security and Access Control Blueprint**
- Endpoint-by-endpoint access matrix for admin and enduser APIs.
- JWT claim strategy (`sub`, `custom:role`) and ownership validation rules.

4. **Target Architecture**
- Recommended module boundaries.
- Shared library extraction plan (backend + frontend).
- Environment and secret management model.

5. **Implementation Plan**
- 3 phases with milestones:
  - Phase 1: Security and correctness
  - Phase 2: Refactor and testability
  - Phase 3: DevOps and reliability hardening
- Include rollback strategy.

6. **Concrete Code-Level Recommendations**
- File-specific suggested changes for at least 20 files.
- Include pseudo-diffs/snippets for critical fixes.

7. **Testing Strategy**
- Unit, integration, contract, and e2e scope.
- Exact critical test cases for auth, ownership, job apply race conditions, and soft-delete flows.

8. **DevOps and Runtime Hardening**
- CI pipeline design (build/test/lint/security scans).
- SAM/IAM/CORS hardening checklist.
- Observability: structured logs, metrics, alarms, tracing, runbooks.

9. **Definition of Done**
- Measurable acceptance criteria for each phase.

### Constraints

- Keep existing business workflows intact where possible.
- Prefer incremental, low-risk refactors over big-bang rewrites.
- Avoid introducing unnecessary frameworks.
- Use strict typing/validation and consistent API contracts.
- Ensure all recommendations are practical for immediate execution by an engineering team.
