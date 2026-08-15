'use client'

import { useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_ADFORGE_API_URL || 'https://adforge-backend-42s6.onrender.com'

export default function AdForgePage() {
  const [mode, setMode] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing')
  const [briefs, setBriefs] = useState<any[]>([])
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ product_name: '', offer: '', target_audience: '', brand_voice: '' })

  async function loadBriefs() {
    try {
      const response = await fetch(`${API_URL}/api/briefs/`)
      if (!response.ok) throw new Error('Unable to load campaigns')
      const data = await response.json()
      setBriefs(data.briefs || [])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (mode === 'dashboard') loadBriefs()
  }, [mode])

  async function createCampaign(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const brief = await fetch(`${API_URL}/api/briefs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: 'khadakx',
          product_name: form.product_name,
          product_description: '',
          offer: form.offer,
          target_audience: form.target_audience,
          brand_voice: { tone: form.brand_voice || 'professional' },
        }),
      })
      if (!brief.ok) throw new Error('Campaign creation failed')
      const created = await brief.json()
      await fetch(`${API_URL}/api/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief_id: created.id, tenant_id: 'khadakx', channels: ['instagram', 'facebook', 'google', 'linkedin', 'pinterest'] }),
      })
      setShowNew(false)
      setForm({ product_name: '', offer: '', target_audience: '', brand_voice: '' })
      await loadBriefs()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (mode !== 'dashboard') {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="max-w-3xl w-full text-center">
          <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AdForge</div>
          <h1 className="mt-8 text-5xl font-bold text-gray-900">AI marketing inside KhadakX</h1>
          <p className="mt-5 text-xl text-gray-500">Campaigns, Creative DNA, channel assets and publishing workflows under the same platform roof.</p>
          <div className="mt-10 flex justify-center gap-4">
            <button onClick={() => setMode('dashboard')} className="px-7 py-3 rounded-xl bg-blue-600 text-white font-semibold">Open AdForge</button>
            <button onClick={() => setMode('signup')} className="px-7 py-3 rounded-xl border border-gray-300">Create account</button>
          </div>
        </div>
      </main>
    )
  }

  const dnaCount = briefs.filter((brief) => brief.dna?.hook).length

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AdForge</div>
          <div className="text-sm text-gray-500">KhadakX Growth OS</div>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold">+ New Campaign</button>
      </header>

      <section className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            ['Total Campaigns', briefs.length],
            ['Creative DNA', dnaCount],
            ['Assets Ready', dnaCount * 2],
            ['Live', 0],
          ].map(([label, value]) => (
            <div key={String(label)} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-xs uppercase tracking-wider text-gray-500">{label}</div>
              <div className="text-3xl font-bold mt-2">{value}</div>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold mb-4">All Campaigns</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {briefs.map((brief) => (
            <article key={brief.id} className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{brief.product_name}</h3>
                  <p className="text-sm text-gray-500">{brief.offer} · {brief.target_audience}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{brief.status || 'draft'}</span>
              </div>
              {brief.dna && <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="bg-blue-50 p-3 rounded-lg"><b>Hook</b><div>{brief.dna.hook}</div></div><div className="bg-purple-50 p-3 rounded-lg"><b>Value</b><div>{brief.dna.value_prop}</div></div><div className="bg-green-50 p-3 rounded-lg"><b>CTA</b><div>{brief.dna.cta}</div></div><div className="bg-yellow-50 p-3 rounded-lg"><b>Visual</b><div>{brief.dna.visual_sentiment}</div></div></div>}
              <div className="mt-5 flex flex-wrap gap-2 text-xs"><span>Instagram</span><span>Facebook</span><span>Google</span><span>LinkedIn</span><span>Pinterest</span></div>
            </article>
          ))}
        </div>
      </section>

      {showNew && <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6"><form onSubmit={createCampaign} className="bg-white rounded-2xl p-7 max-w-xl w-full space-y-4"><h2 className="text-xl font-bold">New Campaign</h2>{Object.entries(form).map(([key, value]) => <input key={key} value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key !== 'brand_voice'} placeholder={key.replace('_', ' ')} className="w-full border rounded-lg px-4 py-3" />)}<div className="flex gap-3"><button type="button" onClick={() => setShowNew(false)} className="flex-1 border rounded-lg py-3">Cancel</button><button disabled={loading} className="flex-1 bg-blue-600 text-white rounded-lg py-3">{loading ? 'Generating…' : 'Generate Assets'}</button></div></form></div>}
    </main>
  )
}
