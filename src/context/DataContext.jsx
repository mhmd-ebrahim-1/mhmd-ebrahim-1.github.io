import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  PROFILE as DEFAULT_PROFILE,
  PROJECTS as DEFAULT_PROJECTS,
  CERTIFICATES as DEFAULT_CERTIFICATES,
  SKILLS as DEFAULT_SKILLS,
  TOOLS as DEFAULT_TOOLS,
  SERVICES as DEFAULT_SERVICES,
  CREDENTIALS_STRIP as DEFAULT_CREDENTIALS_STRIP,
} from '../data'

const DataContext = createContext(null)

const LOCAL_STORAGE_CACHE_KEY = 'portfolio_cms_cache_v1'

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [certificates, setCertificates] = useState(DEFAULT_CERTIFICATES)
  const [experience, setExperience] = useState([])
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [tools, setTools] = useState(DEFAULT_TOOLS)
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: 'Mohamed Ebrahim | Data Analyst & ML Engineer',
    contactEmail: 'mhmd_ebrahim_1@outlook.com',
    whatsappNumber: '201093556456',
    cvUrl: '/Mohamed-Ebrahim-CV.pdf',
    maintenanceMode: false,
    gaMeasurementId: '',
  })
  const [socialLinks, setSocialLinks] = useState([])
  const [credentialsStrip, setCredentialsStrip] = useState(DEFAULT_CREDENTIALS_STRIP)

  // Load from Supabase with Fallback
  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      setIsLive(false)
      return
    }

    try {
      // 1. Fetch Site Settings
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .single()

      if (settingsData) {
        setSiteSettings({
          siteTitle: settingsData.site_title || siteSettings.siteTitle,
          contactEmail: settingsData.contact_email || siteSettings.contactEmail,
          whatsappNumber: settingsData.whatsapp_number || siteSettings.whatsappNumber,
          cvUrl: settingsData.cv_url || siteSettings.cvUrl,
          maintenanceMode: Boolean(settingsData.maintenance_mode),
          gaMeasurementId: settingsData.ga_measurement_id || '',
        })
      }

      // 2. Fetch Hero & About to build live Profile
      const [{ data: heroData }, { data: aboutData }] = await Promise.all([
        supabase.from('hero').select('*').eq('id', 'main').single(),
        supabase.from('about').select('*').eq('id', 'main').single(),
      ])

      if (heroData || aboutData) {
        setProfile((prev) => ({
          ...prev,
          name: heroData?.name || prev.name,
          fullName: heroData?.full_name || prev.fullName,
          title: heroData?.title || prev.title,
          roles: Array.isArray(heroData?.roles) ? heroData.roles : prev.roles,
          status: heroData?.status || prev.status,
          bio: heroData?.bio || prev.bio,
          bio2: heroData?.bio2 || prev.bio2,
          location: heroData?.location || aboutData?.location || prev.location,
          university: aboutData?.university || prev.university,
          degree: aboutData?.degree || prev.degree,
          graduationYear: aboutData?.graduation_year || prev.graduationYear,
        }))
      }

      // 3. Fetch Projects
      const { data: dbProjects, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true })

      if (!projErr && dbProjects && dbProjects.length > 0) {
        const mapped = dbProjects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          category: p.category,
          categoryLabel: p.category_label || p.category,
          accent: p.accent || '#00f5d4',
          shortDesc: p.short_desc,
          fullDesc: p.full_desc,
          valueProp: p.value_prop,
          coverImage: p.cover_image,
          github: p.github,
          live: p.live,
          featured: Boolean(p.featured),
          published: Boolean(p.published),
          displayOrder: p.display_order ?? 0,
          tech: Array.isArray(p.tech) ? p.tech : [],
          metrics: Array.isArray(p.metrics) ? p.metrics : [],
          tags: Array.isArray(p.tags) ? p.tags : [],
          gallery: Array.isArray(p.gallery) ? p.gallery : [],
          caseStudy: p.case_study || null,
        }))
        setProjects(mapped)
      }

      // 4. Fetch Certificates
      const { data: dbCerts, error: certErr } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true })

      if (!certErr && dbCerts && dbCerts.length > 0) {
        const mappedCerts = dbCerts.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          issuer: c.issuer,
          issuerShort: c.issuer_short || c.issuer,
          date: c.date,
          credentialId: c.credential_id,
          credentialUrl: c.credential_url,
          coverImage: c.cover_image,
          category: c.category || 'all',
          categoryLabel: c.category_label || 'Certification',
          accent: c.accent || '#00f5d4',
          skills: Array.isArray(c.skills) ? c.skills : [],
          featured: Boolean(c.featured),
          published: Boolean(c.published),
          displayOrder: c.display_order ?? 0,
        }))
        setCertificates(mappedCerts)
      }

      // 5. Fetch Experience
      const { data: dbExp } = await supabase
        .from('experience')
        .select('*')
        .order('display_order', { ascending: true })

      if (dbExp && dbExp.length > 0) {
        setExperience(dbExp)
      }

      // 6. Fetch Services
      const { data: dbServices } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true })

      if (dbServices && dbServices.length > 0) {
        const mappedServ = dbServices.map((s) => ({
          id: s.id,
          title: s.title,
          shortDesc: s.short_desc,
          fullDesc: s.full_desc,
          icon: s.icon || 'Database',
          accent: s.accent || '#00f5d4',
          tech: Array.isArray(s.tech) ? s.tech : [],
          deliverables: Array.isArray(s.deliverables) ? s.deliverables : [],
          cta: s.cta || 'Inquire Service',
          emailSubject: s.email_subject || 'Service Inquiry',
          displayOrder: s.display_order ?? 0,
          published: Boolean(s.published),
        }))
        setServices(mappedServ)
      }

      // 7. Fetch Social Links
      const { data: dbLinks } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true })

      if (dbLinks && dbLinks.length > 0) {
        setSocialLinks(dbLinks)
      }

      setIsLive(true)
    } catch (err) {
      console.warn('DataContext: Falling back to local static defaults', err)
      setIsLive(false)
    } finally {
      setLoading(false)
    }
  }, [siteSettings.siteTitle, siteSettings.contactEmail, siteSettings.whatsappNumber, siteSettings.cvUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Mutation helpers for Admin Dashboard
  const logAudit = async (action, entityType, entityName = '', details = null) => {
    if (!supabase) return
    try {
      const { data: authData } = await supabase.auth.getUser()
      await supabase.from('audit_logs').insert([
        {
          user_email: authData?.user?.email || 'admin',
          action,
          entity_type: entityType,
          entity_name: entityName,
          details,
        },
      ])
    } catch (e) {
      console.error('Failed to log audit:', e)
    }
  }

  const submitContactMessage = async (name, email, subject, message) => {
    if (!supabase) {
      // Return success mock if not configured
      return { success: true, offline: true }
    }
    const { data, error } = await supabase.from('contact_messages').insert([
      { name, email, subject, message },
    ])
    if (error) throw error
    return { success: true, data }
  }

  const recordPageView = async (path) => {
    if (!supabase) return
    try {
      await supabase.from('page_views').insert([
        {
          path,
          referrer: document.referrer || '',
        },
      ])
    } catch {
      // Silent fail
    }
  }

  const value = {
    loading,
    isLive,
    profile,
    setProfile,
    projects,
    setProjects,
    certificates,
    setCertificates,
    experience,
    setExperience,
    skills,
    setSkills,
    tools,
    setTools,
    services,
    setServices,
    siteSettings,
    setSiteSettings,
    socialLinks,
    setSocialLinks,
    credentialsStrip,
    setCredentialsStrip,
    refreshData: fetchData,
    logAudit,
    submitContactMessage,
    recordPageView,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
