'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
      <div className="text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4">🍽️ KhadakX</h1>
        <p className="text-xl mb-8">Scan. Order. Experience.</p>
        <div className="space-x-4">
          <Link
            href="/table/1"
            className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition"
          >
            View Table
          </Link>
          <Link
            href="/admin"
            className="bg-orange-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-800 transition"
          >
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
}