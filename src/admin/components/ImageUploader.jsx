import { useState, useRef } from 'react'
import { UploadCloud, Image as ImageIcon, Check, Loader2, Link as LinkIcon, Trash2 } from 'lucide-react'
import { uploadStorageFile, isSupabaseConfigured } from '../../lib/supabase'

export default function ImageUploader({
  value,
  onChange,
  bucket = 'media',
  folder = '',
  label = 'Upload Image',
  accept = 'image/*',
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('upload') // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState(value || '')
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Paste an external image URL or local asset path below.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const ext = file.name.split('.').pop()
      const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`
      const destinationPath = folder ? `${folder}/${cleanFileName}` : cleanFileName

      const { url, error: uploadErr } = await uploadStorageFile(bucket, destinationPath, file)
      if (uploadErr) throw uploadErr

      onChange(url)
    } catch (err) {
      console.error('Upload failed:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlApply = () => {
    onChange(urlInput.trim())
  }

  const handleClear = () => {
    onChange('')
    setUrlInput('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs text-white/70 tracking-wider uppercase">{label}</label>
        <div className="flex items-center gap-1 glass p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2 py-0.5 rounded-md transition-colors ${tab === 'upload' ? 'bg-[#00f5d4]/10 text-[#00f5d4]' : 'text-white/40 hover:text-white'}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2 py-0.5 rounded-md transition-colors ${tab === 'url' ? 'bg-[#00f5d4]/10 text-[#00f5d4]' : 'text-white/40 hover:text-white'}`}
          >
            URL Path
          </button>
        </div>
      </div>

      {tab === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all hover:border-[#00f5d4]/50 group"
          style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.015)' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-3">
              <Loader2 size={24} className="text-[#00f5d4] animate-spin" />
              <p className="font-mono text-xs text-white/70">Uploading to Supabase Storage...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-2">
              <div className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#00f5d4] group-hover:border-[#00f5d4]/30 transition-colors">
                <UploadCloud size={20} />
              </div>
              <p className="text-xs font-semibold text-white/80">Click or drag image to upload</p>
              <p className="font-mono text-[10px] text-white/40">PNG, JPG, WEBP, SVG or PDF (max 10MB)</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. /projects/iris.png or https://..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#00f5d4]/50 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleUrlApply}
            className="px-3.5 py-2.5 rounded-xl font-mono text-xs font-semibold btn-primary"
          >
            Apply
          </button>
        </div>
      )}

      {error && <p className="font-mono text-[11px] text-rose-400">{error}</p>}

      {/* Preview Section */}
      {value && (
        <div className="flex items-center justify-between p-3 rounded-xl glass border border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
              {value.endsWith('.pdf') ? (
                <span className="font-mono text-[10px] text-rose-400 font-bold">PDF</span>
              ) : (
                <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-mono text-white truncate max-w-xs">{value}</p>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#00f5d4]">
                <Check size={11} /> Attached
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-lg text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
