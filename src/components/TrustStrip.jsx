import { motion } from 'framer-motion'
import { Award, ShieldCheck } from 'lucide-react'
import { CREDENTIALS_STRIP } from '../data'

export default function TrustStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 pb-16 pt-2">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl p-4 sm:p-6 glass border border-[var(--border-subtle)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(0, 245, 212, 0.12)', color: '#00f5d4' }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="font-mono text-xs font-semibold tracking-wider uppercase text-[var(--text-primary)]">
                  Selected Training &amp; Professional Credentials
                </p>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  Rigorous programs completed across Data Analytics, Machine Learning &amp; AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-muted)]">
              <Award size={14} style={{ color: '#00f5d4' }} />
              <span>Verified Institutions &amp; Simulation Programs</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3">
            {CREDENTIALS_STRIP.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04, duration: 0.35 }}
                className="p-3 rounded-2xl glass border border-[var(--border-subtle)] flex flex-col justify-between transition-all hover:border-cyan-400/40 hover:-translate-y-0.5"
              >
                <p className="font-display font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate" title={item.name}>
                  {item.label}
                </p>
                <p className="font-mono text-[10px] mt-1.5 truncate text-[#00f5d4] font-medium" title={item.tag}>
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
