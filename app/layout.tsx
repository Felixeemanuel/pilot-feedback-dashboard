import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pilot Feedback Dashboard',
  description: 'Feedback management for after-school care software pilot · Lgr22',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
