-- Jobs Portal Schema - AWS DSQL Compatible
-- No Foreign Keys, No Triggers, No Stored Procedures
-- UUID Primary Keys, Soft Deletes
-- DSQL requires CREATE INDEX ASYNC and does not support partial indexes (WHERE)

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    linked_entity_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ASYNC idx_users_status ON users (status);
CREATE INDEX ASYNC idx_users_is_deleted ON users (is_deleted);
CREATE INDEX ASYNC idx_users_role ON users (role);

-- ============================================
-- CANDIDATES TABLE
-- ============================================
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    photo_url VARCHAR(512),
    portfolio_url VARCHAR(512),
    github_url VARCHAR(512),
    linkedin_url VARCHAR(512),
    current_company VARCHAR(255),
    current_title VARCHAR(255),
    working_since DATE,
    license TEXT,
    patents TEXT,
    certifications TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ASYNC idx_candidates_status ON candidates (status);
CREATE INDEX ASYNC idx_candidates_is_deleted ON candidates (is_deleted);
CREATE INDEX ASYNC idx_candidates_user_id ON candidates (user_id);

-- ============================================
-- COMPANIES TABLE
-- ============================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(512),
    details TEXT,
    corporate_website VARCHAR(512),
    hr_contact_name VARCHAR(255),
    hr_contact_email VARCHAR(255),
    legal_contact_name VARCHAR(255),
    legal_contact_email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ASYNC idx_companies_name ON companies (name);
CREATE INDEX ASYNC idx_companies_status ON companies (status);
CREATE INDEX ASYNC idx_companies_is_deleted ON companies (is_deleted);
CREATE INDEX ASYNC idx_companies_user_id ON companies (user_id);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    company_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    job_description TEXT,
    required_professional_experience TEXT,
    required_educational_experience TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    applicant_count INTEGER NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ASYNC idx_jobs_company_id ON jobs (company_id);
CREATE INDEX ASYNC idx_jobs_status ON jobs (status);
CREATE INDEX ASYNC idx_jobs_is_deleted ON jobs (is_deleted);

-- ============================================
-- JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL,
    candidate_id UUID NOT NULL,
    candidate_name VARCHAR(255),
    job_title VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    UNIQUE (job_id, candidate_id)
);

CREATE INDEX ASYNC idx_job_applications_job_id ON job_applications (job_id);
CREATE INDEX ASYNC idx_job_applications_candidate_id ON job_applications (candidate_id);
CREATE INDEX ASYNC idx_job_applications_is_deleted ON job_applications (is_deleted);
