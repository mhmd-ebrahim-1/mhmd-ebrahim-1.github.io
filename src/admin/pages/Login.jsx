import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      console.error(err)
      setError(err.message || 'Invalid login credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060812] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5d4]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Box */}
        <div
          className="glass rounded-3xl p-8 sm:p-10 border shadow-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(14, 18, 36, 0.95) 0%, rgba(8, 10, 20, 0.98) 100%)',
            borderColor: 'rgba(0, 245, 212, 0.25)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,245,212,0.06)',
          }}
        >
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl glass border border-[#00f5d4]/40 items-center justify-center p-2 mb-4 shadow-lg shadow-[#00f5d4]/10">
              <img src="/logo-me.webp" alt="ME" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/logo-me.png' }} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-tight">Admin Authentication</h1>
            <p className="font-mono text-xs text-white/50 mt-1.5">Mohamed Ebrahim Portfolio CMS</p>
          </div>

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-2xl glass border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle size={15} /> Supabase Setup Required
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                Add <code className="font-mono bg-black/40 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-black/40 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> to your environment file to connect live admin authentication.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass border border-white/10 text-sm text-white placeholder:text-white/30 focus:border-[#00f5d4]/60 focus:bg-white/[0.04] outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl glass border border-white/10 text-sm text-white placeholder:text-white/30 focus:border-[#00f5d4]/60 focus:bg-white/[0.04] outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-mono text-xs font-semibold btn-primary flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[#00f5d4]/20 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
            <Link
              to="/"
              className="font-mono text-xs text-white/40 hover:text-[#00f5d4] transition-colors inline-flex items-center gap-1.5"
            >
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
