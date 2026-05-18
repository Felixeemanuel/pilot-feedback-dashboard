import { createClient } from '@libsql/client'
import type { Client } from '@libsql/client'

// Lazy singleton — client and init run on first request, not at build time.
let _client: Client | null = null
function getClient(): Client {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return _client
}

let _initPromise: Promise<void> | null = null
function ensureInit(): Promise<void> {
  if (!_initPromise) {
    _initPromise = getClient().batch([
      { sql: 'CREATE TABLE IF NOT EXISTS testers (id TEXT PRIMARY KEY, name TEXT NOT NULL, org TEXT NOT NULL)' },
      { sql: 'CREATE TABLE IF NOT EXISTS feedback (id TEXT PRIMARY KEY, section TEXT NOT NULL, type TEXT NOT NULL, text TEXT NOT NULL, testerId TEXT NOT NULL, timestamp TEXT NOT NULL, fixed INTEGER NOT NULL DEFAULT 0)' },
      { sql: 'CREATE TABLE IF NOT EXISTS ideas (id TEXT PRIMARY KEY, text TEXT NOT NULL, testerId TEXT NOT NULL, timestamp TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)' },
    ], 'write').then(() => undefined)
  }
  return _initPromise
}

export interface Tester {
  id: string
  name: string
  org: string
}

export type Section = 'UX' | 'Content' | 'Performance' | 'Bugs'

export interface FeedbackItem {
  id: string
  section: Section
  type: 'positive' | 'negative'
  text: string
  testerId: string
  timestamp: string
  fixed: boolean
}

export interface IdeaItem {
  id: string
  text: string
  testerId: string
  timestamp: string
  done: boolean
}

// ── Testers ──────────────────────────────────────────────────────────────────

export async function getTesters(): Promise<Tester[]> {
  await ensureInit()
  const { rows } = await getClient().execute('SELECT id, name, org FROM testers ORDER BY name')
  return rows.map(r => ({ id: r[0] as string, name: r[1] as string, org: r[2] as string }))
}

export async function insertTester(t: Tester): Promise<void> {
  await ensureInit()
  await getClient().execute({ sql: 'INSERT INTO testers (id, name, org) VALUES (?, ?, ?)', args: [t.id, t.name, t.org] })
}

export async function deleteTester(id: string): Promise<void> {
  await ensureInit()
  await getClient().execute({ sql: 'DELETE FROM testers WHERE id = ?', args: [id] })
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export async function getFeedback(): Promise<FeedbackItem[]> {
  await ensureInit()
  const { rows } = await getClient().execute('SELECT id, section, type, text, testerId, timestamp, fixed FROM feedback ORDER BY timestamp')
  return rows.map(r => ({
    id: r[0] as string,
    section: r[1] as Section,
    type: r[2] as 'positive' | 'negative',
    text: r[3] as string,
    testerId: r[4] as string,
    timestamp: r[5] as string,
    fixed: r[6] === 1,
  }))
}

export async function insertFeedback(item: FeedbackItem): Promise<void> {
  await ensureInit()
  await getClient().execute({
    sql: 'INSERT INTO feedback (id, section, type, text, testerId, timestamp, fixed) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [item.id, item.section, item.type, item.text, item.testerId, item.timestamp, item.fixed ? 1 : 0],
  })
}

export async function toggleFeedbackFixed(id: string): Promise<FeedbackItem | null> {
  await ensureInit()
  await getClient().execute({ sql: 'UPDATE feedback SET fixed = NOT fixed WHERE id = ?', args: [id] })
  const { rows } = await getClient().execute({ sql: 'SELECT id, section, type, text, testerId, timestamp, fixed FROM feedback WHERE id = ?', args: [id] })
  if (!rows[0]) return null
  const r = rows[0]
  return {
    id: r[0] as string,
    section: r[1] as Section,
    type: r[2] as 'positive' | 'negative',
    text: r[3] as string,
    testerId: r[4] as string,
    timestamp: r[5] as string,
    fixed: r[6] === 1,
  }
}

export async function deleteFeedback(id: string): Promise<void> {
  await ensureInit()
  await getClient().execute({ sql: 'DELETE FROM feedback WHERE id = ?', args: [id] })
}

// ── Ideas ─────────────────────────────────────────────────────────────────────

export async function getIdeas(): Promise<IdeaItem[]> {
  await ensureInit()
  const { rows } = await getClient().execute('SELECT id, text, testerId, timestamp, done FROM ideas ORDER BY timestamp')
  return rows.map(r => ({
    id: r[0] as string,
    text: r[1] as string,
    testerId: r[2] as string,
    timestamp: r[3] as string,
    done: r[4] === 1,
  }))
}

export async function insertIdea(item: IdeaItem): Promise<void> {
  await ensureInit()
  await getClient().execute({
    sql: 'INSERT INTO ideas (id, text, testerId, timestamp, done) VALUES (?, ?, ?, ?, ?)',
    args: [item.id, item.text, item.testerId, item.timestamp, item.done ? 1 : 0],
  })
}

export async function toggleIdeaDone(id: string): Promise<IdeaItem | null> {
  await ensureInit()
  await getClient().execute({ sql: 'UPDATE ideas SET done = NOT done WHERE id = ?', args: [id] })
  const { rows } = await getClient().execute({ sql: 'SELECT id, text, testerId, timestamp, done FROM ideas WHERE id = ?', args: [id] })
  if (!rows[0]) return null
  const r = rows[0]
  return {
    id: r[0] as string,
    text: r[1] as string,
    testerId: r[2] as string,
    timestamp: r[3] as string,
    done: r[4] === 1,
  }
}

export async function deleteIdea(id: string): Promise<void> {
  await ensureInit()
  await getClient().execute({ sql: 'DELETE FROM ideas WHERE id = ?', args: [id] })
}
