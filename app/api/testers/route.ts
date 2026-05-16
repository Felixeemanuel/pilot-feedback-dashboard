import { NextResponse } from 'next/server'
import { readDB, writeDB } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const db = readDB()
  return NextResponse.json(db.testers)
}

export async function POST(request: Request) {
  const body = await request.json()
  const db = readDB()

  const tester = {
    id: randomUUID(),
    name: body.name,
    org: body.org,
  }

  db.testers.push(tester)
  writeDB(db)
  return NextResponse.json(tester, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const db = readDB()

  db.testers = db.testers.filter(t => t.id !== id)
  writeDB(db)
  return NextResponse.json({ ok: true })
}
