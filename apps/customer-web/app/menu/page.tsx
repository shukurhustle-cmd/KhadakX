'use client';
import { useState } from 'react';

export default function MenuPage() {
  const [items] = useState([
    { id: '1', name: 'Butter Chicken', price: 450, category: 'Main Course' },
    { id: '2', name: 'Paneer Tikka', price: 350, category: 'Starters' },
    { id: '3', name: 'Garlic Naan', price: 80, category: 'Breads' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🍽️ Our Menu</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.category}</p>
              <p className="text-xl font-bold text-orange-600 mt-2">₹{item.price}</p>
              <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition w-full">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}