import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3, Eye, TrendingUp, Globe2, ShieldCheck, Check, Info } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function AnalyticsManager() {
  const { siteSettings, setSiteSettings, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [gaId, setGaId] = useState(siteSettings?.gaMeasurementId || '')
  const [pageViews, setPageViews] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('page_views')
      .select('path, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) setPageViews(data)
        setLoading(false)
      })
  }, [])

  const handleSaveGa = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from('site_settings').update({
          ga_measurement_id: gaId,
        }).eq('id', 'global')
        if (error) throw error
      }

      setSiteSettings((prev) => ({
        ...prev,
        gaMeasurementId: gaId,
      }))

      addToast('Google Analytics configuration saved', 'success', 'Saved')
      logAudit('UPDATE', 'analytics', `GA ID: ${gaId}`)
    } catch (err) {
      console.error(err)
      addToast('Failed to save GA ID', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Aggregate page views by path
  const pathCounts = pageViews.reduce((acc, curr) => {
    acc[curr.path] = (acc[curr.path] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Analytics &amp; Visitors</h2>
        <p className="font-mono text-xs text-white/50 mt-1">Direct privacy-conscious traffic insights and Google Analytics integration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GA4 Setup Left */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSaveGa} className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-[#00f5d4] border border-cyan-500/30 flex items-center justify-center">
                <Globe2 size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Google Analytics 4</h3>
                <p className="font-mono text-[11px] text-white/50">Optional live visitor tracking</p>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-2">
                GA4 Measurement ID
              </label>
              <input
                type="text"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder="e.g. G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none focus:border-[#00f5d4]/50"
              />
              <p className="font-mono text-[10px] text-white/40 mt-1.5 leading-relaxed">
                Enter your Google Analytics 4 Measurement ID from your Google Analytics dashboard.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-5 py-2.5 text-xs font-mono font-semibold flex items-center gap-2"
              >
                {saving ? <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Check size={14} />}
                Save Analytics Config
              </button>
            </div>
          </form>

          <div className="p-6 rounded-3xl glass border border-white/[0.08] space-y-3">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Info size={16} className="text-[#0ea5e9]" /> Privacy Notice
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Direct page views are recorded anonymously without collecting personal identifiable information or intrusive cookies.
            </p>
          </div>
        </div>

        {/* Path Breakdown Right */}
        <div className="lg:col-span-6">
          <div className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-5">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <BarChart3 size={18} className="text-[#00f5d4]" /> Top Pages by Traffic
            </h3>

            <div className="space-y-3">
              {Object.keys(pathCounts).length > 0 ? (
                Object.entries(pathCounts).map(([path, count]) => (
                  <div
                    key={path}
                    className="flex items-center justify-between p-3.5 rounded-xl glass border border-white/5 font-mono text-xs"
                  >
                    <span className="text-[#00f5d4]">{path}</span>
                    <span className="text-white font-bold">{count} views</span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="font-mono text-xs text-white/40">Page view breakdown will populate as visitors explore routes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
