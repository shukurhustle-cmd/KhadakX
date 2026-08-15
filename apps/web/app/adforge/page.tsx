'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://khakadx-api.onrender.com'
const ADFORGE = process.env.NEXT_PUBLIC_ADFORGE_API_URL || 'https://adforge-backend-42s6.onrender.com'

const modules = [
  ['MyArea', 'Local discovery, vendors, listings and reviews'],
  ['AdForge', 'AI campaigns, creative DNA and channel assets'],
  ['QR Menu', 'Menu, ordering, offers, Wi-Fi and AR'],
  ['Products', 'Catalog, inventory and business storefront'],
  ['Orders', 'Customer orders and fulfillment'],
  ['Rides', 'Pickup, delivery and local mobility'],
  ['Reviews', 'Customer feedback and reputation'],
  ['Automation', 'AI and workflow orchestration'],
]

export default function GrowthOS() {
  const [health, setHealth] = useState<'checking' | 'online' | 'offline'>('checking')
  const [adforge, setAdforge] = useState<'checking' | 'online' | 'offline'>('checking')
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/auth/health`).then(r => r.ok),
      fetch(`${ADFORGE}/api/health`).then(r => r.ok),
      fetch(`${ADFORGE}/api/briefs/`).then(r => r.ok ? r.json() : { briefs: [] }),
    ]).then(([apiOk, adforgeOk, data]) => {
      setHealth(apiOk ? 'online' : 'offline')
      setAdforge(adforgeOk ? 'online' : 'offline')
      setCampaigns(data.briefs || [])
    }).catch(() => {
      setHealth('offline')
      setAdforge('offline')
    })
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-black tracking-tight">KhadakX</div>
            <div className="text-xs text-slate-400">Business Launch & Growth OS</div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className={`px-3 py-1.5 rounded-full ${health === 'online' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>Core API: {health}</span>
            <span className={`px-3 py-1.5 rounded-full ${adforge === 'online' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>AdForge: {adforge}</span>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-blue-400 font-semibold mb-3">ONE PLATFORM • ONE BUSINESS IDENTITY</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">Launch, operate and grow a business from one roof.</h1>
          <p className="mt-5 text-lg text-slate-400">MyArea, AdForge, QR commerce, products, orders, rides, reviews and automation are being consolidated into the KhadakX platform.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-10">
          <Metric label="Campaigns" value={campaigns.length} />
          <Metric label="Platform services" value={modules.length} />
          <Metric label="Production APIs" value={health === 'online' && adforge === 'online' ? '2/2' : 'Checking'} />
        </div>

        <div className="mt-12 grid md:grid-cols-4 gap-4">
          {modules.map(([name, description]) => (
            <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.07] transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center font-bold">{name.slice(0, 1)}</div>
              <h2 className="mt-4 font-bold">{name}</h2>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">AdForge campaigns</h2>
              <p className="text-sm text-slate-400 mt-1">Marketing is now a native growth service inside KhadakX.</p>
            </div>
            <a href="/adforge" className="text-sm text-blue-300">Refresh</a>
          </div>
          {campaigns.length === 0 ? <p className="mt-6 text-slate-500">No campaigns available yet.</p> : <div className="mt-6 space-y-3">{campaigns.slice(0, 6).map(c => <div key={c.id} className="flex items-center justify-between rounded-xl bg-black/20 px-4 py-3"><span className="font-medium">{c.product_name}</span><span className="text-xs text-slate-400">{c.status || 'draft'}</span></div>)}</div>}
        </section>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><div className="text-xs uppercase tracking-wider text-slate-500">{label}</div><div className="text-3xl font-black mt-2">{value}</div></div>
}
