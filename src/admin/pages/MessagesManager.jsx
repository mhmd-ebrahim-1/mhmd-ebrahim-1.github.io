import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Search, Trash2, CheckCircle2, Clock, Reply, Star, AlertCircle, Inbox } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import ConfirmDialog from '../components/ConfirmDialog'

export default function MessagesManager() {
  const { addToast } = useOutletContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchMessages = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setMessages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const toggleRead = async (id, currentStatus) => {
    const nextStatus = !currentStatus
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: nextStatus } : m)))

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('contact_messages').update({ is_read: nextStatus }).eq('id', id)
    }
  }

  const openDelete = (id) => {
    setDeletingId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('contact_messages').delete().eq('id', deletingId)
      }
      setMessages((prev) => prev.filter((m) => m.id !== deletingId))
      if (selectedMessage?.id === deletingId) setSelectedMessage(null)
      addToast('Message deleted', 'success')
    } catch (e) {
      console.error(e)
      addToast('Failed to delete message', 'error')
    } finally {
      setConfirmOpen(false)
      setDeletingId(null)
    }
  }

  const filtered = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Contact Submissions</h2>
          <p className="font-mono text-xs text-white/50 mt-1">
            {messages.length} Total Inquiries · {messages.filter((m) => !m.is_read).length} Unread
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Messages List Left */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3 rounded-2xl glass border border-white/[0.08]">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-2 rounded-xl glass border border-white/10 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg)
                  if (!msg.is_read) toggleRead(msg.id, false)
                }}
                className={`p-4 rounded-2xl glass border cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'border-[#00f5d4]/50 bg-cyan-500/[0.06] shadow-lg shadow-[#00f5d4]/5'
                    : msg.is_read
                    ? 'border-white/[0.06] hover:border-white/15'
                    : 'border-cyan-400/30 bg-cyan-400/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-display font-bold text-xs text-white truncate">{msg.name}</span>
                  <span className="font-mono text-[10px] text-white/40 shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white/80 line-clamp-1 mb-1">{msg.subject || 'No Subject'}</p>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{msg.message}</p>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-10 rounded-2xl glass border border-white/[0.08] text-center">
                <Inbox size={24} className="mx-auto text-white/30 mb-2" />
                <p className="font-mono text-xs text-white/40">No contact messages received yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Message Detail Right */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{selectedMessage.subject || 'Inquiry'}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-mono">
                    <span className="text-[#00f5d4]">{selectedMessage.name}</span>
                    <span className="text-white/40">&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <p className="font-mono text-[11px] text-white/30 mt-1">
                    Received on {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                    className="p-2 rounded-xl btn-primary text-xs font-mono flex items-center gap-1.5"
                    title="Reply via Email"
                  >
                    <Reply size={14} /> Reply
                  </a>
                  <button
                    onClick={() => openDelete(selectedMessage.id)}
                    className="p-2 rounded-xl glass border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                    title="Delete Message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-white/85 whitespace-pre-wrap font-sans">
                {selectedMessage.message}
              </div>
            </div>
          ) : (
            <div className="p-16 rounded-3xl glass border border-white/[0.08] text-center">
              <Mail size={32} className="mx-auto text-white/20 mb-3" />
              <p className="font-display font-semibold text-white/80">Select a message to view details</p>
              <p className="font-mono text-xs text-white/40 mt-1">Click on any message from the list on the left.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Message"
        message="Are you sure you want to permanently delete this contact inquiry?"
      />
    </div>
  )
}
