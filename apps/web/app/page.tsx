'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">KhadakX • One Business Platform</p>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">Launch, operate and grow your business from one roof.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">MyArea discovery, AdForge marketing, QR commerce, products, orders, rides, reviews and automation are being unified inside KhadakX.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/adforge" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">Open Growth OS</Link>
            <Link href="/table/1" className="rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/5">Open QR Table</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
