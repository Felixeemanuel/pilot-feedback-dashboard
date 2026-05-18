import { readDB } from '@/lib/db'
import Dashboard from '@/components/Dashboard'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const db = readDB()
  return <Dashboard initialFeedback={db.feedback} initialTesters={db.testers} initialIdeas={db.ideas} />
}
