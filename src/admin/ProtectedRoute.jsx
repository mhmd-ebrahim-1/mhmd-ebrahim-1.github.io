import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-2xl glass border border-cyan-400/20 flex items-center justify-center mb-4">
          <Loader2 size={24} className="text-[#00f5d4] animate-spin" />
        </div>
        <p className="font-mono text-xs text-white/50 tracking-widest uppercase">Authenticating Session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
