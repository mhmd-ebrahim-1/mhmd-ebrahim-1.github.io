import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Settings, Download, Upload, ShieldCheck, Activity, Check, AlertTriangle, RefreshCw } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function SettingsManager() {
  const { siteSettings, setSiteSettings, projects, certificates, experience, skills, services, profile, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [maintenance, setMaintenance] = useState(Boolean(siteSettings?.maintenanceMode))
  const [logs, setLogs] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return
    supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setLogs(data)
      })
  }, [])

  const handleMaintenanceToggle = async (checked) => {
    setMaintenance(checked)
    setSiteSettings((prev) => ({ ...prev, maintenanceMode: checked }))

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('site_settings').update({ maintenance_mode: checked }).eq('id', 'global')
      if (error) console.error('Failed to update maintenance mode:', error)
    }
    addToast(`Maintenance mode is now ${checked ? 'ENABLED' : 'DISABLED'}`, checked ? 'warning' : 'success')
    logAudit('TOGGLE', 'settings', `Maintenance Mode: ${checked}`)
  }

  const exportBackupJson = () => {
    const backupData = {
      version: '1.1.0',
      exportedAt: new Date().toISOString(),
      profile,
      siteSettings,
      projects,
      certificates,
      experience,
      skills,
      services,
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mohamed-ebrahim-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)

    addToast('Complete portfolio backup downloaded', 'success', 'Backup Exported')
    logAudit('EXPORT_BACKUP', 'system', 'Full JSON Database Export')
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">System Settings &amp; Audit</h2>
        <p className="font-mono text-xs text-white/50 mt-1">Manage global system parameters, backups, and audit security trail</p>
      </div>

      {/* Global Config Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-6">
        <h3 className="font-display font-bold text-lg text-white">System Preferences</h3>

        <div className="flex items-center justify-between p-4 rounded-2xl glass border border-white/5">
          <div>
            <p className="font-display font-semibold text-sm text-white">Maintenance Mode</p>
            <p className="text-xs text-white/50 mt-0.5">Displays a maintenance notice on the public website</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => handleMaintenanceToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00f5d4]" />
          </label>
        </div>

        {/* Database Backup & Restore */}
        <div className="p-4 rounded-2xl glass border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-display font-semibold text-sm text-white">Data Backup &amp; Portability</p>
            <p className="text-xs text-white/50 mt-0.5">Export all projects, certificates, skills, and configuration to a portable JSON file</p>
          </div>
          <button
            type="button"
            onClick={exportBackupJson}
            className="btn-ghost inline-flex items-center gap-2 text-xs font-mono py-2.5 px-4 shrink-0"
          >
            <Download size={14} /> Export Backup (JSON)
          </button>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Activity size={18} className="text-[#00f5d4]" /> Security &amp; Change Audit Trail
          </h3>
          <span className="font-mono text-xs text-white/40">{logs.length} Recent entries</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3.5 rounded-xl glass border border-white/5 font-mono text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-[#00f5d4] border border-cyan-500/20 uppercase">
                  {log.action}
                </span>
                <span className="text-white font-semibold">{log.entity_name || log.entity_type}</span>
                <span className="text-white/40 text-[11px] hidden sm:inline">by {log.user_email}</span>
              </div>
              <span className="text-white/40 text-[10px]">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="py-8 text-center">
              <p className="font-mono text-xs text-white/40">Audit records will populate here automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
