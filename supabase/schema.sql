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

-- Seed Services
INSERT INTO public.services (id, title, short_desc, icon, accent, tech, deliverables, cta, email_subject, display_order, published)
VALUES
    ('data-analysis-eda', 'Data Analysis & EDA', 'Transform raw, unstructured, or messy business datasets into clean, structured data with exploratory statistical insights and visual distributions.', 'BarChart3', '#0ea5e9', '["Python", "Pandas", "NumPy", "Data Cleaning", "EDA", "Statistical Analysis"]'::JSONB, '["In-depth exploratory data analysis (EDA)", "Automated data cleaning & outlier handling scripts", "Summary statistic profiling & hypothesis testing", "Executive visual summaries in Matplotlib/Seaborn"]'::JSONB, 'Discuss Data Analysis', 'Data Analysis Project Inquiry', 1, true),
    ('power-bi-dashboards', 'Power BI & Business Intelligence', 'Design interactive, production-ready Power BI reporting dashboards with custom DAX calculations, dimensional star schemas, and automated KPI tracking.', 'LayoutDashboard', '#00f5d4', '["Power BI", "DAX", "Data Modeling", "Star Schema", "KPI Design", "Business Reporting"]'::JSONB, '["Interactive multi-page executive dashboards", "Complex DAX measures and time-intelligence calculations", "Robust dimensional data models (Fact & Dimension tables)", "Automated refresh pipelines and user-friendly filters"]'::JSONB, 'Request a Dashboard', 'Power BI Dashboard Request', 2, true),
    ('sql-database-analysis', 'SQL & Database Analytics', 'Write optimized SQL queries for complex joins, aggregations, window functions, and data extraction across relational databases and warehouses.', 'Database', '#38bdf8', '["PostgreSQL", "SQL Server", "Snowflake SQL", "Window Functions", "Data Extraction"]'::JSONB, '["Complex analytical queries and subqueries", "Window functions for rolling metrics and rankings", "Data validation, deduplication, and staging logic", "Relational schema inspection and query tuning"]'::JSONB, 'Discuss Database Project', 'SQL & Database Project Inquiry', 3, true),
    ('machine-learning-solutions', 'Machine Learning Solutions', 'End-to-end predictive modeling systems spanning data preparation, feature engineering, model selection, hyperparameter tuning, and cross-validation.', 'BrainCircuit', '#a78bfa', '["Scikit-learn", "TensorFlow", "Feature Engineering", "Classification", "Regression"]'::JSONB, '["Custom predictive models for business classification/regression", "Feature engineering and selection pipelines", "Comprehensive evaluation with ROC-AUC, F1, Precision/Recall, RMSE", "Inference scripts ready for deployment or batch jobs"]'::JSONB, 'Build an ML Model', 'Machine Learning Project Inquiry', 4, true),
    ('ai-nlp-rag-systems', 'AI, NLP & RAG Systems', 'Develop domain-specific retrieval-augmented generation (RAG) applications, custom document search engines, semantic question-answering, and LLM pipelines.', 'Bot', '#fb923c', '["Python", "RAG", "NLP", "Ollama", "TF-IDF / Embeddings", "Context Caching", "Flask"]'::JSONB, '["Document ingestion and chunking pipelines", "Hybrid semantic and keyword retrieval architectures", "Local LLM integration with fallback mechanisms", "Context-aware question-answering APIs with source attribution"]'::JSONB, 'Discuss AI & RAG', 'AI & RAG System Project Inquiry', 5, true),
    ('computer-vision', 'Computer Vision & Object Detection', 'Design real-time visual classification, multi-class object detection, and CNN-based image recognition systems for edge or web applications.', 'Eye', '#f43f5e', '["OpenCV", "YOLOv8", "PyTorch", "CNNs", "Image Classification", "Real-Time Video"]'::JSONB, '["Object detection and multi-class classification models", "Real-time video inference pipelines with OpenCV", "Dataset preprocessing, augmentation, and annotation scripts", "REST API integration for image inference"]'::JSONB, 'Discuss Vision System', 'Computer Vision Project Inquiry', 6, true),
    ('data-engineering-big-data', 'Data Engineering & Pipelines', 'Architect reproducible batch data pipelines, distributed transformations, Dockerized multi-service workflows, and cloud warehouse storage.', 'Cpu', '#34d399', '["PySpark", "Hadoop HDFS", "Apache Airflow", "Snowflake", "Docker", "ETL"]'::JSONB, '["Distributed PySpark data transformation scripts", "Apache Airflow DAGs for automated workflow scheduling", "Staging and star-schema loading into Snowflake", "Docker Compose multi-container pipeline environments"]'::JSONB, 'Discuss Data Engineering', 'Data Engineering Project Inquiry', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Skills
INSERT INTO public.skills (domain_key, domain_title, domain_description, accent, skills, display_order)
VALUES
    ('analytics', 'Data Analytics & BI', 'Transforming raw structured data into clean models, exploratory insights, and executive KPIs.', '#0ea5e9', '["Python", "SQL", "Pandas", "NumPy", "Power BI", "DAX", "Data Cleaning", "EDA", "Matplotlib", "Seaborn", "PostgreSQL"]'::JSONB, 1),
    ('ml', 'Machine Learning', 'Developing and evaluating predictive algorithms, feature engineering, and statistical modeling.', '#00f5d4', '["Scikit-learn", "TensorFlow", "PyTorch", "Keras", "Feature Engineering", "Model Evaluation", "Cross-Validation", "Gradient Descent", "Regression & Classification"]'::JSONB, 2),
    ('ai_nlp', 'AI, NLP & GenAI', 'Architecting semantic retrieval systems, retrieval-augmented generation (RAG), and language models.', '#a78bfa', '["NLP", "RAG Architecture", "LLMs", "Prompt Engineering", "TF-IDF & Semantic Search", "Transformers", "Ollama", "Context Caching"]'::JSONB, 3),
    ('vision', 'Computer Vision', 'Image classification, real-time object detection, facial emotion analysis, and edge vision pipelines.', '#fb923c', '["OpenCV", "YOLOv8", "CNN Architectures", "Image Classification", "Real-Time Video Inference", "Edge Prototyping"]'::JSONB, 4),
    ('data_eng', 'Data Engineering', 'Building resilient distributed data processing, automated orchestration, and cloud warehouses.', '#38bdf8', '["PySpark", "Hadoop HDFS", "Apache Airflow", "Snowflake", "Docker", "ETL Pipelines", "Data Warehousing", "Star Schema"]'::JSONB, 5),
    ('dev_tools', 'Development & Platforms', 'Robust software engineering foundations, containerization, reproducible experiments, and version control.', '#f43f5e', '["Git", "GitHub", "Docker", "Linux / Bash", "Jupyter", "VS Code", "Flask", "REST APIs", "C++", "Arduino"]'::JSONB, 6)
ON CONFLICT (domain_key) DO NOTHING;

-- Seed Experience
INSERT INTO public.experience (id, role, organization, location, start_date, end_date, current_position, description, technologies, display_order, published)
VALUES
    (1, 'Generative AI & LLM Applications Trainee', 'Information Technology Institute (ITI) — NVIDIA DLI', 'Egypt', 'Nov 2025', 'Dec 2025', false, 'Completed intensive technical training on modern LLM architectures, prompt engineering patterns, and retrieval-augmented generation (RAG). Built end-to-end retrieval pipelines and developed Python/NLP modules for domain-specific question answering.', '["LLMs", "RAG", "Prompt Engineering", "Python", "NLP", "Ollama"]'::JSONB, 1, true),
    (2, 'Data Analysis Intern', 'National Telecommunication Institute (NTI)', 'Egypt', 'Jun 2025', 'Jul 2025', false, 'Conducted exploratory data analysis and statistical evaluation on telecom customer and operational datasets using Python and SQL. Built classification models for churn and segment prediction, generated data-driven reports, and presented visual insights.', '["Python", "SQL", "Machine Learning", "Data Analysis", "EDA", "Statistical Profiling"]'::JSONB, 2, true),
    (3, 'Data Science Member', 'Microsoft Student Club — KFS', 'Egypt', 'Oct 2025', 'Dec 2025', false, 'Collaborated on data-driven projects, machine learning challenges, and community workshops. Led peer sessions on Python data analysis, predictive modeling concepts, and Power BI report design.', '["Data Science", "Machine Learning", "Power BI", "Collaboration", "Python"]'::JSONB, 3, true),
    (4, 'Power BI Trainee', 'Microsoft Student Club — KFS', 'Egypt', 'Mar 2025', 'May 2025', false, 'Designed multi-page interactive Power BI dashboards, structured relational dimensional data models, and implemented DAX measures for executive KPI tracking and business intelligence reporting.', '["Power BI", "DAX", "Data Modeling", "Business Intelligence", "KPI Design"]'::JSONB, 4, true),
    (5, 'AI Committee Member', 'Mansoura Robotics Club', 'Mansoura, Egypt', 'Jun 2024', 'May 2025', false, 'Researched and integrated artificial intelligence and computer vision algorithms into robotics systems. Collaborated with embedded engineering teams on sensor data processing and model deployment.', '["AI", "Computer Vision", "Python", "Robotics Integration", "Teamwork"]'::JSONB, 5, true),
    (6, 'Machine Learning Member', 'IEEE Kafrelshiekh Student Branch', 'Egypt', 'Oct 2024', 'Feb 2025', false, 'Developed machine learning models for community challenges, participated in technical peer reviews, and supported university workshops introducing undergraduate students to data science tools.', '["Machine Learning", "Python", "Scikit-Learn", "Data Preprocessing"]'::JSONB, 6, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Projects
INSERT INTO public.projects (id, slug, title, category, category_label, accent, short_desc, full_desc, value_prop, cover_image, github, live, featured, published, display_order, tech, metrics, tags)
VALUES
    (1, 'superstore-analytics', 'Superstore Analytics Dashboard', 'data', 'BUSINESS INTELLIGENCE', '#0ea5e9', 'Production-grade retail intelligence dashboard evaluating $2.3M+ in multi-year enterprise sales transactions.', 'Production-grade retail intelligence dashboard evaluating $2.3M+ in multi-year enterprise sales transactions. Features an optimized star-schema dimensional model, advanced DAX time-intelligence metrics, dynamic currency switching, dynamic Pareto 80/20 customer breakdown, and return-rate root cause diagnostics.', 'Production-grade retail intelligence dashboard evaluating $2.3M+ in sales with advanced DAX and star-schema dimensional modeling.', 'projects/superstore-analytics.png', 'https://github.com/mhmd-ebrahim-1/Superstore-Sales-Analysis', null, true, true, 1, '["Power BI", "DAX", "SQL", "Excel", "Data Modeling", "Star Schema"]'::JSONB, '["$2.3M+ Analyzed Revenue", "50+ DAX Measures", "100% Star-Schema Optimized"]'::JSONB, '["Power BI", "DAX", "Retail Analytics"]'::JSONB),
    (2, 'rag-assistant', 'Arabic RAG Assistant', 'ai', 'RETRIEVAL-AUGMENTED AI', '#00f5d4', 'End-to-end Arabic Retrieval-Augmented Generation assistant with contextual grounding.', 'End-to-end Arabic Retrieval-Augmented Generation assistant with contextual grounding. Combines semantic vector search, localized context caching, and custom NLP preprocessing for accurate Arabic text comprehension and citation-backed document synthesis.', 'High-precision Arabic retrieval system combining semantic embeddings, localized chunking, and verifiable answer citations.', 'projects/rag-assistant.svg', 'https://github.com/mhmd-ebrahim-1/RAG-System-for-Arabic-Q-A', null, true, true, 2, '["Python", "RAG", "NLP", "Ollama", "Embeddings", "Context Caching"]'::JSONB, '["Zero Hallucination Target", "Sub-second Retrieval", "Fully Local & Private"]'::JSONB, '["RAG", "NLP", "Arabic AI"]'::JSONB),
    (3, 'telco-churn-prediction', 'Customer Churn Predictor', 'ai', 'PREDICTIVE MODELING', '#a78bfa', 'Telecom churn prediction system utilizing Random Forest and XGBoost with SMOTE balancing.', 'Telecom churn prediction system utilizing Random Forest and XGBoost with SMOTE balancing. Identifies high-risk accounts, quantifies revenue exposure, and outputs risk rankings with interactive feature importance diagnostics.', 'Predictive ML pipeline classifying customer churn risk with 80%+ accuracy and concrete retention recommendations.', 'projects/telco-churn.png', 'https://github.com/mhmd-ebrahim-1/Telecom-Customer-Churn-Prediction', null, true, true, 3, '["Scikit-Learn", "Python", "XGBoost", "SMOTE", "Pandas", "Seaborn"]'::JSONB, '["80%+ Classification Accuracy", "SMOTE Class Balancing", "Actionable Feature Importance"]'::JSONB, '["Machine Learning", "Classification"]'::JSONB),
    (4, 'facial-emotion-detection', 'Real-Time Emotion Recognition', 'ai', 'COMPUTER VISION', '#fb923c', 'Real-time multi-class facial expression detector built with CNNs and OpenCV.', 'Real-time multi-class facial expression detector built with CNNs and OpenCV. Classifies facial micro-expressions with minimal latency across varying lighting and camera angles for human-computer interaction analysis.', 'Deep learning vision model performing 30 FPS facial emotion inference on streaming video feeds.', 'projects/facial-emotion.png', 'https://github.com/mhmd-ebrahim-1/Facial-Emotion-Detection', null, true, true, 4, '["OpenCV", "TensorFlow", "Keras", "CNN", "Python", "Real-Time Video"]'::JSONB, '["30 FPS Real-Time Inference", "7 Discrete Emotion Classes", "Custom CNN Architecture"]'::JSONB, '["Computer Vision", "Deep Learning"]'::JSONB),
    (5, 'netflix-content-strategy', 'Netflix Content Ecosystem Analysis', 'data', 'DATA STRATEGY & EDA', '#f43f5e', 'Data exploration of 8,800+ titles revealing genre saturation and international expansion.', 'Data exploration of 8,800+ titles revealing genre saturation and international expansion. Evaluates release patterns, content ratings, international market adoption, and strategic licensing shifts.', 'Comprehensive catalog intelligence profiling global content investment and regional programming trends.', 'projects/netflix-analytics.png', 'https://github.com/mhmd-ebrahim-1/Netflix-Movies-and-TV-Shows-Clustering', null, false, true, 5, '["Python", "Pandas", "Matplotlib", "Seaborn", "EDA", "Statistical Profiling"]'::JSONB, '["8,800+ Records Analyzed", "International Distribution Mapping", "Genre Saturation Metrics"]'::JSONB, '["Data Analytics", "EDA"]'::JSONB),
    (6, 'big-data-pipeline', 'Batch Data Transformation Pipeline', 'data', 'BIG DATA & DE', '#38bdf8', 'Distributed batch processing pipeline using PySpark, Hadoop HDFS, and Snowflake.', 'Distributed batch processing pipeline using PySpark, Hadoop HDFS, and Snowflake. Implements partition pruning, automated transformation stages, data deduplication, and star-schema loading within Docker containers.', 'Resilient big data transformation engine processing multi-gigabyte datasets with distributed PySpark workers.', 'projects/big-data-pipeline.svg', 'https://github.com/mhmd-ebrahim-1/Big-Data-Processing-Pipeline', null, false, true, 6, '["PySpark", "HDFS", "Airflow", "Snowflake", "Docker", "Python"]'::JSONB, '["Distributed Architecture", "Automated DAG Scheduling", "Zero-Loss Data Loading"]'::JSONB, '["Data Engineering", "PySpark"]'::JSONB),
    (7, 'movie-recommendation', 'Movie Recommendation Engine', 'ai', 'MACHINE LEARNING', '#818cf8', 'Algorithmic recommendation engine implementing regularized Non-negative Matrix Factorization from scratch.', 'Algorithmic recommendation engine implementing regularized Non-negative Matrix Factorization (NMF) with custom Gradient Descent from scratch using Python and NumPy, without depending on high-level ML framework black boxes.', 'Matrix factorization recommender built from first mathematical principles for latent feature extraction.', 'projects/movie-recommendation.svg', 'https://github.com/mhmd-ebrahim-1/MovieRecommendation', null, false, true, 7, '["Python", "NumPy", "NMF", "Gradient Descent", "Linear Algebra"]'::JSONB, '["Pure NumPy Implementation", "Regularized Latent Vectors", "Custom Convergence Optimization"]'::JSONB, '["Machine Learning", "Algorithms"]'::JSONB),
    (8, 'foodmart-analytics', 'FoodMart Retail Analysis', 'data', 'BUSINESS INTELLIGENCE', '#34d399', 'Business intelligence dashboard evaluating retail store performance and purchasing patterns.', 'Business intelligence dashboard evaluating retail store performance, analyzing historical sales trends, product category revenues, and customer purchasing patterns through interactive Power BI reports.', 'Interactive retail intelligence report visualizing customer profitability and multi-store KPIs.', 'projects/foodmart-analytics.png', 'https://github.com/mhmd-ebrahim-1/FoodMart-Retail-Analysis', null, false, true, 8, '["Power BI", "Pandas", "DAX", "Excel", "Data Modeling"]'::JSONB, '["Multi-Store Comparison", "Category Margin Analysis", "DAX Profitability Metrics"]'::JSONB, '["Power BI", "Business Intelligence"]'::JSONB),
    (9, 'cnc-plotter', 'Arduino CNC Plotter', 'dev', 'EMBEDDED SYSTEMS', '#f59e0b', 'Hardware-software prototyping project featuring an Arduino-controlled dual-axis stepper motor plotter.', 'Hardware-software prototyping project featuring an Arduino-controlled dual-axis stepper motor plotter. Interprets standard G-code commands for automated precision vector drawing and educational demonstrations.', 'Precision dual-axis drawing machine interpreting G-code for hardware vector plotting.', 'projects/cnc-plotter.svg', 'https://github.com/mhmd-ebrahim-1/CNC-Plotter', null, false, true, 9, '["Arduino", "C++", "G-code", "Stepper Motors", "Hardware"]'::JSONB, '["Sub-millimeter Precision", "G-code Parsing Engine", "Hardware-Software Integration"]'::JSONB, '["Embedded Systems", "Hardware"]'::JSONB)
ON CONFLICT (id) DO NOTHING;

-- Seed Certificates
INSERT INTO public.certificates (id, slug, title, issuer, issuer_short, date, credential_id, credential_url, cover_image, category, category_label, accent, skills, featured, published, display_order)
VALUES
    (1, 'cert-nti-data', 'Advanced Data Analytics', 'National Telecommunication Institute (NTI)', 'NTI / ITIDA', 'Jun 29 – Jul 24, 2025', 'Student ID: 164771', null, 'certificates/nti-advanced-data-analytics.webp', 'top', 'Certification', '#e31e24', '["Data Analytics", "Python", "SQL", "Machine Learning", "Freelancing"]'::JSONB, true, true, 1),
    (2, 'cert-quantium', 'Data Analytics Job Simulation', 'Quantium / Forage', 'Quantium', 'Dec 25, 2025', '694d3cd139ff7eaad9d3c8e4', null, 'certificates/quantium-data-analytics-simulation.webp', 'top', 'Certification', '#111111', '["Data Analytics", "Customer Analytics", "Experimentation", "Commercial Application"]'::JSONB, true, true, 2),
    (3, 'cert-nvidia-genai', 'NVIDIA DLI Summer Training Program: Generative AI', 'ITI / NVIDIA DLI', 'NVIDIA DLI', 'Nov 16 – Dec 3, 2025', null, null, 'certificates/nvidia-iti-generative-ai.webp', 'top', 'Certification', '#76b900', '["Generative AI", "LLMs", "Prompt Engineering", "RAG", "Python"]'::JSONB, true, true, 3),
    (4, 'cert-nvidia-dl', 'Getting Started with Deep Learning', 'NVIDIA DLI', 'NVIDIA DLI', 'Dec 18, 2025', 'Le-drRAIRdUMwXFUtwcXeQ', null, 'certificates/nvidia-deep-learning.webp', 'top', 'Certification', '#76b900', '["Deep Learning", "Neural Networks", "Computer Vision"]'::JSONB, true, true, 4),
    (5, 'cert-huawei-ai', 'HCIA-AI V3.5 Course', 'Huawei Talent Online', 'Huawei', 'Sep 23, 2024', 'EBG20240923005280', null, 'certificates/huawei-hcia-ai.webp', 'top', 'Certification', '#ea3223', '["AI", "Machine Learning", "Deep Learning", "Huawei ICT"]'::JSONB, true, true, 5),
    (6, 'cert-msft-ai', 'Introduction to AI & Generative AI', 'Microsoft Egypt / MCIT', 'Microsoft', 'Oct 19–21, 2025', null, null, 'certificates/microsoft-ai-generative-ai.webp', 'top', 'Certification', '#0067b8', '["AI Fundamentals", "Generative AI", "Azure AI"]'::JSONB, true, true, 6),
    (7, 'cert-kaggle-ml', 'Intro to Machine Learning', 'Kaggle', 'Kaggle', 'Sep 14, 2025', null, null, 'certificates/kaggle-intro-machine-learning.webp', 'important', 'Certification', '#20beff', '["Machine Learning", "Scikit-Learn", "Model Validation", "Python"]'::JSONB, false, true, 7),
    (8, 'cert-hackerrank-sql', 'SQL (Basic)', 'HackerRank', 'HackerRank', 'Mar 18, 2025', 'DCE4F38589DC', null, 'certificates/hackerrank-sql-basic.webp', 'important', 'Certification', '#00a878', '["SQL", "Relational Databases", "Data Querying"]'::JSONB, false, true, 8),
    (9, 'cert-hackerrank-py', 'Python (Basic)', 'HackerRank', 'HackerRank', 'Mar 18, 2025', '0A9E2E57DEC0', null, 'certificates/hackerrank-python-basic.webp', 'important', 'Certification', '#00a878', '["Python", "Algorithms", "Data Structures"]'::JSONB, false, true, 9),
    (10, 'cert-maharatech-dl', 'Introduction to Deep Learning', 'MaharaTech / ITI', 'MaharaTech', 'Jan 22, 2026', '0Orw5rdCbs', null, 'certificates/maharatech-deep-learning.webp', 'important', 'Certification', '#b51f2b', '["Deep Learning", "Neural Networks", "Optimization"]'::JSONB, false, true, 10),
    (11, 'cert-maharatech-py', 'Python Programming Basics', 'MaharaTech / ITI', 'MaharaTech', 'Sep 18, 2024', 'N5xhBCJbJE', null, 'certificates/maharatech-python-basics.webp', 'important', 'Certification', '#b51f2b', '["Python", "Programming Fundamentals"]'::JSONB, false, true, 11),
    (12, 'cert-itida-gigs', 'ITIDA Gigs — Freelance Training Program', 'ITIDA / eYouth', 'ITIDA', '2025', null, null, 'certificates/itida-gigs-freelance.webp', 'important', 'Certification', '#0085b7', '["Freelancing", "Client Communication", "Project Delivery"]'::JSONB, false, true, 12),
    (13, 'cert-anthropic-claude', 'Claude 101', 'Anthropic', 'Anthropic', '2025', null, null, 'certificates/claude-101.webp', 'important', 'Certification', '#d97757', '["Claude", "Generative AI", "Prompt Design", "AI Fluency"]'::JSONB, false, true, 13),
    (14, 'cert-eyouth-excel', 'Data Analysis Using Excel', 'eYouth Business / IAO', 'eYouth', 'Oct 6, 2025', 'c9d3d632a96e4ba996a87255a1eb0666', null, 'certificates/eyouth-data-analysis-excel.webp', 'important', 'Certification', '#1f6fb2', '["Excel", "Data Analysis", "Spreadsheets", "Business Analytics"]'::JSONB, false, true, 14),
    (15, 'cert-udemy-bootcamp', 'Data Analysis BootCamp', 'Udemy', 'Udemy', 'Nov 29, 2025', 'UC-6b663724-9604-4faa-9046-7fb8d960d087', null, 'certificates/udemy-data-analysis-bootcamp.webp', 'important', 'Certification', '#a435f0', '["Data Analysis", "Python", "Data Cleaning", "Visualization"]'::JSONB, false, true, 15)
ON CONFLICT (id) DO NOTHING;
