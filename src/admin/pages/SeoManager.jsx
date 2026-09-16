import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe2, Check, Search, Code2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function SeoManager() {
  const { siteSettings, setSiteSettings, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [formData, setFormData] = useState({
    siteTitle: siteSettings?.siteTitle || 'Mohamed Ebrahim | Data Analyst & ML Engineer',
    siteDescription: 'Portfolio of Mohamed Ebrahim — Data Analytics, Machine Learning, Generative AI, and Data Engineering.',
    canonicalUrl: 'https://mhmd-ebrahim-1.github.io/',
    ogImage: 'https://mhmd-ebrahim-1.github.io/profile.jpg',
    twitterHandle: '@mhmd_ebrahim_1',
    keywords: 'Mohamed Ebrahim, Data Analyst, ML Engineer, Power BI, Python, SQL, RAG, Egypt',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from('site_settings').update({
          site_title: formData.siteTitle,
          site_description: formData.siteDescription,
          canonical_url: formData.canonicalUrl,
          og_image: formData.ogImage,
          twitter_handle: formData.twitterHandle,
        }).eq('id', 'global')
        if (error) throw error
      }

      setSiteSettings((prev) => ({
        ...prev,
        siteTitle: formData.siteTitle,
      }))

      addToast('SEO & Meta settings saved', 'success', 'Saved')
      logAudit('UPDATE', 'seo', 'SEO Meta configuration')
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">SEO &amp; Metadata</h2>
        <p className="font-mono text-xs text-white/50 mt-1">Manage search engine optimization, Open Graph preview cards, and schema tags</p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-5">
        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
            Website Title Tag *
          </label>
          <input
            type="text"
            required
            value={formData.siteTitle}
            onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
            Meta Description *
          </label>
          <textarea
            rows={3}
            required
            value={formData.siteDescription}
            onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white leading-relaxed outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Canonical URL
            </label>
            <input
              type="url"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
              Twitter Handle
            </label>
            <input
              type="text"
              value={formData.twitterHandle}
              onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
            Open Graph Share Image URL
          </label>
          <input
            type="text"
            value={formData.ogImage}
            onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
            Search Keywords (comma separated)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
          />
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-6 py-2.5 font-mono text-xs font-semibold flex items-center gap-2"
          >
            {saving ? <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
            Save SEO Metadata
          </button>
        </div>
      </form>
    </div>
  )
}
