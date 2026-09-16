-- ==============================================================================
-- MOHAMED EBRAHIM PORTFOLIO — COMPLETE SUPABASE DATABASE SCHEMA & SEED DATA
-- Production-Ready PostgreSQL Schema with Row Level Security (RLS) & Storage
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES & ADMIN ACCESS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT DEFAULT 'Mohamed Ebrahim',
    role TEXT DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. SITE SETTINGS & SEO
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    site_title TEXT DEFAULT 'Mohamed Ebrahim | Data Analyst & ML Engineer',
    site_description TEXT DEFAULT 'Portfolio of Mohamed Ebrahim — Data Analytics, Machine Learning, Generative AI, and Data Engineering.',
    canonical_url TEXT DEFAULT 'https://mhmd-ebrahim-1.github.io/',
    og_image TEXT DEFAULT 'https://mhmd-ebrahim-1.github.io/profile.jpg',
    twitter_handle TEXT DEFAULT '@mhmd_ebrahim_1',
    cv_url TEXT DEFAULT '/Mohamed-Ebrahim-CV.pdf',
    contact_email TEXT DEFAULT 'mhmd_ebrahim_1@outlook.com',
    whatsapp_number TEXT DEFAULT '201093556456',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    ga_measurement_id TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. HERO & PROFILE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero (
    id TEXT PRIMARY KEY DEFAULT 'main',
    name TEXT DEFAULT 'Mohamed Ebrahim',
    full_name TEXT DEFAULT 'Mohamed Ebrahim Hamed',
    title TEXT DEFAULT 'Data Analyst & ML Engineer',
    roles JSONB DEFAULT '["Data Analyst", "Machine Learning Engineer", "AI & RAG Developer", "Data Engineering Practitioner"]'::JSONB,
    tagline TEXT DEFAULT 'Turning raw data into production intelligence with rigorous modeling, analytics, and GenAI systems.',
    status TEXT DEFAULT 'Open to internships & freelance opportunities',
    location TEXT DEFAULT 'Mansoura, Egypt',
    bio TEXT DEFAULT 'Artificial Intelligence undergraduate at Kafr El-Sheikh University specializing in Data Analytics, Machine Learning, and practical AI systems.',
    bio2 TEXT DEFAULT 'Focused on bridging raw data with actionable business insights and production-grade intelligent workflows using Python, SQL, Power BI, PySpark, and modern AI architectures.',
    avatar_image TEXT DEFAULT '/profile-home-about.webp',
    cv_filename TEXT DEFAULT 'Mohamed-Ebrahim-CV.pdf',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. ABOUT SECTION & EDUCATION
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.about (
    id TEXT PRIMARY KEY DEFAULT 'main',
    university TEXT DEFAULT 'Kafr El-Sheikh University',
    degree TEXT DEFAULT 'B.Sc. Artificial Intelligence',
    graduation_year TEXT DEFAULT '2023 – 2027',
    location TEXT DEFAULT 'Mansoura, Egypt',
    headline TEXT DEFAULT 'Turning Data Into Intelligence',
    code_profile JSONB DEFAULT '{
      "role": "Data Analyst & ML Engineer",
      "stack": [
        "Data Analytics & Power BI",
        "Machine Learning & Computer Vision",
        "Arabic RAG & GenAI",
        "PySpark & Data Pipelines"
      ],
      "deliver_impact": "Rigorous, Evidence-Based Solutions"
    }'::JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT NOT NULL,
    accent TEXT DEFAULT '#00f5d4',
    short_desc TEXT NOT NULL,
    full_desc TEXT,
    value_prop TEXT,
    cover_image TEXT,
    github TEXT,
    live TEXT,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    tech JSONB DEFAULT '[]'::JSONB,
    metrics JSONB DEFAULT '[]'::JSONB,
    tags JSONB DEFAULT '[]'::JSONB,
    gallery JSONB DEFAULT '[]'::JSONB,
    case_study JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. EXPERIENCE / TIMELINE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL,
    organization TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT DEFAULT 'Present',
    current_position BOOLEAN DEFAULT FALSE,
    description TEXT,
    technologies JSONB DEFAULT '[]'::JSONB,
    display_order INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. CERTIFICATES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issuer_short TEXT,
    date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    cover_image TEXT,
    category TEXT DEFAULT 'all',
    category_label TEXT DEFAULT 'Certification',
    accent TEXT DEFAULT '#00f5d4',
    skills JSONB DEFAULT '[]'::JSONB,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. SKILLS & TOOLING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    domain_key TEXT UNIQUE NOT NULL,
    domain_title TEXT NOT NULL,
    domain_description TEXT,
    accent TEXT DEFAULT '#00f5d4',
    skills JSONB DEFAULT '[]'::JSONB,
    display_order INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT DEFAULT '#00f5d4',
    display_order INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE
);

-- ------------------------------------------------------------------------------
-- 9. SERVICES & OFFERINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    full_desc TEXT,
    icon TEXT DEFAULT 'Database',
    accent TEXT DEFAULT '#00f5d4',
    tech JSONB DEFAULT '[]'::JSONB,
    deliverables JSONB DEFAULT '[]'::JSONB,
    cta TEXT DEFAULT 'Inquire Service',
    email_subject TEXT DEFAULT 'Technical Service Inquiry',
    display_order INT DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. SOCIAL LINKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_links (
    id TEXT PRIMARY KEY,
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 11. CONTACT MESSAGES (SUBMISSIONS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. AUDIT ACTIVITY LOG
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_name TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. PAGE VIEWS & ANALYTICS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Helper policy for public reading of published data
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view hero" ON public.hero FOR SELECT USING (true);
CREATE POLICY "Public can view about" ON public.about FOR SELECT USING (true);
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view published experience" ON public.experience FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view published certificates" ON public.certificates FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view published skills" ON public.skills FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view published tools" ON public.tools FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view published services" ON public.services FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can view social links" ON public.social_links FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Public can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);

-- Authenticated Admin Full CRUD Policies
CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access hero" ON public.hero FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access about" ON public.about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access certificates" ON public.certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access tools" ON public.tools FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access services" ON public.services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access social_links" ON public.social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access contact_messages" ON public.contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access audit_logs" ON public.audit_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access page_views" ON public.page_views FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('media', 'media', true),
    ('projects', 'projects', true),
    ('certificates', 'certificates', true),
    ('cv', 'cv', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access
CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING (bucket_id IN ('media', 'projects', 'certificates', 'cv'));
CREATE POLICY "Admin Insert Media" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Media" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Media" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.site_settings (id, site_title, contact_email, whatsapp_number, cv_url)
VALUES ('global', 'Mohamed Ebrahim | Data Analyst & ML Engineer', 'mhmd_ebrahim_1@outlook.com', '201093556456', '/Mohamed-Ebrahim-CV.pdf')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.hero (id, name, full_name, title, location, status)
VALUES ('main', 'Mohamed Ebrahim', 'Mohamed Ebrahim Hamed', 'Data Analyst & ML Engineer', 'Mansoura, Egypt', 'Open to internships & freelance opportunities')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.about (id, university, degree, graduation_year, location)
VALUES ('main', 'Kafr El-Sheikh University', 'B.Sc. Artificial Intelligence', '2023 – 2027', 'Mansoura, Egypt')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.social_links (id, platform, label, url, icon, color, active, display_order)
VALUES
    ('linkedin', 'LinkedIn', 'LinkedIn', 'https://www.linkedin.com/in/mhmd-ebrahim1/', 'Linkedin', '#0ea5e9', true, 1),
    ('github', 'GitHub', 'GitHub', 'https://github.com/mhmd-ebrahim-1', 'Github', '#ffffff', true, 2),
    ('whatsapp', 'WhatsApp', 'WhatsApp', 'https://wa.me/201093556456?text=Hello%20Mohamed%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20%2F%20opportunity.', 'WhatsAppIcon', '#00f5d4', true, 3),
    ('twitter', 'Twitter', 'X (Twitter)', 'https://x.com/mhmd_ebrahim_1', 'Twitter', '#38bdf8', true, 4),
    ('instagram', 'Instagram', 'Instagram', 'https://www.instagram.com/mhmd_ebrahim_1', 'Instagram', '#f43f5e', true, 5)
ON CONFLICT (id) DO NOTHING;
