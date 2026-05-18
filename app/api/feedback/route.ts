import { NextResponse } from 'next/server'
import { getFeedback, insertFeedback, toggleFeedbackFixed, deleteFeedback } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const feedback = await getFeedback()
  return NextResponse.json(feedback)
}

export async function POST(request: Request) {
  const body = await request.json()

  const item = {
    id: randomUUID(),
    section: body.section,
    type: body.type,
    text: body.text,
    testerId: body.testerId,
    timestamp: new Date().toISOString(),
    fixed: false,
  }

  await insertFeedback(item)
  return NextResponse.json(item, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id } = await request.json()
  const updated = await toggleFeedbackFixed(id)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')!
  await deleteFeedback(id)
  return NextResponse.json({ ok: true })
}
