import { NextResponse } from 'next/server'
import { getIdeas, insertIdea, toggleIdeaDone, deleteIdea } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const ideas = await getIdeas()
  return NextResponse.json(ideas)
}

export async function POST(request: Request) {
  const body = await request.json()

  const item = {
    id: randomUUID(),
    text: body.text,
    testerId: body.testerId,
    timestamp: new Date().toISOString(),
    done: false,
  }

  await insertIdea(item)
  return NextResponse.json(item, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id } = await request.json()
  const updated = await toggleIdeaDone(id)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')!
  await deleteIdea(id)
  return NextResponse.json({ ok: true })
}
