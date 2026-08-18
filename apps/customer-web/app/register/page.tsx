'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://khakadx-api.onrender.com';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '', industry: '', city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, product: 'MYAREA' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Registration failed');
      localStorage.setItem('khakadx_access_token', data.access_token);
      localStorage.setItem('khakadx_business', JSON.stringify(data.business));
      router.push('/upgrade');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <form onSubmit={submit} className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">MyArea</p>
        <h1 className="mt-2 text-3xl font-black">Create your local business account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">This creates the single Business ID that can later be upgraded to KhadakX and AdForge without re-entering your business.</p>
        <div className="mt-8 grid gap-4">
          {[
            ['name', 'Your name'],
            ['email', 'Email'],
            ['password', 'Password'],
            ['businessName', 'Business name'],
            ['industry', 'Industry'],
            ['city', 'City'],
          ].map(([key, label]) => (
            <input key={key} required={['name', 'email', 'password', 'businessName'].includes(key)} type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'} placeholder={label} value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-orange-400" />
          ))}
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-orange-500 px-5 py-3 font-bold text-white disabled:opacity-50">{loading ? 'Creating account...' : 'Create MyArea account'}</button>
      </form>
    </main>
  );
}
