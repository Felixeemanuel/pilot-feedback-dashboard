import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { pin } = await request.json()
  const correctPin = process.env.DASHBOARD_PIN
  const secret = process.env.DASHBOARD_SECRET

  if (!correctPin || !secret || pin !== correctPin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('auth_token', secret, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })
  return response
}
