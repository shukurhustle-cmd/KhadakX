'use client';

import { useState } from 'react';
import axios from 'axios';

interface CartItem {
  menuItemId: string;
  quantity: number;
  price: number;
}

export function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (menuItemId: string, price: number) => {
    setItems((current) => [...current, { menuItemId, quantity: 1, price }]);
  };

  const placeOrder = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        tableId: '1',
        items,
      });
      alert('Order placed! 🎉');
      setItems([]);
    } catch {
      alert('Error placing order');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed bottom-4 right-4 w-72 rounded-xl border bg-white p-4 shadow-xl">
      <h3 className="mb-2 text-lg font-bold">🛒 Cart ({items.length})</h3>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Empty</p>
      ) : (
        <>
          <ul className="mb-2 space-y-1 text-sm">
            {items.map((item, index) => (
              <li key={`${item.menuItemId}-${index}`}>
                {item.quantity}x - ₹{item.price}
              </li>
            ))}
          </ul>
          <div className="font-bold">Total: ₹{total}</div>
          <button
            onClick={placeOrder}
            className="mt-2 w-full rounded-lg bg-orange-600 py-2 text-white hover:bg-orange-700"
          >
            Place Order
          </button>
        </>
      )}
      <button type="button" className="sr-only" onClick={() => addItem('', 0)}>
        Add item
      </button>
    </div>
  );
}
