import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

export default function Toast({ toasts = [], onRemove }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="text-[#00f5d4] shrink-0" />
      case 'error':
        return <XCircle size={18} className="text-rose-400 shrink-0" />
      case 'warning':
        return <AlertTriangle size={18} className="text-amber-400 shrink-0" />
      default:
        return <Info size={18} className="text-[#0ea5e9] shrink-0" />
    }
  }

  const getBorder = (type) => {
    switch (type) {
      case 'success':
        return 'rgba(0,245,212,0.3)'
      case 'error':
        return 'rgba(244,63,94,0.3)'
      case 'warning':
        return 'rgba(251,146,60,0.3)'
      default:
        return 'rgba(14,165,233,0.3)'
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-md pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto p-4 rounded-2xl glass border shadow-2xl flex items-start gap-3 text-sm"
            style={{
              background: 'rgba(10, 14, 28, 0.95)',
              borderColor: getBorder(toast.type),
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            }}
          >
            {getIcon(toast.type)}
            <div className="flex-1">
              {toast.title && <p className="font-display font-semibold text-white text-xs">{toast.title}</p>}
              <p className="text-xs text-white/80 leading-relaxed">{toast.message}</p>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(toast.id)}
                className="text-white/40 hover:text-white transition-colors p-0.5 rounded"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
