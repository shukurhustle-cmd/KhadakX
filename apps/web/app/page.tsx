'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">KhadakX • B2B Business Launch & Growth OS</p>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">Build the business in KhadakX. Grow it with AdForge.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-400">KhadakX creates the business infrastructure and Business Blueprint. MyArea serves B2C local discovery. AdForge is the independent marketing product that can be activated from either platform using the same Business ID.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/launch" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">Launch business marketing</Link>
            <Link href="/adforge" className="rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/5">Open Growth OS</Link>
            <Link href="/table/1" className="rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/5">Open QR Table</Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              ['MyArea', 'B2C local discovery and vendor entry'],
              ['KhadakX', 'B2B business setup and operating system'],
              ['AdForge', 'Marketing, campaigns and creative growth'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="font-bold">{title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">{description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
