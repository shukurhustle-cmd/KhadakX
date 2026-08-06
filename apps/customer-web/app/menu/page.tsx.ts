'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Cart } from '@/components/Cart';
import { ARViewer } from '@/components/ARViewer';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  arModel?: string;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/menu/demo`);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">🍽️ Our Menu</h1>
        
        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded mt-4 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="relative h-48 bg-gray-200">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📸 No image
                    </div>
                  )}
                  {item.arModel && (
                    <button 
                      onClick={() => {/* Open AR modal */}}
                      className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      🔮 AR
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-orange-600">₹{item.price}</span>
                    <button
                      onClick={() => {/* Add to cart */}}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Cart />
    </div>
  );
}