'use client'

import { useState } from 'react'
import type { Tester, Section } from '@/lib/db'

const SECTIONS: Section[] = ['UX', 'Content', 'Performance', 'Bugs']

export default function AddFeedbackModal({
  testers,
  activeSection,
  onClose,
  onAdd,
}: {
  testers: Tester[]
  activeSection: Section
  onClose: () => void
  onAdd: (data: { section: Section; type: 'positive' | 'negative'; text: string; testerId: string }) => Promise<void>
}) {
  const [section, setSection] = useState<Section>(activeSection)
  const [type, setType] = useState<'positive' | 'negative'>('positive')
  const [text, setText] = useState('')
  const [testerId, setTesterId] = useState(testers[0]?.id ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !testerId) return
    setLoading(true)
    await onAdd({ section, type, text: text.trim(), testerId })
    setLoading(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-modal w-full max-w-md animate-scale-in border border-gray-100 dark:border-gray-800">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Add Feedback</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {testers.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">No testers yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Add a tester first using the <strong className="text-gray-600 dark:text-gray-300">Testers</strong> button.</p>
            <button onClick={onClose} className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl px-5 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

            {/* Section + Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Section</label>
                <select
                  value={section}
                  onChange={e => setSection(e.target.value as Section)}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors"
                >
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Type</label>
                <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setType('positive')}
                    className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                      type === 'positive'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    ✓ Positive
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('negative')}
                    className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-l border-gray-200 dark:border-gray-700 ${
                      type === 'negative'
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    ✕ Negative
                  </button>
                </div>
              </div>
            </div>

            {/* Tester */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Tester</label>
              <select
                value={testerId}
                onChange={e => setTesterId(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors"
              >
                {testers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {t.org}</option>
                ))}
              </select>
            </div>

            {/* Text */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Feedback</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe the feedback…"
                rows={4}
                autoFocus
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 resize-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-600 transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !text.trim() || !testerId}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
              >
                {loading ? 'Adding…' : 'Add Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
