import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PhoneCall, Mail, MessageSquare, Linkedin, Github, Twitter, Instagram, Check } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function ContactManager() {
  const { profile, setProfile, siteSettings, setSiteSettings, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [formData, setFormData] = useState({
    email: profile.email || 'mhmd_ebrahim_1@outlook.com',
    whatsapp: profile.whatsapp || 'https://wa.me/201093556456?text=Hello%20Mohamed%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project%20%2F%20opportunity.',
    whatsappPhone: siteSettings.whatsappNumber || '201093556456',
    linkedin: profile.linkedin || 'https://www.linkedin.com/in/mhmd-ebrahim1/',
    github: profile.github || 'https://github.com/mhmd-ebrahim-1',
    twitter: profile.twitter || 'https://x.com/mhmd_ebrahim_1',
    instagram: profile.instagram || 'https://www.instagram.com/mhmd_ebrahim_1',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('site_settings').update({
          contact_email: formData.email,
          whatsapp_number: formData.whatsappPhone,
        }).eq('id', 'global')

        // Update social links
        const socialItems = [
          { id: 'linkedin', platform: 'LinkedIn', label: 'LinkedIn', url: formData.linkedin },
          { id: 'github', platform: 'GitHub', label: 'GitHub', url: formData.github },
          { id: 'twitter', platform: 'Twitter', label: 'X (Twitter)', url: formData.twitter },
          { id: 'instagram', platform: 'Instagram', label: 'Instagram', url: formData.instagram },
        ]

        for (const item of socialItems) {
          await supabase.from('social_links').upsert(item, { onConflict: 'id' })
        }
      }

      setProfile((prev) => ({
        ...prev,
        email: formData.email,
        whatsapp: formData.whatsapp,
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
        instagram: formData.instagram,
      }))

      setSiteSettings((prev) => ({
        ...prev,
        contactEmail: formData.email,
        whatsappNumber: formData.whatsappPhone,
      }))

      addToast('Contact channels updated successfully', 'success', 'Saved')
      logAudit('UPDATE', 'contact', 'Contact and social links')
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to update contact info', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Contact &amp; Social Channels</h2>
        <p className="font-mono text-xs text-white/50 mt-1">Manage official communication channels and external profile links</p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-6">
        {/* Direct Channels */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Mail size={16} className="text-[#00f5d4]" /> Direct Contact Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
                Primary Contact Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
                WhatsApp Phone (Digits with Country Code)
              </label>
              <input
                type="text"
                value={formData.whatsappPhone}
                onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                placeholder="201093556456"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Full WhatsApp URL with Pre-filled Message
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        {/* Social Profiles */}
        <div className="space-y-4 pt-6 border-t border-white/[0.08]">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Linkedin size={16} className="text-[#0ea5e9]" /> Professional Networks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
                X (Twitter) Profile URL
              </label>
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-6 py-2.5 font-mono text-xs font-semibold flex items-center gap-2"
          >
            {saving ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
            Save Contact Settings
          </button>
        </div>
      </form>
    </div>
  )
}
