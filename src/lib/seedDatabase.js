import { supabase, isSupabaseConfigured } from './supabase'
import {
  PROFILE,
  PROJECTS,
  CERTIFICATES,
  EXPERIENCE,
  SKILLS,
  SERVICES,
} from '../data'

/**
 * Idempotently seeds initial portfolio data into Supabase.
 * Only inserts records if they don't already exist (ON CONFLICT DO NOTHING / ignoreDuplicates).
 * Never overwrites or resets user edits.
 */
export async function seedInitialData() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured')
  }

  const results = {
    site_settings: 0,
    hero: 0,
    about: 0,
    social_links: 0,
    services: 0,
    skills: 0,
    experience: 0,
    projects: 0,
    certificates: 0,
  }

  // 1. Site Settings
  const { error: settingsErr } = await supabase.from('site_settings').upsert({
    id: 'global',
    site_title: 'Mohamed Ebrahim | Data Analyst & ML Engineer',
    contact_email: PROFILE.email || 'mhmd_ebrahim_1@outlook.com',
    whatsapp_number: '201093556456',
    cv_url: '/Mohamed-Ebrahim-CV.pdf',
    maintenance_mode: false,
  }, { onConflict: 'id', ignoreDuplicates: true })
  if (settingsErr) console.warn('Seed site_settings warning:', settingsErr)
  else results.site_settings++

  // 2. Hero Content
  const { error: heroErr } = await supabase.from('hero').upsert({
    id: 'main',
    name: PROFILE.name || 'Mohamed Ebrahim',
    full_name: PROFILE.fullName || 'Mohamed Ebrahim Hamed',
    title: PROFILE.title || 'Data Analyst & ML Engineer',
    roles: PROFILE.roles || [
      'Data Analyst',
      'Machine Learning Engineer',
      'AI & RAG Developer',
      'Data Engineering Practitioner',
    ],
    status: PROFILE.status || 'Open to internships & freelance opportunities',
    location: PROFILE.location || 'Mansoura, Egypt',
    bio: PROFILE.bio || 'Artificial Intelligence undergraduate at Kafr El-Sheikh University specializing in Data Analytics, Machine Learning, and practical AI systems.',
    bio2: PROFILE.bio2 || 'Focused on bridging raw data with actionable business insights and production-grade intelligent workflows using Python, SQL, Power BI, PySpark, and modern AI architectures.',
    avatar_image: '/profile-home-about.webp',
  }, { onConflict: 'id', ignoreDuplicates: true })
  if (heroErr) console.warn('Seed hero warning:', heroErr)
  else results.hero++

  // 3. About Content
  const { error: aboutErr } = await supabase.from('about').upsert({
    id: 'main',
    university: PROFILE.university || 'Kafr El-Sheikh University',
    degree: PROFILE.degree || 'B.Sc. Artificial Intelligence',
    graduation_year: PROFILE.graduationYear || '2023 – 2027',
    location: PROFILE.location || 'Mansoura, Egypt',
    headline: 'Turning Data Into Intelligence',
  }, { onConflict: 'id', ignoreDuplicates: true })
  if (aboutErr) console.warn('Seed about warning:', aboutErr)
  else results.about++

  // 4. Social Links
  const socialSeeds = [
    { id: 'linkedin', platform: 'LinkedIn', label: 'LinkedIn', url: PROFILE.linkedin || 'https://www.linkedin.com/in/mhmd-ebrahim1/', icon: 'Linkedin', color: '#0ea5e9', active: true, display_order: 1 },
    { id: 'github', platform: 'GitHub', label: 'GitHub', url: PROFILE.github || 'https://github.com/mhmd-ebrahim-1', icon: 'Github', color: '#ffffff', active: true, display_order: 2 },
    { id: 'whatsapp', platform: 'WhatsApp', label: 'WhatsApp', url: PROFILE.whatsapp || 'https://wa.me/201093556456', icon: 'WhatsAppIcon', color: '#00f5d4', active: true, display_order: 3 },
    { id: 'twitter', platform: 'Twitter', label: 'X (Twitter)', url: PROFILE.twitter || 'https://x.com/mhmd_ebrahim_1', icon: 'Twitter', color: '#38bdf8', active: true, display_order: 4 },
    { id: 'instagram', platform: 'Instagram', label: 'Instagram', url: PROFILE.instagram || 'https://www.instagram.com/mhmd_ebrahim_1', icon: 'Instagram', color: '#f43f5e', active: true, display_order: 5 },
  ]
  const { error: socialErr } = await supabase.from('social_links').upsert(socialSeeds, { onConflict: 'id', ignoreDuplicates: true })
  if (socialErr) console.warn('Seed social_links warning:', socialErr)
  else results.social_links = socialSeeds.length

  // 5. Services
  const serviceSeeds = SERVICES.map((s, idx) => ({
    id: s.id,
    title: s.title,
    short_desc: s.shortDesc,
    icon: s.icon || 'Database',
    accent: '#00f5d4',
    tech: s.tech || [],
    deliverables: s.deliverables || [],
    cta: s.cta || 'Inquire Service',
    email_subject: s.emailSubject || 'Service Inquiry',
    display_order: idx + 1,
    published: true,
  }))
  const { error: servErr } = await supabase.from('services').upsert(serviceSeeds, { onConflict: 'id', ignoreDuplicates: true })
  if (servErr) console.warn('Seed services warning:', servErr)
  else results.services = serviceSeeds.length

  // 6. Skills
  const skillSeeds = Object.entries(SKILLS).map(([key, item], idx) => ({
    domain_key: key,
    domain_title: item.title,
    domain_description: item.description,
    accent: '#00f5d4',
    skills: item.skills || [],
    display_order: idx + 1,
    published: true,
  }))
  const { error: skillErr } = await supabase.from('skills').upsert(skillSeeds, { onConflict: 'domain_key', ignoreDuplicates: true })
  if (skillErr) console.warn('Seed skills warning:', skillErr)
  else results.skills = skillSeeds.length

  // 7. Experience
  const expSeeds = EXPERIENCE.map((e, idx) => ({
    id: e.id,
    role: e.title,
    organization: e.org,
    location: 'Egypt',
    start_date: e.period ? e.period.split(' – ')[0] : '2025',
    end_date: e.period ? e.period.split(' – ')[1] : 'Present',
    current_position: Boolean(e.current),
    description: e.description || '',
    technologies: e.skills || [],
    display_order: idx + 1,
    published: true,
  }))
  const { error: expErr } = await supabase.from('experience').upsert(expSeeds, { onConflict: 'id', ignoreDuplicates: true })
  if (expErr) console.warn('Seed experience warning:', expErr)
  else results.experience = expSeeds.length

  // 8. Projects
  const projSeeds = PROJECTS.map((p, idx) => ({
    id: p.id,
    slug: p.slug || 'project-' + p.id,
    title: p.title,
    category: p.category || 'data',
    category_label: p.categoryLabel || 'DATA',
    accent: p.accent || '#00f5d4',
    short_desc: p.description || '',
    value_prop: p.valueProp || '',
    cover_image: p.coverImage || '',
    github: p.github || '',
    live: p.live || null,
    featured: Boolean(p.featured),
    published: true,
    display_order: idx + 1,
    tech: p.tech || [],
    tags: p.tech || [],
    case_study: p.caseStudy || {},
  }))
  const { error: projErr } = await supabase.from('projects').upsert(projSeeds, { onConflict: 'id', ignoreDuplicates: true })
  if (projErr) console.warn('Seed projects warning:', projErr)
  else results.projects = projSeeds.length

  // 9. Certificates
  const certSeeds = CERTIFICATES.map((c, idx) => ({
    id: c.id,
    slug: 'cert-' + c.id,
    title: c.name,
    issuer: c.issuer,
    issuer_short: c.issuer,
    date: c.date || '',
    credential_id: c.credentialId || null,
    credential_url: null,
    cover_image: c.image || '',
    category: c.tier || 'top',
    category_label: 'Certification',
    accent: c.color || '#00f5d4',
    skills: c.skills || [],
    featured: c.tier === 'top',
    published: true,
    display_order: idx + 1,
  }))
  const { error: certErr } = await supabase.from('certificates').upsert(certSeeds, { onConflict: 'id', ignoreDuplicates: true })
  if (certErr) console.warn('Seed certificates warning:', certErr)
  else results.certificates = certSeeds.length

  return results
}