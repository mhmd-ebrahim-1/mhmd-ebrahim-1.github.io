import { motion } from 'framer-motion'
import { Award, ShieldCheck } from 'lucide-react'
import { CREDENTIALS_STRIP } from '../data'

export default function TrustStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 pb-16 pt-2">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl p-4 sm:p-6 glass border"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.06)',
            background: 'linear-gradient(180deg, rgba(17, 17, 32, 0.6) 0%, rgba(10, 10, 20, 0.4) 100%)',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b mb-4" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0, 245, 212, 0.1)', color: '#00f5d4' }}
              >
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="font-mono text-xs font-semibold tracking-wider uppercase text-white/90">
                  Selected Training &amp; Professional Credentials
                </p>
                <p className="text-[11px] font-mono text-white/40">
                  Rigorous programs completed across Data Analytics, Machine Learning &amp; AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
              <Award size={13} style={{ color: '#00f5d4' }} />
              <span>Verified Institutions &amp; Simulation Programs</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {CREDENTIALS_STRIP.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="p-3 rounded-xl flex flex-col justify-between transition-all hover:border-cyan-400/30 hover:bg-white/[0.03]"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <p className="font-display font-bold text-xs sm:text-sm text-white/90 truncate" title={item.name}>
                  {item.label}
                </p>
                <p className="font-mono text-[10px] mt-1.5 truncate" style={{ color: '#00f5d4' }} title={item.tag}>
                  {item.tag}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
