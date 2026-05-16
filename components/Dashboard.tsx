'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FeedbackItem, Tester, Section } from '@/lib/db'
import AddFeedbackModal from './AddFeedbackModal'
import ManageTestersModal from './ManageTestersModal'
import ThemeToggle from './ThemeToggle'

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

  async function addFeedback(data: { section: Section; type: 'positive' | 'negative'; text: string; testerId: string }) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0d]">

      {/* Sticky header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.4)]">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Pilot Feedback</span>
          </div>

          {/* Pill tabs — center */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex gap-0.5">
            {SECTIONS.map(section => {
              const count = feedback.filter(f => f.section === section).length
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    activeSection === section
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {section}
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-px rounded-full leading-none ${
                      activeSection === section
                        ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-[0_2px_8px_rgba(99,102,241,0.35)] hover:shadow-[0_4px_14px_rgba(99,102,241,0.45)]"
            >
              + Add Feedback
            </button>
            <button
              onClick={() => setShowTestersModal(true)}
              className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Testers
              {testers.length > 0 && (
                <span className="ml-1.5 text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-px rounded-full">{testers.length}</span>
              )}
            </button>
            <ThemeToggle />
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-7">
        <div className="grid grid-cols-2 gap-6">

          {/* Positive column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Positive</h2>
              <span className="ml-auto text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                {positive.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {positive.length === 0 ? (
                <EmptyState type="positive" />
              ) : (
                positive.map((item, index) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    tester={getTester(item.testerId)}
                    index={index}
                    onDelete={() => removeFeedback(item.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Negative column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Negative</h2>
              <span className="ml-auto text-[11px] font-semibold bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full">
                {negative.length}
              </span>
              {negative.some(f => f.fixed) && (
                <span className="text-[11px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-2 py-0.5 rounded-full">
                  {negative.filter(f => f.fixed).length} fixed
                </span>
              )}
            </div>
            <div className="space-y-2.5">
              {negative.length === 0 ? (
                <EmptyState type="negative" />
              ) : (
                negative.map((item, index) => (
                  <FeedbackCard
                    key={item.id}
                    item={item}
                    tester={getTester(item.testerId)}
                    index={index}
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

function EmptyState({ type }: { type: 'positive' | 'negative' }) {
  const isPositive = type === 'positive'
  return (
    <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center animate-fade-in">
      <div className={`w-9 h-9 rounded-xl mx-auto mb-3 flex items-center justify-center ${
        isPositive ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/20'
      }`}>
        {isPositive ? (
          <svg className="w-4.5 h-4.5 text-emerald-400 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
          </svg>
        ) : (
          <svg className="w-4.5 h-4.5 text-rose-400 dark:text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
          </svg>
        )}
      </div>
      <p className="text-sm font-medium text-gray-400 dark:text-gray-600">
        No {isPositive ? 'positive' : 'negative'} feedback yet
      </p>
    </div>
  )
}

function FeedbackCard({
  item,
  tester,
  index,
  onDelete,
  onToggleFixed,
}: {
  item: FeedbackItem
  tester: Tester | undefined
  index: number
  onDelete: () => void
  onToggleFixed?: () => void
}) {
  const isPositive = item.type === 'positive'
  const initial = (tester?.name ?? '?')[0].toUpperCase()

  const date = new Date(item.timestamp).toLocaleString('sv-SE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  const stripe = item.fixed
    ? 'bg-gray-200 dark:bg-gray-700'
    : isPositive
    ? 'bg-emerald-400 dark:bg-emerald-500'
    : 'bg-rose-400 dark:bg-rose-500'

  const avatarColor = isPositive
    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top accent stripe */}
      <div className={`h-[3px] ${stripe}`} />

      <div className="p-4">
        <p className={`text-sm leading-relaxed mb-3.5 ${
          item.fixed
            ? 'line-through text-gray-300 dark:text-gray-600'
            : 'text-gray-700 dark:text-gray-200'
        }`}>
          {item.text}
        </p>

        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${avatarColor}`}>
            {initial}
          </div>

          {/* Tester info */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 truncate leading-none">
              {tester?.name ?? 'Unknown'}
              {tester?.org && <span className="text-gray-400 dark:text-gray-600"> · {tester.org}</span>}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">{date}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-1 shrink-0">
            {onToggleFixed && (
              <button
                onClick={onToggleFixed}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  item.fixed
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                {item.fixed ? 'Unfix' : '✓ Fixed'}
              </button>
            )}
            <button
              onClick={onDelete}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 dark:hover:text-rose-400 font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
