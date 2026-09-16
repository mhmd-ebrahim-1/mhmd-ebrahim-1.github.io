import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Check, Sparkles, User, Image as ImageIcon } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import ImageUploader from '../components/ImageUploader'

export default function HeroManager() {
  const { profile, setProfile, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [formData, setFormData] = useState({
    name: profile?.name || 'Mohamed Ebrahim',
    fullName: profile?.fullName || 'Mohamed Ebrahim Hamed',
    title: profile?.title || 'Data Analyst & ML Engineer',
    rolesInput: profile?.roles ? profile.roles.join(', ') : 'Data Analyst, Machine Learning Engineer, AI & RAG Developer, Data Engineering Practitioner',
    status: profile?.status || 'Open to internships & freelance opportunities',
    location: profile?.location || 'Mansoura, Egypt',
    avatarImage: '/profile-home-about.webp',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const rolesArray = formData.rolesInput
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)

    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('hero').upsert({
          id: 'main',
          name: formData.name,
          full_name: formData.fullName,
          title: formData.title,
          roles: rolesArray,
          status: formData.status,
          location: formData.location,
          avatar_image: formData.avatarImage,
        })
      }

      setProfile((prev) => ({
        ...prev,
        name: formData.name,
        fullName: formData.fullName,
        title: formData.title,
        roles: rolesArray,
        status: formData.status,
        location: formData.location,
      }))

      addToast('Hero section updated successfully', 'success', 'Saved')
      logAudit('UPDATE', 'hero', 'Hero & Title content')
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to update hero', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Hero Section</h2>
        <p className="font-mono text-xs text-white/50 mt-1">Manage main headlines, rotating roles, and hero presentation</p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Full Legal / Profile Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
            Primary Professional Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Data Analyst &amp; ML Engineer"
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
            Rotating Roles / Specialties (comma separated)
          </label>
          <input
            type="text"
            value={formData.rolesInput}
            onChange={(e) => setFormData({ ...formData, rolesInput: e.target.value })}
            placeholder="Data Analyst, ML Engineer, AI &amp; RAG Developer"
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Availability Status Indicator
            </label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Location Badge
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <ImageUploader
          bucket="media"
          folder="profile"
          value={formData.avatarImage}
          onChange={(url) => setFormData({ ...formData, avatarImage: url })}
          label="Hero Portrait Cutout"
        />

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-6 py-2.5 font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#00f5d4]/10"
          >
            {saving ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
            Save Hero Configuration
          </button>
        </div>
      </form>
    </div>
  )
}
