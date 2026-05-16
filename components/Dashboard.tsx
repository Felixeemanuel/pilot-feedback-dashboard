'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FeedbackItem, Tester, Section } from '@/lib/db'
import AddFeedbackModal from './AddFeedbackModal'
import ManageTestersModal from './ManageTestersModal'

const SECTIONS: Section[] = ['UX', 'Content', 'Performance', 'Bugs']

export default function Dashboard({
  initialFeedback,
  initialTesters,
}: {
  initialFeedback: FeedbackItem[]
  initialTesters: Tester[]
}) {
  const router = useRouter()
  const [feedback, setFeedback] = useState(initialFeedback)
  const [testers, setTesters] = useState(initialTesters)
  const [activeSection, setActiveSection] = useState<Section>('UX')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTestersModal, setShowTestersModal] = useState(false)

  const sectionFeedback = feedback.filter(f => f.section === activeSection)
  const positive = sectionFeedback.filter(f => f.type === 'positive')
  const negative = sectionFeedback.filter(f => f.type === 'negative')

  const getTester = (id: string) => testers.find(t => t.id === id)

  async function addFeedback(data: {
    section: Section
    type: 'positive' | 'negative'
    text: string
    testerId: string
  }) {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const item = await res.json()
    setFeedback(prev => [...prev, item])
    if (data.section !== activeSection) setActiveSection(data.section)
  }

  async function removeFeedback(id: string) {
    await fetch(`/api/feedback?id=${id}`, { method: 'DELETE' })
    setFeedback(prev => prev.filter(f => f.id !== id))
  }

  async function toggleFixed(id: string) {
    const res = await fetch('/api/feedback', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const updated = await res.json()
    setFeedback(prev => prev.map(f => (f.id === id ? updated : f)))
  }

  async function addTester(data: { name: string; org: string }) {
    const res = await fetch('/api/testers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const tester = await res.json()
    setTesters(prev => [...prev, tester])
  }

  async function removeTester(id: string) {
    await fetch(`/api/testers?id=${id}`, { method: 'DELETE' })
    setTesters(prev => prev.filter(t => t.id !== id))
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Pilot Feedback Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">After-school care software</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Add Feedback
            </button>
            <button
              onClick={() => setShowTestersModal(true)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Testers ({testers.length})
            </button>
            <button
              onClick={logout}
              className="border border-gray-300 text-gray-500 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Section tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex gap-0">
          {SECTIONS.map(section => {
            const count = feedback.filter(f => f.section === section).length
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeSection === section
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section}
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-normal ${
                    activeSection === section
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Positive column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs font-bold">✓</span>
              <h2 className="font-medium text-gray-900">Positive</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                {positive.length}
              </span>
            </div>
            <div className="space-y-3">
              {positive.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-400">No positive feedback yet</p>
                </div>
              ) : (
                positive.map(item => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    tester={getTester(item.testerId)}
                    onDelete={() => removeFeedback(item.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Negative column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold">✕</span>
              <h2 className="font-medium text-gray-900">Negative</h2>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {negative.length}
              </span>
              {negative.some(f => f.fixed) && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {negative.filter(f => f.fixed).length} fixed
                </span>
              )}
            </div>
            <div className="space-y-3">
              {negative.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                  <p className="text-sm text-gray-400">No negative feedback yet</p>
                </div>
              ) : (
                negative.map(item => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    tester={getTester(item.testerId)}
                    onDelete={() => removeFeedback(item.id)}
                    onToggleFixed={() => toggleFixed(item.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddFeedbackModal
          testers={testers}
          activeSection={activeSection}
          onClose={() => setShowAddModal(false)}
          onAdd={addFeedback}
        />
      )}
      {showTestersModal && (
        <ManageTestersModal
          testers={testers}
          onClose={() => setShowTestersModal(false)}
          onAdd={addTester}
          onRemove={removeTester}
        />
      )}
    </div>
  )
}

function FeedbackCard({
  item,
  tester,
  onDelete,
  onToggleFixed,
}: {
  item: FeedbackItem
  tester: Tester | undefined
  onDelete: () => void
  onToggleFixed?: () => void
}) {
  const date = new Date(item.timestamp).toLocaleString('sv-SE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const isPositive = item.type === 'positive'

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        item.fixed
          ? 'bg-gray-50 border-gray-200'
          : isPositive
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      <p className={`text-sm text-gray-800 mb-3 leading-relaxed ${item.fixed ? 'line-through text-gray-400' : ''}`}>
        {item.text}
      </p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-gray-700 leading-none">
            {tester?.name ?? 'Unknown tester'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {tester?.org ?? ''}
            {tester?.org ? ' · ' : ''}
            {date}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {onToggleFixed && (
            <button
              onClick={onToggleFixed}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                item.fixed
                  ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
              }`}
            >
              {item.fixed ? 'Unfix' : '✓ Fixed'}
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-xs px-2.5 py-1 rounded-lg bg-white text-red-500 border border-red-200 hover:bg-red-50 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
