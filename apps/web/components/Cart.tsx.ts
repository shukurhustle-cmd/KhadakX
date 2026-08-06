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
    setItems([...items, { menuItemId, quantity: 1, price }]);
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          tableId: '1',
          items,
        }
      );
      alert('Order placed! 🎉');
      setItems([]);
    } catch (error) {
      alert('Error placing order');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-xl p-4 w-72 border">
      <h3 className="font-bold text-lg mb-2">🛒 Cart ({items.length})</h3>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Empty</p>
      ) : (
        <>
          <ul className="space-y-1 text-sm mb-2">
            {items.map((item, i) => (
              <li key={i}>
                {item.quantity}x - ₹{item.price}
              </li>
            ))}
          </ul>
          <div className="font-bold">Total: ₹{total}</div>
          <button
            onClick={placeOrder}
            className="mt-2 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}