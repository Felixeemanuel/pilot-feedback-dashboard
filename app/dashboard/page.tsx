import { getFeedback, getTesters, getIdeas } from '@/lib/db'
import Dashboard from '@/components/Dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [feedback, testers, ideas] = await Promise.all([getFeedback(), getTesters(), getIdeas()])
  return <Dashboard initialFeedback={feedback} initialTesters={testers} initialIdeas={ideas} />
}
