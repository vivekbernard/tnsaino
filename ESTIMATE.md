# Tnsaino — Development Cost Estimate (India)

**Date:** 17 March 2026
**Currency:** INR (₹)
**Engagement Model:** Dedicated team, Indian rates

---

## Team Composition & Rates

| Role                  | Monthly Rate (₹) | Daily Rate (₹) |
|-----------------------|-------------------|-----------------|
| UI/UX Designer        | 70,000            | 3,200           |
| Frontend Developer    | 90,000            | 4,100           |
| Backend Developer     | 1,10,000          | 5,000           |
| Full-Stack Developer  | 1,00,000          | 4,550           |
| QA / Tester           | 50,000            | 2,275           |
| DevOps Engineer       | 1,00,000          | 4,550           |
| Project Manager       | 1,00,000          | 4,550           |

> Based on mid-level Indian developer rates (3–6 yrs experience).
> 22 working days/month.

---

## Phase 1 — UI/UX Design

| Task                                       | Effort (days) | Cost (₹)   |
|--------------------------------------------|---------------|-------------|
| Discovery & wireframes (all portals)       | 8             | 25,600      |
| Marketing website design (responsive)      | 5             | 16,000      |
| Candidate portal UI (search, profile, etc) | 8             | 25,600      |
| Company portal UI (dashboard, applicants)  | 7             | 22,400      |
| Admin portal UI (users, jobs, analytics)   | 7             | 22,400      |
| Design system / component library          | 4             | 12,800      |
| Prototyping & revisions (2 rounds)         | 5             | 16,000      |
| **Subtotal**                               | **44 days**   | **1,40,800**|

---

## Phase 2 — Marketing Website

| Task                                       | Effort (days) | Cost (₹)   |
|--------------------------------------------|---------------|-------------|
| Responsive build (HTML/CSS/JS or Next.js)  | 6             | 24,600      |
| CMS integration (blog/content if needed)   | 4             | 16,400      |
| SEO, performance, accessibility            | 3             | 12,300      |
| Contact form with backend                  | 2             | 10,000      |
| QA & cross-browser testing                 | 3             | 6,825       |
| **Subtotal**                               | **18 days**   | **70,125**  |

---

## Phase 3 — Authentication & User Management (AWS Cognito)

| Task                                          | Effort (days) | Cost (₹)   |
|------------------------------------------------|---------------|-------------|
| AWS Cognito user pool setup (3 groups)         | 2             | 10,000      |
| Sign Up / Sign In flows (Candidate & Company)  | 5             | 25,000      |
| Email verification & password reset            | 2             | 10,000      |
| Social login (Google, LinkedIn) — optional      | 3             | 15,000      |
| Role-based access control (Admin/Candidate/Co.) | 4            | 20,000      |
| Session management & token refresh             | 2             | 10,000      |
| Admin user management (block, approve, delete) | 3             | 15,000      |
| QA & security testing                          | 3             | 6,825       |
| **Subtotal**                                   | **24 days**   | **1,11,825**|

---

## Phase 4 — Candidate Portal

| Task                                           | Effort (days) | Cost (₹)   |
|-------------------------------------------------|---------------|-------------|
| Profile creation & management                   | 5             | 22,750      |
| Resume upload & parsing                         | 4             | 20,000      |
| **Job search — keyword based**                  | 5             | 25,000      |
| **Faceted filters (salary, location, type, exp, skills)** | 7   | 35,000      |
| Job detail view & apply flow                    | 4             | 20,000      |
| Application tracking (status, history)          | 4             | 20,000      |
| Saved jobs / bookmarks                          | 2             | 10,000      |
| Notifications (email + in-app)                  | 4             | 20,000      |
| Dashboard (applied, saved, recommended)         | 4             | 18,200      |
| Frontend build (React/Next.js)                  | 10            | 41,000      |
| QA                                              | 5             | 11,375      |
| **Subtotal**                                    | **54 days**   | **2,43,325**|

---

## Phase 5 — Company Portal

| Task                                           | Effort (days) | Cost (₹)   |
|-------------------------------------------------|---------------|-------------|
| Company profile & branding page                 | 4             | 20,000      |
| Job posting (create, edit, close, duplicate)    | 6             | 30,000      |
| **View job applications (per job)**             | 5             | 25,000      |
| Applicant filtering & shortlisting             | 5             | 25,000      |
| Application status management (pipeline)        | 4             | 20,000      |
| Download resumes / bulk actions                 | 3             | 15,000      |
| Company dashboard (active jobs, stats)          | 4             | 18,200      |
| Notifications (new applicants, etc.)            | 3             | 15,000      |
| Frontend build                                  | 8             | 32,800      |
| QA                                              | 4             | 9,100       |
| **Subtotal**                                    | **46 days**   | **2,10,100**|

---

## Phase 6 — Admin Portal

| Task                                           | Effort (days) | Cost (₹)   |
|-------------------------------------------------|---------------|-------------|
| Admin dashboard (KPIs, counts, recent activity) | 5             | 25,000      |
| **View & search all jobs** (keyword + filters)  | 4             | 20,000      |
| **View & search all companies**                 | 4             | 20,000      |
| **View & search all user profiles**             | 4             | 20,000      |
| User management (activate, deactivate, roles)   | 4             | 20,000      |
| Job moderation (approve, flag, remove)          | 3             | 15,000      |
| Reports & basic analytics                       | 4             | 20,000      |
| Audit logs                                      | 3             | 15,000      |
| Frontend build                                  | 7             | 28,700      |
| QA                                              | 4             | 9,100       |
| **Subtotal**                                    | **42 days**   | **1,92,800**|

---

## Phase 7 — Backend / API & Database

| Task                                           | Effort (days) | Cost (₹)   |
|-------------------------------------------------|---------------|-------------|
| Database schema design (DynamoDB / PostgreSQL)  | 4             | 20,000      |
| REST or GraphQL API scaffolding                 | 3             | 15,000      |
| Job CRUD APIs                                   | 4             | 20,000      |
| Application CRUD APIs                           | 4             | 20,000      |
| User/profile APIs                               | 3             | 15,000      |
| **Search service (Elasticsearch/OpenSearch)**   | 8             | 40,000      |
| File upload service (S3 — resumes, logos)       | 3             | 15,000      |
| Notification service (SES + SNS)                | 4             | 20,000      |
| API Gateway, Lambda or ECS setup                | 4             | 18,200      |
| QA & integration testing                        | 5             | 11,375      |
| **Subtotal**                                    | **42 days**   | **1,94,575**|

---

## Phase 8 — DevOps & Deployment

| Task                                           | Effort (days) | Cost (₹)   |
|-------------------------------------------------|---------------|-------------|
| AWS infrastructure (VPC, subnets, security)     | 3             | 13,650      |
| CI/CD pipeline (GitHub Actions / CodePipeline)  | 3             | 13,650      |
| Staging + Production environments               | 2             | 9,100       |
| Domain, SSL, CloudFront CDN                     | 1             | 4,550       |
| Monitoring & logging (CloudWatch)               | 2             | 9,100       |
| **Subtotal**                                    | **11 days**   | **50,050**  |

---

## Phase 9 — UAT, Bug Fixes & Launch

| Task                                           | Effort (days) | Cost (₹)   |
|-------------------------------------------------|---------------|-------------|
| User acceptance testing                         | 5             | 11,375      |
| Bug fixes & polish                              | 8             | 36,400      |
| Performance optimization                        | 3             | 15,000      |
| Go-live support                                 | 3             | 13,650      |
| **Subtotal**                                    | **19 days**   | **76,425**  |

---

## Summary

| Phase                              | Effort (days) | Cost (₹)      |
|------------------------------------|---------------|----------------|
| 1. UI/UX Design                    | 44            | 1,40,800       |
| 2. Marketing Website               | 18            | 70,125         |
| 3. Auth (AWS Cognito)              | 24            | 1,11,825       |
| 4. Candidate Portal                | 54            | 2,43,325       |
| 5. Company Portal                  | 46            | 2,10,100       |
| 6. Admin Portal                    | 42            | 1,92,800       |
| 7. Backend / API / Search          | 42            | 1,94,575       |
| 8. DevOps & Deployment             | 11            | 50,050         |
| 9. UAT & Launch                    | 19            | 76,425         |
| **Project Management (10%)**       | —             | **1,29,003**   |
| **Buffer / Contingency (15%)**     | —             | **1,93,504**   |
| | | |
| **GRAND TOTAL**                    | **~300 days** | **~₹16,12,532**|

---

## Timeline Estimate

With a team of **4–5 members working in parallel**:

| Milestone                         | Duration     |
|-----------------------------------|--------------|
| UI/UX Design                      | Weeks 1–4    |
| Website + Auth + Backend start    | Weeks 3–8    |
| Candidate & Company portals       | Weeks 6–14   |
| Admin portal                      | Weeks 10–14  |
| Search / faceted filtering        | Weeks 8–12   |
| Integration, QA, DevOps           | Weeks 13–16  |
| UAT & Launch                      | Weeks 16–18  |
| **Total estimated duration**      | **4–5 months** |

---

## Monthly AWS Infrastructure Cost (Estimated)

| Service                           | Monthly (₹)  |
|-----------------------------------|---------------|
| Cognito (up to 50K MAU free tier) | 0             |
| OpenSearch (t3.small)             | 4,500         |
| RDS PostgreSQL / DynamoDB         | 3,000–6,000   |
| S3 + CloudFront                   | 1,500         |
| Lambda / ECS Fargate              | 3,000–8,000   |
| SES (email)                       | 500           |
| CloudWatch, misc                  | 1,000         |
| **Total (approx)**               | **₹15,000–22,000/mo** |

---

## Notes & Assumptions

1. Rates are based on mid-level Indian developers (3–6 yrs). Senior-heavy teams will cost 30–50% more.
2. Does **not** include: payment gateway, video interviews, AI/ML matching, mobile apps (React Native would add ~₹4–6L).
3. Social login (Google/LinkedIn) is optional — remove ~₹15K if not needed.
4. The estimate assumes a **React/Next.js frontend** + **Node.js or Python backend** + **AWS serverless/managed stack**.
5. Faceted search assumes **AWS OpenSearch** — switching to basic SQL `LIKE` queries reduces cost but limits scalability.
6. All amounts are **pre-GST**.
