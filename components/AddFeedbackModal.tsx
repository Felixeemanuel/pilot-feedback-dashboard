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
  onAdd: (data: {
    section: Section
    type: 'positive' | 'negative'
    text: string
    testerId: string
  }) => Promise<void>
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Add Feedback</h2>
        </div>

        {testers.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500 mb-1">No testers added yet.</p>
            <p className="text-sm text-gray-400">Add a tester first using the <strong className="text-gray-600">Testers</strong> button.</p>
            <button
              onClick={onClose}
              className="mt-5 border border-gray-300 text-gray-700 rounded-xl px-6 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Section + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Section</label>
                <select
                  value={section}
                  onChange={e => setSection(e.target.value as Section)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {SECTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setType('positive')}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      type === 'positive'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    ✓ Positive
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('negative')}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                      type === 'negative'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    ✕ Negative
                  </button>
                </div>
              </div>
            </div>

            {/* Tester */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tester</label>
              <select
                value={testerId}
                onChange={e => setTesterId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {testers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.org}
                  </option>
                ))}
              </select>
            </div>

            {/* Text */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Feedback</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe the feedback..."
                rows={4}
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !text.trim() || !testerId}
                className="flex-1 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
