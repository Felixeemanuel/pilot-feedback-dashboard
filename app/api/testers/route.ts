import { NextResponse } from 'next/server'
import { getTesters, insertTester, deleteTester } from '@/lib/db'
import { randomUUID } from 'crypto'

export async function GET() {
  const testers = await getTesters()
  return NextResponse.json(testers)
}

export async function POST(request: Request) {
  const body = await request.json()

  const tester = {
    id: randomUUID(),
    name: body.name,
    org: body.org,
  }

  await insertTester(tester)
  return NextResponse.json(tester, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')!
  await deleteTester(id)
  return NextResponse.json({ ok: true })
}
