import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${maxWidth} glass rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 my-8`}
            style={{
              background: 'linear-gradient(145deg, rgba(13, 17, 33, 0.98) 0%, rgba(7, 10, 20, 0.98) 100%)',
              borderColor: 'rgba(0, 245, 212, 0.2)',
            }}
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <h3 className="font-display font-bold text-xl text-white">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center glass text-white/50 hover:text-white hover:border-cyan-400/40 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
