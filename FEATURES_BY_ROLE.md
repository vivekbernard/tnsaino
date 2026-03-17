# Tnsaino — Features & Functionalities by Role

---

## Candidate

### Authentication
- Sign up with email or social login (Google / LinkedIn)
- Email verification
- Sign in / sign out
- Password reset

### Profile
- Create and edit personal profile (name, contact, skills, experience, education)
- Upload and manage resume (PDF / DOCX)
- Set salary expectations and preferred job type (full-time, contract, remote)
- Set preferred locations

### Job Search
- **Keyword search** — search jobs by title, skill, company name
- **Faceted filters:**
  - Salary range / expectation
  - Location / remote
  - Job type (full-time, part-time, contract, internship)
  - Experience level (fresher, mid, senior)
  - Skills / tech stack
  - Industry
  - Date posted
- Sort results by relevance, date, or salary
- Paginated results

### Job Application
- View full job details (description, requirements, salary, company info)
- Apply to jobs with profile + resume
- Track application status (applied, shortlisted, rejected, hired)
- View application history

### Saved & Recommendations
- Bookmark / save jobs for later
- Dashboard showing applied jobs, saved jobs, and status overview

### Notifications
- Email alerts for application status changes
- In-app notification centre

---

## Company

### Authentication
- Sign up with company email
- Email verification
- Sign in / sign out
- Password reset

### Company Profile
- Create and edit company profile (name, logo, industry, size, description)
- Company branding page visible to candidates

### Job Management
- **Create** new job postings (title, description, requirements, salary range, location, type)
- **Edit** existing job postings
- **Close** filled or expired positions
- **Duplicate** a job posting as a template for new ones

### Applicant Management
- **View applications** received per job posting
- **Filter applicants** by skills, experience, salary expectation, location
- **Shortlist** candidates — move them through pipeline stages
- **Update application status** (reviewing, shortlisted, interview, offered, rejected)
- **Download resumes** individually or in bulk
- **Bulk actions** — shortlist or reject multiple applicants at once

### Dashboard
- Overview of active job postings and their counts
- Total applications received
- Pipeline summary (how many in each stage)
- Recent activity feed

### Notifications
- Email alerts when new applications are received
- In-app notification centre

---

## Admin

### Authentication
- Sign in with admin credentials (pre-provisioned via Cognito)
- MFA (optional but recommended)

### Dashboard
- Platform-wide KPIs: total users, total jobs, total applications, active companies
- Recent activity feed (new sign-ups, new jobs posted, recent applications)
- Quick-access cards to key sections

### User Management
- **View all user profiles** (candidates and company users)
- **Search users** by name, email, role, status
- **Activate / deactivate** user accounts
- **Assign or change roles** (candidate, company, admin)
- **Block or delete** users

### Job Management
- **View all jobs** across all companies
- **Search jobs** by keyword, company, location, status
- **Moderate jobs** — approve, flag inappropriate, or remove listings
- Edit or close jobs on behalf of companies if needed

### Company Management
- **View all companies** registered on the platform
- **Search companies** by name, industry, size, status
- View company details and their posted jobs
- Activate, deactivate, or flag company accounts

### Search (across all entities)
- **Global keyword search** across jobs, companies, and users
- **Faceted filters** per entity type (status, date range, role, location, etc.)

### Reports & Analytics
- User growth over time
- Job posting trends
- Application conversion rates
- Top companies by job volume
- Basic exportable reports (CSV)

### Audit Logs
- Track admin actions (who did what, when)
- User login history

### Moderation
- Review flagged content (jobs, profiles)
- Take action (approve, warn, remove)

---

## Cross-Cutting (All Roles)

| Feature                    | Candidate | Company | Admin |
|----------------------------|-----------|---------|-------|
| Sign up / Sign in          | Yes       | Yes     | Pre-provisioned |
| Email verification         | Yes       | Yes     | —     |
| Password reset             | Yes       | Yes     | Yes   |
| Profile management         | Yes       | Yes     | —     |
| Dashboard                  | Yes       | Yes     | Yes   |
| Keyword search             | Jobs      | Applicants | Jobs, Users, Companies |
| Faceted filters            | Jobs      | Applicants | All entities |
| Notifications (email)      | Yes       | Yes     | Yes   |
| Notifications (in-app)     | Yes       | Yes     | Yes   |
| Role-based access control  | Yes       | Yes     | Yes   |
| Responsive UI              | Yes       | Yes     | Yes   |

---

## Feature Count Summary

| Role      | Feature Areas | Key Features |
|-----------|---------------|--------------|
| Candidate | 6             | 18           |
| Company   | 6             | 20           |
| Admin     | 8             | 24           |
| **Total** |               | **62 unique features** |
