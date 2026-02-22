-- Seed Data for Jobs Portal
-- Realistic sample data for all tables
-- Run after V1__init_schema.sql

-- ============================================
-- USERS (10 users: 1 admin, 4 candidates, 4 companies, 1 disabled)
-- ============================================
INSERT INTO users (id, username, role, linked_entity_id, status) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@jobsportal.com', 'ADMIN', NULL, 'ACTIVE'),
('a0000000-0000-0000-0000-000000000002', 'james.wilson@gmail.com', 'CANDIDATE', 'c1000000-0000-0000-0000-000000000001', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000003', 'priya.sharma@outlook.com', 'CANDIDATE', 'c1000000-0000-0000-0000-000000000002', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000004', 'maria.gonzalez@yahoo.com', 'CANDIDATE', 'c1000000-0000-0000-0000-000000000003', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000005', 'david.chen@proton.me', 'CANDIDATE', 'c1000000-0000-0000-0000-000000000004', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000006', 'hr@acmecorp.com', 'COMPANY', 'b1000000-0000-0000-0000-000000000001', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000007', 'recruiting@technovaai.com', 'COMPANY', 'b1000000-0000-0000-0000-000000000002', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000008', 'talent@greenleafenergy.com', 'COMPANY', 'b1000000-0000-0000-0000-000000000003', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000009', 'jobs@pinnaclehealth.org', 'COMPANY', 'b1000000-0000-0000-0000-000000000004', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000010', 'old.user@retired.com', 'CANDIDATE', NULL, 'DISABLED');

-- ============================================
-- CANDIDATES (4 active + 1 soft-deleted)
-- ============================================
INSERT INTO candidates (id, user_id, name, email, phone, photo_url, portfolio_url, github_url, linkedin_url, current_company, current_title, working_since, license, patents, certifications, status) VALUES
(
    'c1000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000002',
    'James Wilson',
    'james.wilson@gmail.com',
    '+1-415-555-0142',
    NULL,
    'https://jameswilson.dev',
    'https://github.com/jameswilson',
    'https://linkedin.com/in/jameswilson',
    'Stripe',
    'Senior Software Engineer',
    '2017-03-15',
    NULL,
    NULL,
    'AWS Solutions Architect Associate, Kubernetes CKAD',
    'ACTIVE'
),
(
    'c1000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000003',
    'Priya Sharma',
    'priya.sharma@outlook.com',
    '+1-646-555-0198',
    NULL,
    'https://priyasharma.io',
    'https://github.com/priyasharma',
    'https://linkedin.com/in/priyasharma',
    'Goldman Sachs',
    'Data Scientist',
    '2019-08-01',
    NULL,
    'Method for Real-Time Fraud Detection Using Ensemble Models (US Patent 11,234,567)',
    'Google Professional Machine Learning Engineer, TensorFlow Developer Certificate',
    'ACTIVE'
),
(
    'c1000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000004',
    'Maria Gonzalez',
    'maria.gonzalez@yahoo.com',
    '+1-305-555-0176',
    NULL,
    NULL,
    'https://github.com/mariagonz',
    'https://linkedin.com/in/mariagonzalez',
    'Deloitte',
    'UX Design Lead',
    '2015-06-20',
    NULL,
    NULL,
    'Google UX Design Certificate, Certified Usability Analyst (CUA)',
    'ACTIVE'
),
(
    'c1000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000005',
    'David Chen',
    'david.chen@proton.me',
    '+1-206-555-0123',
    NULL,
    NULL,
    'https://github.com/davidchen',
    'https://linkedin.com/in/davidchen',
    NULL,
    NULL,
    NULL,
    'PE License - State of Washington',
    NULL,
    'PMP, AWS DevOps Engineer Professional',
    'ACTIVE'
),
(
    'c1000000-0000-0000-0000-000000000005',
    NULL,
    'Alex Thompson',
    'alex.thompson@email.com',
    '+1-512-555-0155',
    NULL,
    NULL,
    NULL,
    'https://linkedin.com/in/alexthompson',
    'IBM',
    'Cloud Architect',
    '2016-01-10',
    NULL,
    NULL,
    'AWS Solutions Architect Professional',
    'ACTIVE'
);

UPDATE candidates SET is_deleted = TRUE, deleted_at = '2025-12-01T10:30:00Z' WHERE id = 'c1000000-0000-0000-0000-000000000005';

-- ============================================
-- COMPANIES (4 active + 1 soft-deleted)
-- ============================================
INSERT INTO companies (id, user_id, name, logo_url, details, corporate_website, hr_contact_name, hr_contact_email, legal_contact_name, legal_contact_email, status) VALUES
(
    'b1000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000006',
    'Acme Corporation',
    NULL,
    'Acme Corporation is a Fortune 500 technology conglomerate specializing in enterprise software solutions, cloud infrastructure, and digital transformation services. Founded in 1998, we serve over 10,000 clients across 45 countries.',
    'https://www.acmecorp.com',
    'Sarah Mitchell',
    'sarah.mitchell@acmecorp.com',
    'Robert Chang',
    'robert.chang@acmecorp.com',
    'ACTIVE'
),
(
    'b1000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000007',
    'TechNova AI',
    NULL,
    'TechNova AI is a Series C startup building next-generation artificial intelligence platforms for healthcare diagnostics and drug discovery. Backed by $180M in funding from Sequoia and Andreessen Horowitz.',
    'https://www.technovaai.com',
    'Lisa Park',
    'lisa.park@technovaai.com',
    'Michael Torres',
    'michael.torres@technovaai.com',
    'ACTIVE'
),
(
    'b1000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000008',
    'GreenLeaf Energy',
    NULL,
    'GreenLeaf Energy develops and operates renewable energy infrastructure including solar farms, wind turbines, and battery storage systems across the Western United States. Committed to carbon-neutral operations by 2028.',
    'https://www.greenleafenergy.com',
    'Tom Bradley',
    'tom.bradley@greenleafenergy.com',
    'Nina Patel',
    'nina.patel@greenleafenergy.com',
    'ACTIVE'
),
(
    'b1000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000009',
    'Pinnacle Health Systems',
    NULL,
    'Pinnacle Health Systems is a regional healthcare network operating 12 hospitals and 85 outpatient clinics across the Midwest. We leverage cutting-edge health IT to deliver patient-centered care to over 2 million patients annually.',
    'https://www.pinnaclehealth.org',
    'Jennifer Adams',
    'jennifer.adams@pinnaclehealth.org',
    'Kevin Reilly',
    'kevin.reilly@pinnaclehealth.org',
    'ACTIVE'
),
(
    'b1000000-0000-0000-0000-000000000005',
    NULL,
    'OldTech Solutions',
    NULL,
    'Legacy technology consulting firm.',
    'https://www.oldtechsolutions.com',
    'John Doe',
    'john@oldtech.com',
    NULL,
    NULL,
    'ACTIVE'
);

UPDATE companies SET is_deleted = TRUE, deleted_at = '2025-11-15T14:00:00Z' WHERE id = 'b1000000-0000-0000-0000-000000000005';

-- ============================================
-- JOBS (8 open, 2 closed, 1 soft-deleted)
-- ============================================
INSERT INTO jobs (id, company_id, company_name, title, job_description, required_professional_experience, required_educational_experience, status, applicant_count) VALUES
(
    'd1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Acme Corporation',
    'Senior Backend Engineer',
    'We are looking for an experienced backend engineer to design and build scalable microservices powering our enterprise SaaS platform. You will work closely with product and infrastructure teams to deliver high-availability APIs processing millions of requests daily.',
    '5+ years of experience with Java or Kotlin. Strong understanding of distributed systems, event-driven architectures, and relational databases. Experience with AWS services (Lambda, DynamoDB, SQS) is a plus.',
    'Bachelor''s degree in Computer Science, Software Engineering, or equivalent practical experience.',
    'OPEN',
    2
),
(
    'd1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Acme Corporation',
    'Product Manager - Platform',
    'Lead product strategy for our developer platform. Define roadmap, gather requirements from enterprise clients, and work with engineering to deliver features that increase developer adoption and satisfaction.',
    '3+ years of product management experience in B2B SaaS. Track record of launching products from 0 to 1. Experience with APIs and developer tools preferred.',
    'Bachelor''s degree in any field. MBA is a plus but not required.',
    'OPEN',
    1
),
(
    'd1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'TechNova AI',
    'Machine Learning Engineer',
    'Join our core ML team building models for medical image analysis and clinical decision support. You will develop, train, and deploy deep learning models that assist radiologists in detecting early-stage cancers with 98%+ accuracy.',
    '3+ years of experience in machine learning with focus on computer vision or NLP. Proficiency in Python, PyTorch or TensorFlow. Experience deploying models in production environments.',
    'Master''s or PhD in Computer Science, Machine Learning, Statistics, or related quantitative field.',
    'OPEN',
    1
),
(
    'd1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000002',
    'TechNova AI',
    'Full Stack Developer',
    'Build and maintain the web applications that enable clinicians to interact with our AI diagnostic tools. Create intuitive dashboards, patient management interfaces, and real-time reporting systems.',
    '2+ years of experience with React and Node.js or Python backend frameworks. Experience with healthcare data standards (HL7 FHIR) is a plus.',
    'Bachelor''s degree in Computer Science or equivalent.',
    'OPEN',
    0
),
(
    'd1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000003',
    'GreenLeaf Energy',
    'Solar Systems Engineer',
    'Design and oversee the installation of utility-scale solar photovoltaic systems. Perform site assessments, create system designs, and ensure compliance with local building codes and NEC requirements.',
    '4+ years of experience in solar PV system design. Proficiency with PVsyst, AutoCAD, and Helioscope. PE license preferred.',
    'Bachelor''s degree in Electrical Engineering, Mechanical Engineering, or related field.',
    'OPEN',
    1
),
(
    'd1000000-0000-0000-0000-000000000006',
    'b1000000-0000-0000-0000-000000000003',
    'GreenLeaf Energy',
    'Environmental Compliance Analyst',
    'Monitor and ensure compliance with federal, state, and local environmental regulations for our renewable energy projects. Prepare environmental impact assessments, manage permits, and coordinate with regulatory agencies.',
    '2+ years of experience in environmental compliance or regulatory affairs. Knowledge of NEPA, Clean Air Act, and state renewable energy mandates.',
    'Bachelor''s degree in Environmental Science, Environmental Law, or related field.',
    'OPEN',
    0
),
(
    'd1000000-0000-0000-0000-000000000007',
    'b1000000-0000-0000-0000-000000000004',
    'Pinnacle Health Systems',
    'Registered Nurse - ICU',
    'Provide critical care nursing in our 30-bed medical ICU. Manage complex patients on ventilators, vasopressors, and CRRT. Collaborate with intensivists and multidisciplinary teams to deliver evidence-based care.',
    '2+ years of ICU nursing experience. Current BLS, ACLS, and NIHSS certifications required. CCRN certification preferred.',
    'Bachelor of Science in Nursing (BSN) from an accredited program. Active RN license in the state.',
    'OPEN',
    0
),
(
    'd1000000-0000-0000-0000-000000000008',
    'b1000000-0000-0000-0000-000000000004',
    'Pinnacle Health Systems',
    'Health Informatics Specialist',
    'Lead the implementation and optimization of our Epic EHR system across all facilities. Analyze clinical workflows, configure system modules, and train end users to maximize adoption and data quality.',
    '3+ years of experience with Epic or similar EHR systems. Epic certification in at least two modules. Experience with clinical data analytics and reporting.',
    'Bachelor''s degree in Health Informatics, Information Systems, or Nursing with informatics focus. Master''s preferred.',
    'OPEN',
    0
),
(
    'd1000000-0000-0000-0000-000000000009',
    'b1000000-0000-0000-0000-000000000001',
    'Acme Corporation',
    'Junior Frontend Developer',
    'This position has been filled. We found an excellent candidate through this platform.',
    '0-2 years of experience with React, HTML, CSS, JavaScript.',
    'Bachelor''s degree in Computer Science or completion of a recognized coding bootcamp.',
    'CLOSED',
    5
),
(
    'd1000000-0000-0000-0000-000000000010',
    'b1000000-0000-0000-0000-000000000002',
    'TechNova AI',
    'DevOps Engineer',
    'This position has been filled internally.',
    '3+ years of experience with CI/CD pipelines, Docker, Kubernetes, and cloud platforms.',
    'Bachelor''s degree in Computer Science or equivalent.',
    'CLOSED',
    3
);

-- Soft-deleted job
INSERT INTO jobs (id, company_id, company_name, title, job_description, required_professional_experience, required_educational_experience, status, applicant_count) VALUES
(
    'd1000000-0000-0000-0000-000000000011',
    'b1000000-0000-0000-0000-000000000001',
    'Acme Corporation',
    'Office Manager (Duplicate Posting)',
    'This was a duplicate posting and has been removed.',
    'N/A',
    'N/A',
    'CLOSED',
    0
);

UPDATE jobs SET is_deleted = TRUE, deleted_at = '2025-10-20T09:00:00Z' WHERE id = 'd1000000-0000-0000-0000-000000000011';

-- ============================================
-- JOB APPLICATIONS (7 applications across various jobs)
-- ============================================
INSERT INTO job_applications (id, job_id, candidate_id, candidate_name, job_title, status, applied_at) VALUES
(
    'e1000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'James Wilson',
    'Senior Backend Engineer',
    'INTERVIEW',
    '2026-01-10T14:30:00Z'
),
(
    'e1000000-0000-0000-0000-000000000002',
    'd1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000004',
    'David Chen',
    'Senior Backend Engineer',
    'APPLIED',
    '2026-01-15T09:00:00Z'
),
(
    'e1000000-0000-0000-0000-000000000003',
    'd1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003',
    'Maria Gonzalez',
    'Product Manager - Platform',
    'REVIEWED',
    '2026-01-12T11:45:00Z'
),
(
    'e1000000-0000-0000-0000-000000000004',
    'd1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000002',
    'Priya Sharma',
    'Machine Learning Engineer',
    'INTERVIEW',
    '2026-01-08T16:20:00Z'
),
(
    'e1000000-0000-0000-0000-000000000005',
    'd1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000004',
    'David Chen',
    'Solar Systems Engineer',
    'APPLIED',
    '2026-02-01T08:15:00Z'
),
(
    'e1000000-0000-0000-0000-000000000006',
    'd1000000-0000-0000-0000-000000000009',
    'c1000000-0000-0000-0000-000000000001',
    'James Wilson',
    'Junior Frontend Developer',
    'REJECTED',
    '2025-09-15T10:00:00Z'
),
(
    'e1000000-0000-0000-0000-000000000007',
    'd1000000-0000-0000-0000-000000000009',
    'c1000000-0000-0000-0000-000000000003',
    'Maria Gonzalez',
    'Junior Frontend Developer',
    'OFFERED',
    '2025-09-18T13:30:00Z'
);
