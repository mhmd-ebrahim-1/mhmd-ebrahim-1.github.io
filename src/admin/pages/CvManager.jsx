import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, UploadCloud, Download, Check, ExternalLink, ShieldCheck } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured, uploadStorageFile } from '../../lib/supabase'

export default function CvManager() {
  const { siteSettings, setSiteSettings, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [cvUrl, setCvUrl] = useState(siteSettings?.cvUrl || '/Mohamed-Ebrahim-CV.pdf')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.pdf')) {
      addToast('Please select a valid PDF file', 'error')
      return
    }

    setUploading(true)
    try {
      if (isSupabaseConfigured() && supabase) {
        const { url, error } = await uploadStorageFile('cv', 'Mohamed-Ebrahim-CV.pdf', file)
        if (error) throw error
        setCvUrl(url)
        addToast('New CV uploaded to Supabase Storage', 'success', 'Uploaded')
      } else {
        setCvUrl('/Mohamed-Ebrahim-CV.pdf')
        addToast('CV set to default static asset', 'info')
      }
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from('site_settings').update({
          cv_url: cvUrl,
        }).eq('id', 'global')
        if (error) throw error
      }

      setSiteSettings((prev) => ({
        ...prev,
        cvUrl: cvUrl,
      }))

      addToast('CV configuration published to live portfolio', 'success', 'Published')
      logAudit('UPDATE', 'cv', 'CV File URL updated')
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
        <h2 className="font-display font-bold text-2xl text-white">CV / Resume Management</h2>
        <p className="font-mono text-xs text-white/50 mt-1">
          Upload and publish your official PDF resume for direct download across the portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Card Left */}
        <div className="lg:col-span-6 space-y-5">
          <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Active CV Asset</h3>
                <p className="font-mono text-[11px] text-[#00f5d4] truncate max-w-xs">{cvUrl}</p>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-2">
                Upload New PDF Document
              </label>
              <label className="border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-[#00f5d4]/50 border-white/15 bg-white/[0.015]">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <UploadCloud size={24} className="text-[#00f5d4] mb-2" />
                <p className="text-xs font-semibold text-white">Click to select Mohamed-Ebrahim-CV.pdf</p>
                <p className="font-mono text-[10px] text-white/40 mt-1">PDF format (recommended max 5MB)</p>
              </label>
            </div>

            <div>
              <label className="block font-mono text-xs text-white/70 uppercase tracking-wider mb-1.5">
                Direct CV URL Path
              </label>
              <input
                type="text"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="Mohamed-Ebrahim-CV.pdf"
                className="btn-ghost inline-flex items-center gap-2 text-xs font-mono py-2.5 px-3"
              >
                <Download size={14} /> Test Download
              </a>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-2.5 px-5"
              >
                <Check size={14} /> Save CV URL
              </button>
            </div>
          </form>
        </div>

        {/* Preview Frame Right */}
        <div className="lg:col-span-6">
          <div className="p-6 rounded-3xl glass border border-white/[0.08] space-y-4">
            <h3 className="font-display font-bold text-base text-white">Live PDF Preview</h3>
            <div className="h-[420px] rounded-2xl bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center">
              <iframe
                src={`${cvUrl}#toolbar=0`}
                title="CV Preview"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
