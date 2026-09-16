import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const BASE_URL = import.meta.env.BASE_URL || '/'

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      const doneTimer = setTimeout(onDone, 350)
      return () => clearTimeout(doneTimer)
    }, 850)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: '#07070d' }} initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="absolute inset-0 grid-bg opacity-20" />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center">
            <div className="mx-auto mb-6 w-20 h-20 rounded-3xl overflow-hidden flex items-center justify-center p-3" style={{ background: 'linear-gradient(145deg, rgba(0,245,212,0.14), rgba(14,165,233,0.08))', border: '1px solid rgba(0,245,212,0.25)', boxShadow: '0 0 70px rgba(0,245,212,0.12)' }}>
              <img src={`${BASE_URL}logo-me.webp`} alt="Mohamed Ebrahim" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = `${BASE_URL}logo-me.png` }} />
            </div>
            <p className="font-display text-lg font-semibold text-white">Mohamed Ebrahim</p>
            <p className="font-mono text-[10px] mt-2 tracking-[0.22em]" style={{ color: 'rgba(0,245,212,0.7)' }}>LOADING PORTFOLIO</p>
            <div className="w-44 h-1 mt-6 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00f5d4, #0ea5e9)' }} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.75, ease: 'easeInOut' }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
