'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://khakadx-api.onrender.com';
const ADFORGE_DASHBOARD = process.env.NEXT_PUBLIC_ADFORGE_DASHBOARD_URL || '';

export default function UpgradePage() {
  const [business, setBusiness] = useState<any>(null);
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('khakadx_business');
      if (saved) setBusiness(JSON.parse(saved));
    } catch {}
  }, []);

  async function upgrade() {
    if (!business?.id) return;
    setStatus('upgrading');
    try {
      const response = await fetch(`${API}/api/businesses/${business.id}/upgrade`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ module: 'ADFORGE' }),
      });
      if (!response.ok) throw new Error('Upgrade failed');
      const updated = { ...business, entitlements: [...(business.entitlements || []), { module: 'ADFORGE', status: 'ACTIVE' }] };
      localStorage.setItem('khakadx_business', JSON.stringify(updated));
      setBusiness(updated);
      setStatus('upgraded');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">AdForge upgrade</p>
        <h1 className="mt-2 text-4xl font-black">Turn your MyArea business into a marketed brand.</h1>
        <p className="mt-4 text-slate-400">Your existing Business ID is reused. AdForge receives the business context instead of asking you to create another account.</p>

        {business ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Business</div>
            <div className="mt-1 text-xl font-bold">{business.name}</div>
            <div className="mt-2 text-sm text-slate-400">{business.industry || 'Local business'}{business.city ? ` • ${business.city}` : ''}</div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-200">Create or sign in to a MyArea business first.</div>
        )}

        <button onClick={upgrade} disabled={!business?.id || status === 'upgrading' || status === 'upgraded'} className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold disabled:opacity-50">
          {status === 'upgrading' ? 'Activating AdForge...' : status === 'upgraded' ? 'AdForge activated' : 'Upgrade to AdForge'}
        </button>

        {status === 'upgraded' && (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <div className="font-bold text-emerald-300">AdForge entitlement is active.</div>
            {ADFORGE_DASHBOARD ? <a className="mt-3 inline-block text-sm text-blue-300" href={ADFORGE_DASHBOARD}>Open your AdForge dashboard →</a> : <div className="mt-2 text-sm text-amber-200">The AdForge dashboard URL still needs to be configured in the customer frontend deployment.</div>}
          </div>
        )}

        {status === 'failed' && <p className="mt-4 text-sm text-red-300">Could not activate AdForge. Please verify the KhadakX API deployment and database.</p>}
        <Link href="/" className="mt-6 inline-block text-sm text-slate-400">← Back to MyArea</Link>
      </section>
    </main>
  );
}
