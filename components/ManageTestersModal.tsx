'use client'

import { useState } from 'react'
import type { Tester } from '@/lib/db'

export default function ManageTestersModal({
  testers,
  onClose,
  onAdd,
  onRemove,
}: {
  testers: Tester[]
  onClose: () => void
  onAdd: (data: { name: string; org: string }) => Promise<void>
  onRemove: (id: string) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [org, setOrg] = useState('')
  const [loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !org.trim()) return
    setLoading(true)
    await onAdd({ name: name.trim(), org: org.trim() })
    setName('')
    setOrg('')
    setLoading(false)
  }

  async function handleRemove(id: string) {
    setRemoving(id)
    await onRemove(id)
    setRemoving(null)
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-modal w-full max-w-md animate-scale-in border border-gray-100 dark:border-gray-800">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Manage Testers</h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Add or remove pilot participants</p>
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

        <div className="px-6 py-5">
          {/* Add form */}
          <form onSubmit={handleAdd} className="mb-5">
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Anna Svensson"
                  autoFocus
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">School / Org</label>
                <input
                  type="text"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Solens Fritidshem"
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-600 transition-colors"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !name.trim() || !org.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_2px_8px_rgba(99,102,241,0.25)]"
            >
              {loading ? 'Adding…' : '+ Add Tester'}
            </button>
          </form>

          {/* Tester list */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {testers.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-600 text-center py-5 italic">No testers yet.</p>
            ) : (
              testers.map(t => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-3.5 py-2.5"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {t.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">{t.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{t.org}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(t.id)}
                    disabled={removing === t.id}
                    className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 font-semibold disabled:opacity-40 shrink-0 transition-colors"
                  >
                    {removing === t.id ? '…' : 'Remove'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
