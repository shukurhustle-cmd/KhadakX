'use client';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import { motion } from 'framer-motion';

export default function TablePage() {
  const params = useParams();
  const tableId = params.id;

  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE_ID || '123456789'}?text=Hi%2C%20I%27m%20at%20table%20${tableId}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
      >
        <h2 className="text-3xl font-bold mb-2">Table #{tableId}</h2>
        <p className="text-gray-600 mb-6">Scan to view menu & order</p>
        <div className="flex justify-center mb-6">
          <QRCode value={waLink} size={200} />
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition w-full"
        >
          📱 Open WhatsApp
        </a>
        <p className="text-xs text-gray-400 mt-4">Or scan QR code with your phone</p>
      </motion.div>
    </div>
  );
}