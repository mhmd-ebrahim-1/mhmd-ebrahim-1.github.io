import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Check, GraduationCap, MapPin, Sparkles } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function AboutManager() {
  const { profile, setProfile, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [formData, setFormData] = useState({
    bio: profile?.bio || '',
    bio2: profile?.bio2 || '',
    location: profile?.location || 'Mansoura, Egypt',
    university: profile?.university || 'Kafr El-Sheikh University',
    degree: profile?.degree || 'B.Sc. Artificial Intelligence',
    graduationYear: profile?.graduationYear || '2023 – 2027',
    status: profile?.status || 'Open to internships & freelance opportunities',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('about').upsert({
          id: 'main',
          location: formData.location,
          university: formData.university,
          degree: formData.degree,
          graduation_year: formData.graduationYear,
        })

        await supabase.from('hero').update({
          bio: formData.bio,
          bio2: formData.bio2,
          location: formData.location,
          status: formData.status,
        }).eq('id', 'main')
      }

      setProfile((prev) => ({
        ...prev,
        ...formData,
      }))

      addToast('About information updated successfully', 'success', 'Saved')
      logAudit('UPDATE', 'about', 'About section & education')
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to update About section', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">About &amp; Biography</h2>
        <p className="font-mono text-xs text-white/50 mt-1">Manage professional narrative, background, and academic details</p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-6">
        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-2">
            Primary Biography (Paragraph 1) *
          </label>
          <textarea
            rows={4}
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-xs sm:text-sm text-white focus:border-[#00f5d4]/50 outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-2">
            Secondary Biography (Paragraph 2)
          </label>
          <textarea
            rows={3}
            value={formData.bio2}
            onChange={(e) => setFormData({ ...formData, bio2: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-xs sm:text-sm text-white focus:border-[#00f5d4]/50 outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              University / Institution
            </label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Degree &amp; Major
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Availability Status
            </label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-6 py-2.5 font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#00f5d4]/10"
          >
            {saving ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
