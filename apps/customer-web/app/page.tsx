'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">MyArea • Local Business Discovery</p>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">Get discovered in your area. Grow when you are ready.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">Create one business account, publish your local presence and, when you want social media marketing, upgrade the same business identity to AdForge.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register" className="rounded-xl bg-orange-500 px-6 py-3 font-semibold hover:bg-orange-400">Create MyArea account</Link>
            <Link href="/upgrade" className="rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/5">Explore AdForge upgrade</Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              ['1', 'Create business identity'],
              ['2', 'Get discovered locally'],
              ['3', 'Upgrade to AdForge'],
            ].map(([number, label]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm text-orange-300">0{number}</div>
                <div className="mt-2 font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
