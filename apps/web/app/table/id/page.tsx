'use client'

import { useParams } from 'next/navigation'

export default function TablePage() {
  const params = useParams<{ id: string }>()
  const tableId = params.id
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || ''
  const waLink = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I'm at table ${tableId}`)}`
    : '#'

  return (
    <main className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
        <div className="text-sm font-semibold uppercase tracking-wider text-orange-600">KhadakX QR Commerce</div>
        <h1 className="mt-2 text-3xl font-black">Table #{tableId}</h1>
        <p className="mt-2 text-slate-500">Scan or open WhatsApp to continue to the menu and ordering experience.</p>
        <div className="mt-7 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Use the WhatsApp button below to continue.</div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-7 block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-500">Open WhatsApp</a>
      </section>
    </main>
  )
}
