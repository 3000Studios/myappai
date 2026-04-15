'use client';

import React from 'react';

export default function StoreManagerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic uppercase mb-2">Store Manager</h2>
          <p className="text-gray-400">Inventory and product catalog control.</p>
        </div>
        <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors">
          ADD PRODUCT
        </button>
      </div>

      <div className="bg-zinc-900/50 rounded-3xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500">
              <th className="p-6">Product</th>
              <th className="p-6">Category</th>
              <th className="p-6">Stock</th>
              <th className="p-6">Price</th>
              <th className="p-6">Status</th>
              <th className="p-6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 divide-y divide-white/5">
            <ProductRow
              name="Quantum Core Hoodie"
              category="Apparel"
              stock={142}
              price="$89.00"
              status="active"
            />
            <ProductRow
              name="Void Series Keychain"
              category="Accessories"
              stock={500}
              price="$15.00"
              status="active"
            />
            <ProductRow
              name="Nebula Poster Set"
              category="Art"
              stock={25}
              price="$45.00"
              status="low stock"
            />
            <ProductRow
              name="Titan Desk Mat"
              category="Office"
              stock={0}
              price="$35.00"
              status="out of stock"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductRow({
  name,
  category,
  stock,
  price,
  status,
}: {
  name: string;
  category: string;
  stock: number;
  price: string;
  status: string;
}) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="p-6">
        <div className="font-bold text-white group-hover:underline cursor-pointer">{name}</div>
      </td>
      <td className="p-6 text-sm">{category}</td>
      <td className="p-6 text-sm">{stock}</td>
      <td className="p-6 text-sm font-mono">{price}</td>
      <td className="p-6">
        <span
          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
        >
          {status}
        </span>
      </td>
      <td className="p-6">
        <button className="text-xs font-bold hover:text-white transition-colors">EDIT</button>
      </td>
    </tr>
  );
}
