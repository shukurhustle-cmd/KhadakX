'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://khakadx-api.onrender.com'
const ADFORGE_DASHBOARD = process.env.NEXT_PUBLIC_ADFORGE_DASHBOARD_URL || ''

export default function LaunchPage() {
  const [business, setBusiness] = useState<any>(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('khakadx_business')
      if (saved) setBusiness(JSON.parse(saved))
    } catch {}
  }, [])

  async function launchMarketing() {
    if (!business?.id) return
    setStatus('saving')
    setMessage('Saving the latest Business Blueprint...')
    try {
      const blueprint = {
        business: {
          name: business.name,
          industry: business.industry,
          city: business.city,
          state: business.state,
          country: business.country,
          website: business.website,
          description: business.description,
        },
        requestedModules: business.entitlements?.map((item: any) => item.module) || ['KHADAKX'],
        launchSource: 'KHADAKX_B2B',
      }
      const save = await fetch(`${API}/api/businesses/${business.id}/blueprint`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ payload: blueprint, source: 'KHADAKX' }),
      })
      if (!save.ok) throw new Error('Blueprint could not be saved')

      setStatus('launching')
      setMessage('Sending the Business Blueprint to AdForge...')
      const launch = await fetch(`${API}/api/integrations/adforge/launch/${business.id}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ objective: 'Launch the business and generate its first marketing campaign' }),
      })
      const data = await launch.json()
      if (!launch.ok) throw new Error(data?.message || 'AdForge launch failed')
      if (!data.accepted) throw new Error('AdForge integration is not configured for production delivery yet')
      setStatus('done')
      setMessage('Business Blueprint accepted by AdForge. The marketing workspace can now generate the campaign.')
    } catch (error) {
      setStatus('failed')
      setMessage(error instanceof Error ? error.message : 'Launch failed')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="font-semibold uppercase tracking-wider text-blue-400">KhadakX B2B Launch</p>
        <h1 className="mt-2 text-4xl font-black md:text-6xl">Launch the business once. Let AdForge grow it.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">KhadakX owns the Business Blueprint. A single action packages that blueprint and requests the first AdForge marketing campaign using the same Business ID.</p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          {business ? (
            <>
              <div className="text-xs uppercase tracking-wider text-slate-500">Business</div>
              <div className="mt-1 text-2xl font-black">{business.name}</div>
              <div className="mt-2 text-sm text-slate-400">{business.industry || 'Business'}{business.city ? ` • ${business.city}` : ''}</div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(business.entitlements || [{ module: 'KHADAKX' }]).map((item: any) => <div key={item.module} className="rounded-xl border border-white/10 bg-black/20 p-4"><div className="text-xs text-slate-500">ACTIVE</div><div className="mt-1 font-semibold">{item.module}</div></div>)}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-200">No active Business ID found in this browser. Complete business onboarding first.</div>
          )}

          <button onClick={launchMarketing} disabled={!business?.id || ['saving', 'launching'].includes(status)} className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-500 disabled:opacity-50">
            {status === 'saving' ? 'Saving Blueprint...' : status === 'launching' ? 'Launching AdForge...' : status === 'done' ? 'Marketing launch accepted' : 'Launch Marketing with AdForge'}
          </button>

          {message && <div className={`mt-5 rounded-xl p-4 text-sm ${status === 'failed' ? 'bg-red-500/10 text-red-300' : status === 'done' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/[0.04] text-slate-300'}`}>{message}</div>}
          {status === 'done' && ADFORGE_DASHBOARD && <a href={ADFORGE_DASHBOARD} className="mt-5 inline-block text-sm text-blue-300">Open AdForge Dashboard →</a>}
        </div>
      </section>
    </main>
  )
}
