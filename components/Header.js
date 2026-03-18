'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-brand-600">Prop</span>
              <span className="text-slate-800">IQ</span>
            </span>
            <span className="hidden sm:inline-block text-xs bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded-full">
              台灣房市
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-brand-600 transition-colors">市場總覽</Link>
            <Link href="/market" className="hover:text-brand-600 transition-colors">各縣市行情</Link>
            <Link href="/blog" className="hover:text-brand-600 transition-colors">房市分析</Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="選單"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-3 text-sm font-medium text-slate-700">
          <Link href="/" onClick={() => setOpen(false)}>市場總覽</Link>
          <Link href="/market" onClick={() => setOpen(false)}>各縣市行情</Link>
          <Link href="/blog" onClick={() => setOpen(false)}>房市分析</Link>
        </div>
      )}
    </header>
  )
}
