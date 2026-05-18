import { NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const db = readDB()
  return NextResponse.json(db.ideas)
}

export async function POST(request: Request) {
  const body = await request.json()
  const db = readDB()

  const item = {
    id: randomUUID(),
    text: body.text,
    testerId: body.testerId,
    timestamp: new Date().toISOString(),
    done: false,
  }

  db.ideas.push(item)
  writeDB(db)
  return NextResponse.json(item, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id } = await request.json()
  const db = readDB()

  const item = db.ideas.find(i => i.id === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  item.done = !item.done
  writeDB(db)
  return NextResponse.json(item)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const db = readDB()

  db.ideas = db.ideas.filter(i => i.id !== id)
  writeDB(db)
  return NextResponse.json({ ok: true })
}
