import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = true,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: danger ? 'rgba(244,63,94,0.12)' : 'rgba(251,146,60,0.12)',
              border: `1px solid ${danger ? 'rgba(244,63,94,0.3)' : 'rgba(251,146,60,0.3)'}`,
              color: danger ? '#f43f5e' : '#fb923c',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <p className="text-sm text-white/70 leading-relaxed pt-1">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl font-mono text-xs font-semibold glass text-white/80 hover:text-white transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
              danger
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                : 'btn-primary'
            }`}
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
