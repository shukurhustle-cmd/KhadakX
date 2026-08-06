'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  menuItemId: string;
}

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  };

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addItem = (menuItemId: string, name: string, price: number) => {
    const existing = items.find(item => item.menuItemId === menuItemId);
    if (existing) {
      const updated = items.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(updated);
    } else {
      saveCart([...items, { id: Date.now().toString(), menuItemId, name, price, quantity: 1 }]);
    }
    toast.success(`${name} added to cart!`);
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveCart(updated);
    toast.success('Item removed');
  };

  const updateQuantity = (id: string, change: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          tableId: '1', // Get from context
          items: items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        }
      );
      toast.success('🎉 Order placed successfully!');
      saveCart([]);
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition z-50"
      >
        🛒
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </motion.button>

      {/* Cart Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">🛒 Your Cart</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-4xl mb-4">🛒</p>
                    <p>Your cart is empty</p>
                    <p className="text-sm">Start adding items from the menu!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={items.length === 0 || loading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}