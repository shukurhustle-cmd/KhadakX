'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://khakadx-api.onrender.com'
const ADFORGE_DASHBOARD = process.env.NEXT_PUBLIC_ADFORGE_DASHBOARD_URL || ''

const modules = [
  ['MyArea', 'B2C local discovery, vendors, listings and reviews'],
  ['AdForge', 'Marketing dashboard, campaigns, creative DNA and channel assets'],
  ['QR Menu', 'Menu, ordering, offers, Wi-Fi and AR'],
  ['Products', 'Catalog, inventory and business storefront'],
  ['Orders', 'Customer orders and fulfillment'],
  ['Rides', 'Pickup, delivery and local mobility'],
  ['Reviews', 'Customer feedback and reputation'],
  ['Automation', 'AI and workflow orchestration'],
]

export default function GrowthOS() {
  const [health, setHealth] = useState<'checking' | 'online' | 'offline'>('checking')
  const [adforge, setAdforge] = useState<'checking' | 'ready' | 'degraded'>('checking')

  useEffect(() => {
    fetch(`${API}/api/integrations/adforge/health`)
      .then(async response => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => {
        setHealth(ok ? 'online' : 'offline')
        setAdforge(ok && data?.status === 'ready' ? 'ready' : 'degraded')
      })
      .catch(() => {
        setHealth('offline')
        setAdforge('degraded')
      })
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/95 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-black tracking-tight">KhadakX</div>
            <div className="text-xs text-slate-400">Business Launch & Growth OS</div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className={`rounded-full px-3 py-1.5 ${health === 'online' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>Core API: {health}</span>
            <span className={`rounded-full px-3 py-1.5 ${adforge === 'ready' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>AdForge integration: {adforge}</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="max-w-4xl">
          <p className="mb-3 font-semibold text-blue-400">ONE USER • ONE BUSINESS ID • MULTIPLE PRODUCTS</p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">Build the business in KhadakX. Grow it with AdForge.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">MyArea is the B2C entry point. KhadakX is the B2B business operating system. AdForge is the independent marketing product that can be upgraded into from either platform.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {ADFORGE_DASHBOARD ? (
              <a href={ADFORGE_DASHBOARD} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">Open AdForge Dashboard</a>
            ) : (
              <span className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-6 py-3 text-sm text-amber-200">AdForge dashboard URL is not configured yet</span>
            )}
            <a href="/" className="rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/5">Back to KhadakX</a>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Metric label="Identity" value="1 business ID" />
          <Metric label="AdForge integration" value={adforge === 'ready' ? 'Ready' : 'Needs configuration'} />
          <Metric label="Core API" value={health === 'online' ? 'Online' : 'Checking'} />
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {modules.map(([name, description]) => (
            <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/[0.07]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 font-bold text-blue-300">{name.slice(0, 1)}</div>
              <h2 className="mt-4 font-bold">{name}</h2>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-bold">One-click marketing handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">When a business is launched in KhadakX, its Business Blueprint becomes the structured input for AdForge. The business does not re-enter its identity, industry, products or brand information.</p>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {['Business Blueprint', 'Creative DNA', 'Campaigns', 'Channel Assets'].map((step, index) => (
              <div key={step} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-blue-300">0{index + 1}</div>
                <div className="mt-2 font-semibold">{step}</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="text-xs uppercase tracking-wider text-slate-500">{label}</div><div className="mt-2 text-2xl font-black">{value}</div></div>
}
