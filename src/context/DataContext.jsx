import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  PROFILE as DEFAULT_PROFILE,
  PROJECTS as DEFAULT_PROJECTS,
  CERTIFICATES as DEFAULT_CERTIFICATES,
  EXPERIENCE as DEFAULT_EXPERIENCE,
  SKILLS as DEFAULT_SKILLS,
  TOOLS as DEFAULT_TOOLS,
  SERVICES as DEFAULT_SERVICES,
  CREDENTIALS_STRIP as DEFAULT_CREDENTIALS_STRIP,
} from '../data'

const DEFAULT_SETTINGS = {
  siteTitle: 'Mohamed Ebrahim | Data Analyst & ML Engineer',
  contactEmail: 'mhmd_ebrahim_1@outlook.com',
  whatsappNumber: '201093556456',
  cvUrl: '/Mohamed-Ebrahim-CV.pdf',
  maintenanceMode: false,
  gaMeasurementId: '',
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [certificates, setCertificates] = useState(DEFAULT_CERTIFICATES)
  const [experience, setExperience] = useState(DEFAULT_EXPERIENCE)
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [tools, setTools] = useState(DEFAULT_TOOLS)
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS)
  const [socialLinks, setSocialLinks] = useState([])
  const [credentialsStrip, setCredentialsStrip] = useState(DEFAULT_CREDENTIALS_STRIP)

  const isFetchingRef = useRef(false)

  // Load from Supabase with Independent Query Fallbacks
  const fetchData = useCallback(async (force = false) => {
    if (isFetchingRef.current && !force) return
    isFetchingRef.current = true

    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      setIsLive(false)
      isFetchingRef.current = false
      return
    }

    let anySuccessful = false

    try {
      // 1. Fetch Site Settings
      try {
        const { data: settingsData, error: settingsErr } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global')
          .maybeSingle()

        if (!settingsErr && settingsData) {
          setSiteSettings((prev) => ({
            ...prev,
            siteTitle: settingsData.site_title || prev.siteTitle || DEFAULT_SETTINGS.siteTitle,
            contactEmail: settingsData.contact_email || prev.contactEmail || DEFAULT_SETTINGS.contactEmail,
            whatsappNumber: settingsData.whatsapp_number || prev.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
            cvUrl: settingsData.cv_url || prev.cvUrl || DEFAULT_SETTINGS.cvUrl,
            maintenanceMode: Boolean(settingsData.maintenance_mode),
            gaMeasurementId: settingsData.ga_measurement_id || prev.gaMeasurementId || '',
          }))
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: site_settings fetch error (using fallback)', err)
      }

      // 2. Fetch Hero & About for Profile
      try {
        const [{ data: heroData }, { data: aboutData }] = await Promise.all([
          supabase.from('hero').select('*').eq('id', 'main').maybeSingle(),
          supabase.from('about').select('*').eq('id', 'main').maybeSingle(),
        ])

        if (heroData || aboutData) {
          setProfile((prev) => ({
            ...prev,
            name: heroData?.name || prev.name || DEFAULT_PROFILE.name,
            fullName: heroData?.full_name || prev.fullName || DEFAULT_PROFILE.fullName,
            title: heroData?.title || prev.title || DEFAULT_PROFILE.title,
            roles: Array.isArray(heroData?.roles) && heroData.roles.length > 0 ? heroData.roles : (prev.roles || DEFAULT_PROFILE.roles),
            status: heroData?.status || prev.status || DEFAULT_PROFILE.status,
            bio: heroData?.bio || prev.bio || DEFAULT_PROFILE.bio,
            bio2: heroData?.bio2 || prev.bio2 || DEFAULT_PROFILE.bio2,
            location: heroData?.location || aboutData?.location || prev.location || DEFAULT_PROFILE.location,
            university: aboutData?.university || prev.university || DEFAULT_PROFILE.university,
            degree: aboutData?.degree || prev.degree || DEFAULT_PROFILE.degree,
            graduationYear: aboutData?.graduation_year || prev.graduationYear || DEFAULT_PROFILE.graduationYear,
            avatarImage: heroData?.avatar_image || prev.avatarImage || '/profile-home-about.webp',
          }))
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: hero/about fetch error (using fallback)', err)
      }

      // 3. Fetch Projects
      try {
        const { data: dbProjects, error: projErr } = await supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true })

        if (!projErr && Array.isArray(dbProjects)) {
          const mapped = dbProjects.map((p) => ({
            id: p.id,
            slug: p.slug || `project-${p.id}`,
            title: p.title || 'Untitled Project',
            category: p.category || 'data_analytics',
            categoryLabel: p.category_label || p.category || 'Data Analytics',
            accent: p.accent || '#00f5d4',
            shortDesc: p.short_desc || p.description || '',
            fullDesc: p.full_desc || '',
            valueProp: p.value_prop || '',
            coverImage: p.cover_image || '',
            github: p.github || '',
            live: p.live || '',
            featured: Boolean(p.featured),
            published: p.published !== false,
            displayOrder: p.display_order ?? 0,
            tech: Array.isArray(p.tech) ? p.tech : [],
            metrics: Array.isArray(p.metrics) ? p.metrics : [],
            tags: Array.isArray(p.tags) ? p.tags : [],
            gallery: Array.isArray(p.gallery) ? p.gallery : [],
            caseStudy: p.case_study || null,
          }))
          setProjects(mapped)
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: projects fetch error (using fallback)', err)
      }

      // 4. Fetch Certificates
      try {
        const { data: dbCerts, error: certErr } = await supabase
          .from('certificates')
          .select('*')
          .order('display_order', { ascending: true })

        if (!certErr && Array.isArray(dbCerts)) {
          const mappedCerts = dbCerts.map((c) => ({
            id: c.id,
            slug: c.slug || `cert-${c.id}`,
            name: c.title || c.name || 'Certification',
            title: c.title || c.name || 'Certification',
            issuer: c.issuer || '',
            issuerShort: c.issuer_short || c.issuer || '',
            date: c.date || '',
            credentialId: c.credential_id || '',
            credentialUrl: c.credential_url || '',
            image: c.cover_image || c.image || '',
            coverImage: c.cover_image || c.image || '',
            category: c.category || 'top',
            tier: c.category || 'top',
            categoryLabel: c.category_label || 'Certification',
            color: c.accent || '#00f5d4',
            accent: c.accent || '#00f5d4',
            skills: Array.isArray(c.skills) ? c.skills : [],
            featured: Boolean(c.featured),
            published: c.published !== false,
            displayOrder: c.display_order ?? 0,
          }))
          setCertificates(mappedCerts)
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: certificates fetch error (using fallback)', err)
      }

      // 5. Fetch Experience
      try {
        const { data: dbExp, error: expErr } = await supabase
          .from('experience')
          .select('*')
          .order('display_order', { ascending: true })

        if (!expErr && Array.isArray(dbExp)) {
          const mappedExp = dbExp.map((e) => ({
            id: e.id,
            role: e.role,
            title: e.role,
            organization: e.organization,
            company: e.organization,
            location: e.location,
            startDate: e.start_date,
            endDate: e.end_date,
            period: `${e.start_date || ''} – ${e.end_date || (e.current_position ? 'Present' : '')}`,
            current: Boolean(e.current_position),
            currentPosition: Boolean(e.current_position),
            description: e.description || '',
            technologies: Array.isArray(e.technologies) ? e.technologies : [],
            highlights: Array.isArray(e.technologies) ? e.technologies : [],
            displayOrder: e.display_order ?? 0,
            published: e.published !== false,
          }))
          setExperience(mappedExp)
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: experience fetch error (using fallback)', err)
      }

      // 6. Fetch Services
      try {
        const { data: dbServices, error: servErr } = await supabase
          .from('services')
          .select('*')
          .order('display_order', { ascending: true })

        if (!servErr && Array.isArray(dbServices)) {
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
            published: s.published !== false,
          }))
          setServices(mappedServ)
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: services fetch error (using fallback)', err)
      }

      // 7. Fetch Skills Matrix
      try {
        const { data: dbSkills, error: skillsErr } = await supabase
          .from('skills')
          .select('*')
          .order('display_order', { ascending: true })

        if (!skillsErr && Array.isArray(dbSkills) && dbSkills.length > 0) {
          const mappedSkills = { ...DEFAULT_SKILLS }
          dbSkills.forEach((row) => {
            if (row.domain_key) {
              mappedSkills[row.domain_key] = {
                title: row.domain_title || DEFAULT_SKILLS[row.domain_key]?.title || row.domain_key,
                description: row.domain_description || DEFAULT_SKILLS[row.domain_key]?.description || '',
                skills: Array.isArray(row.skills) ? row.skills : (DEFAULT_SKILLS[row.domain_key]?.skills || []),
              }
            }
          })
          setSkills(mappedSkills)
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: skills fetch error (using fallback)', err)
      }

      // 8. Fetch Social Links
      try {
        const { data: dbLinks, error: linksErr } = await supabase
          .from('social_links')
          .select('*')
          .order('display_order', { ascending: true })

        if (!linksErr && Array.isArray(dbLinks)) {
          setSocialLinks(dbLinks)
          anySuccessful = true
        }
      } catch (err) {
        console.warn('DataContext: social_links fetch error (using fallback)', err)
      }

      if (anySuccessful) {
        setIsLive(true)
      }
    } catch (globalErr) {
      console.warn('DataContext: Unexpected error in fetchData, retaining static defaults', globalErr)
      setIsLive(false)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, []) // Stable empty dependency array prevents infinite re-fetching loop

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
      console.warn('Failed to log audit:', e)
    }
  }

  const submitContactMessage = async (name, email, subject, message) => {
    if (!supabase) {
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
    refreshData: () => fetchData(true),
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
