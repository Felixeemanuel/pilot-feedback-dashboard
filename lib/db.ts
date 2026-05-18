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

export interface IdeaItem {
  id: string
  text: string
  testerId: string
  timestamp: string
  done: boolean
}

export interface DB {
  testers: Tester[]
  feedback: FeedbackItem[]
  ideas: IdeaItem[]
}

export function readDB(): DB {
  try {
    const raw = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
    if (!raw.ideas) raw.ideas = []
    return raw
  } catch {
    const initial: DB = { testers: [], feedback: [], ideas: [] }
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
}

export function writeDB(db: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}
