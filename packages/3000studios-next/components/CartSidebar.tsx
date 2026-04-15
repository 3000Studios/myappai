'use client';

import { useCartStore } from '@/lib/cart-store';
import { ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
      >
        <ShoppingCart size={20} />
        <span className="font-medium">{totalItems}</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl z-50 flex flex-col border-l border-purple-500/20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-gradient-to-r from-slate-900 to-purple-900/30">
            <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-purple-300 hover:text-purple-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-purple-300/60 text-center py-8">Your cart is empty</p>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 bg-slate-800/50 border border-purple-500/20 rounded-lg backdrop-blur-sm"
                >
                  {item.image && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-white">{item.name}</h3>
                    <p className="text-cyan-400 text-sm font-semibold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded text-sm text-purple-300 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded text-sm text-purple-300 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-red-400 hover:text-red-300 text-xs font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-purple-500/20 p-6 space-y-4 bg-gradient-to-r from-slate-900 to-purple-900/20">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total:</span>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Link
                href="/store/checkout"
                className="w-full block text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

