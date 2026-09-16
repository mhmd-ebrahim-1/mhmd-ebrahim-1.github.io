import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Plus, Edit2, Trash2, Check, X, Database, Terminal } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Modal from '../components/Modal'

export default function SkillsManager() {
  const { skills, setSkills, tools, setTools, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [activeDomain, setActiveDomain] = useState('analytics')
  const [newSkillText, setNewSkillText] = useState('')
  const [saving, setSaving] = useState(false)

  const currentDomainData = (skills && skills[activeDomain]) ? skills[activeDomain] : { title: activeDomain, description: '', skills: [] }

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return
    const skillName = newSkillText.trim()
    if (currentDomainData.skills?.includes(skillName)) return

    const updatedSkills = {
      ...(skills || {}),
      [activeDomain]: {
        ...currentDomainData,
        skills: [...(currentDomainData.skills || []), skillName],
      },
    }
    setSkills(updatedSkills)
    setNewSkillText('')
    addToast(`Added "${skillName}" to ${currentDomainData.title}`, 'success')
    logAudit('ADD_SKILL', 'skills', skillName)
  }

  const handleRemoveSkill = (skillName) => {
    const updatedSkills = {
      ...(skills || {}),
      [activeDomain]: {
        ...currentDomainData,
        skills: (currentDomainData.skills || []).filter((s) => s !== skillName),
      },
    }
    setSkills(updatedSkills)
    addToast(`Removed "${skillName}"`, 'info')
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      if (isSupabaseConfigured() && supabase) {
        for (const [key, domain] of Object.entries(skills || {})) {
          const { error } = await supabase.from('skills').upsert({
            domain_key: key,
            domain_title: domain.title,
            domain_description: domain.description,
            skills: domain.skills,
          }, { onConflict: 'domain_key' })
          if (error) throw error
        }
      }
      addToast('All skills saved successfully to backend', 'success', 'Saved')
      logAudit('UPDATE', 'skills', 'Skills matrix updated')
    } catch (e) {
      console.error(e)
      addToast('Failed to save skills to Supabase', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Skills &amp; Technologies</h2>
          <p className="font-mono text-xs text-white/50 mt-1">Manage categorized technical competencies and toolsets</p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-3 px-5 shadow-lg shadow-[#00f5d4]/10"
        >
          <Check size={16} /> Save All Skills
        </button>
      </div>

      {/* Domain Selection Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass border border-white/[0.08]">
        {Object.entries(skills || {}).map(([key, domain]) => (
          <button
            key={key}
            onClick={() => setActiveDomain(key)}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all ${
              activeDomain === key
                ? 'bg-[#00f5d4]/15 text-[#00f5d4] border border-[#00f5d4]/30 shadow-lg shadow-[#00f5d4]/5'
                : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {domain.title}
          </button>
        ))}
      </div>

      {/* Active Domain Editor Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass border border-white/[0.08] space-y-6">
        <div>
          <span className="font-mono text-[10px] text-[#00f5d4] uppercase tracking-wider">// DOMAIN CATEGORY</span>
          <h3 className="font-display font-bold text-xl text-white mt-1">{currentDomainData.title}</h3>
          <p className="text-sm text-white/60 mt-1.5 leading-relaxed max-w-2xl">{currentDomainData.description}</p>
        </div>

        {/* Add Skill Form */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newSkillText}
            onChange={(e) => setNewSkillText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            placeholder="Add new skill (e.g. PyTorch, PySpark)..."
            className="flex-1 px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white outline-none focus:border-[#00f5d4]/50"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="btn-primary px-4 py-2.5 text-xs font-mono shrink-0 flex items-center gap-1.5"
          >
            <Plus size={15} /> Add
          </button>
        </div>

        {/* Current Skills Chips */}
        <div>
          <p className="font-mono text-xs text-white/40 uppercase tracking-wider mb-3">
            Active Competencies ({currentDomainData.skills?.length || 0})
          </p>
          <div className="flex flex-wrap gap-2">
            {currentDomainData.skills?.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass border border-cyan-400/20 text-xs font-mono text-white/90 group hover:border-cyan-400/40 transition-colors"
                style={{ background: 'rgba(0, 245, 212, 0.05)' }}
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="text-white/40 hover:text-rose-400 transition-colors"
                >
                  <X size={13} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
