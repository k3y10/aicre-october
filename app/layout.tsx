import { Metadata } from 'next'
import * as React from 'react'
import { Analytics } from "@vercel/analytics/react"
import '@/styles/globals.css'
import Link from 'next/link'

import { siteConfig } from '@/constants/config'

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background-color min-h-full">
      <body className="bg-background-color min-h-screen flex flex-col">
        {/* Centering the header content */}
        <main className="flex-grow ">
          {children}
          <Analytics />
        </main>
        <footer className="w-full space-between bg-white shadow-md py-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 AiCRE - All Rights Reserved
          </p>
          <p className="text-sm text-gray-500">
            <Link href="/terms" className="text-gray-900 hover:text-neorange">Beta Terms</Link>
          </p>
        </footer>
      </body>
    </html>
  )
}
