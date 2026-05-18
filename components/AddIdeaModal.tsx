'use client'

import { useState } from 'react'
import type { Tester } from '@/lib/db'

export default function AddIdeaModal({
  testers,
  onClose,
  onAdd,
}: {
  testers: Tester[]
  onClose: () => void
  onAdd: (data: { text: string; testerId: string }) => Promise<void>
}) {
  const [text, setText] = useState('')
  const [testerId, setTesterId] = useState(testers[0]?.id ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !testerId) return
    setLoading(true)
    await onAdd({ text: text.trim(), testerId })
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
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Add Idea</h2>
          </div>
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

            {/* Tester */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">From</label>
              <select
                value={testerId}
                onChange={e => setTesterId(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 dark:focus:border-amber-500 bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors"
              >
                {testers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {t.org}</option>
                ))}
              </select>
            </div>

            {/* Text */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Idea</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe the improvement idea…"
                rows={4}
                autoFocus
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 dark:focus:border-amber-500 resize-none dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-600 transition-colors"
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
                className="flex-1 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
              >
                {loading ? 'Adding…' : 'Add Idea'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
