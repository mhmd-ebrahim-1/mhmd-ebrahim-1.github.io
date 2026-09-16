import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Image as ImageIcon, UploadCloud, Copy, Trash2, Check, ExternalLink, RefreshCw, Folder } from 'lucide-react'
import { supabase, isSupabaseConfigured, uploadStorageFile } from '../../lib/supabase'
import ConfirmDialog from '../components/ConfirmDialog'

const BUCKETS = ['media', 'projects', 'certificates', 'cv']

export default function MediaManager() {
  const { addToast } = useOutletContext()
  const [activeBucket, setActiveBucket] = useState('media')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingFile, setDeletingFile] = useState(null)

  const fetchFiles = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setFiles([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.storage.from(activeBucket).list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

      if (error) throw error
      if (data) {
        const enriched = data.map((f) => {
          const { data: urlData } = supabase.storage.from(activeBucket).getPublicUrl(f.name)
          return {
            ...f,
            publicUrl: urlData?.publicUrl || '',
          }
        })
        setFiles(enriched)
      }
    } catch (err) {
      console.error(err)
      addToast(`Could not load ${activeBucket} bucket files`, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [activeBucket])

  const handleFileUpload = async (e) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    setUploading(true)
    try {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        await uploadStorageFile(activeBucket, cleanName, file)
      }
      addToast('File(s) uploaded successfully', 'success', 'Uploaded')
      fetchFiles()
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to upload files', 'error')
    } finally {
      setUploading(false)
    }
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    addToast('CDN URL copied to clipboard', 'info')
    setTimeout(() => setCopiedUrl(null), 2500)
  }

  const openDelete = (file) => {
    setDeletingFile(file)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingFile) return
    try {
      if (supabase) {
        await supabase.storage.from(activeBucket).remove([deletingFile.name])
      }
      setFiles((prev) => prev.filter((f) => f.name !== deletingFile.name))
      addToast('File deleted', 'success')
    } catch (e) {
      console.error(e)
      addToast('Failed to delete file', 'error')
    } finally {
      setConfirmOpen(false)
      setDeletingFile(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Media Library</h2>
          <p className="font-mono text-xs text-white/50 mt-1">Manage cloud storage assets, project screenshots, and PDFs</p>
        </div>

        <label className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-3 px-4 cursor-pointer shadow-lg shadow-[#00f5d4]/10 shrink-0">
          <UploadCloud size={16} /> Upload Media
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Bucket Selector Tabs */}
      <div className="flex items-center justify-between p-1.5 rounded-2xl glass border border-white/[0.08]">
        <div className="flex flex-wrap gap-1">
          {BUCKETS.map((b) => (
            <button
              key={b}
              onClick={() => setActiveBucket(b)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold capitalize transition-all ${
                activeBucket === b
                  ? 'bg-[#00f5d4]/15 text-[#00f5d4] border border-[#00f5d4]/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Folder size={13} className="inline mr-1.5" /> {b}
            </button>
          ))}
        </div>

        <button
          onClick={fetchFiles}
          className="p-2 rounded-xl glass text-white/50 hover:text-[#00f5d4] transition-colors"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.map((file) => (
          <motion.div
            key={file.id || file.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl glass border border-white/[0.08] overflow-hidden flex flex-col justify-between group"
          >
            <div className="h-32 bg-black/40 relative overflow-hidden flex items-center justify-center p-2">
              {file.name.endsWith('.pdf') ? (
                <div className="font-mono text-xs text-rose-400 font-bold flex flex-col items-center gap-1">
                  <span>PDF Document</span>
                </div>
              ) : (
                <img
                  src={file.publicUrl}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
              )}
            </div>

            <div className="p-3 bg-[#0c1020]/90 border-t border-white/5">
              <p className="font-mono text-[11px] text-white truncate mb-2">{file.name}</p>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => copyUrl(file.publicUrl)}
                  className="p-1.5 rounded-lg glass text-xs text-white/60 hover:text-[#00f5d4] flex items-center gap-1"
                  title="Copy URL"
                >
                  {copiedUrl === file.publicUrl ? <Check size={13} className="text-[#00f5d4]" /> : <Copy size={13} />}
                </button>
                <a
                  href={file.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg glass text-xs text-white/60 hover:text-white"
                  title="Open in new tab"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => openDelete(file)}
                  className="p-1.5 rounded-lg glass text-xs text-rose-400/80 hover:text-rose-400"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {files.length === 0 && !loading && (
        <div className="p-16 rounded-3xl glass border border-white/[0.08] text-center">
          <ImageIcon size={32} className="mx-auto text-white/20 mb-3" />
          <p className="font-display font-semibold text-white/80">No files in bucket &quot;{activeBucket}&quot;</p>
          <p className="font-mono text-xs text-white/40 mt-1">Upload files using the button above.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Media File"
        message={`Are you sure you want to delete "${deletingFile?.name}"? Any project or certificate referencing this URL may lose its image.`}
      />
    </div>
  )
}
