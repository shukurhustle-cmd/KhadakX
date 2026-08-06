'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
      <div className="text-center text-white p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold mb-4">🍽️ KhadakX</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl mb-8"
        >
          Scan. Order. Experience.
        </motion.p>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-x-4"
        >
          <Link
            href="/menu"
            className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition inline-block"
          >
            View Menu
          </Link>
          <Link
            href="/table/1"
            className="bg-orange-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-800 transition inline-block"
          >
            Scan QR
          </Link>
        </motion.div>
      </div>
    </main>
  );
}