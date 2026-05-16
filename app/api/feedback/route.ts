import { NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const db = readDB()
  return NextResponse.json(db.feedback)
}

export async function POST(request: Request) {
  const body = await request.json()
  const db = readDB()

  const item = {
    id: randomUUID(),
    section: body.section,
    type: body.type,
    text: body.text,
    testerId: body.testerId,
    timestamp: new Date().toISOString(),
    fixed: false,
  }

  db.feedback.push(item)
  writeDB(db)
  return NextResponse.json(item, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id } = await request.json()
  const db = readDB()

  const item = db.feedback.find(f => f.id === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  item.fixed = !item.fixed
  writeDB(db)
  return NextResponse.json(item)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const db = readDB()

  db.feedback = db.feedback.filter(f => f.id !== id)
  writeDB(db)
  return NextResponse.json({ ok: true })
}
