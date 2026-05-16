import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

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

export interface DB {
  testers: Tester[]
  feedback: FeedbackItem[]
}

export function readDB(): DB {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
  } catch {
    const initial: DB = { testers: [], feedback: [] }
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}
