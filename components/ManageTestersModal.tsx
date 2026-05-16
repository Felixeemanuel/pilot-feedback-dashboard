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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Manage Testers</h2>
          <p className="text-xs text-gray-400 mt-0.5">Add or remove pilot-test participants</p>
        </div>

        <div className="px-6 py-5">
          {/* Add form */}
          <form onSubmit={handleAdd} className="mb-5">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Anna Svensson"
                  autoFocus
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">School / Org</label>
                <input
                  type="text"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  placeholder="Solens Fritidshem"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !name.trim() || !org.trim()}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding...' : '+ Add Tester'}
            </button>
          </form>

          {/* Tester list */}
          <div className="space-y-2 max-h-60 overflow-y-auto -mx-1 px-1">
            {testers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4 italic">No testers yet.</p>
            ) : (
              testers.map(t => (
                <div
                  key={t.id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.org}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(t.id)}
                    disabled={removing === t.id}
                    className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40 ml-4 shrink-0"
                  >
                    {removing === t.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
