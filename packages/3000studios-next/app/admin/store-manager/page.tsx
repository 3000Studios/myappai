'use client';

import { motion } from 'framer-motion';
import { Package, ShoppingCart, TrendingUp, Plus } from 'lucide-react';
import Card from '../../ui/Card';

export default function StoreManager() {
  return (
    <div className="container-standard py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Store Manager
            </h1>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em]">
              Inventory & Revenue Control
            </p>
          </div>
          <button className="px-6 py-2 bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
            <Plus size={14} /> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={ShoppingCart} label="Total Sales" value="$12,450" sub="+12% this month" />
          <PackageCard icon={Package} label="Active Products" value="42" sub="5 Out of Stock" />
          <StatCard icon={TrendingUp} label="Conversion Rate" value="3.8%" sub="Above average" />
        </div>

        <Card className="bg-white/5 border-white/10 p-8">
          <h2 className="text-white font-black uppercase tracking-widest text-sm mb-6">
            Product Catalog
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
                  <th className="pb-4">Product</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Stock</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white/60 text-xs">
                <ProductRow name="Elite Digital Pass" cat="Digital" price="$99.00" stock="∞" />
                <ProductRow name="Quantum Studio 3D" cat="Software" price="$299.00" stock="12" />
                <ProductRow
                  name="Creative Consultation"
                  cat="Service"
                  price="$150/hr"
                  stock="Available"
                />
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="bg-white/5 border-white/5 p-6 flex flex-col items-center group hover:border-[#D4AF37]/30 transition-all">
      <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-[#D4AF37]" size={18} />
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">
        {label}
      </span>
      <span className="text-xl font-black text-white italic tracking-tighter mb-1">{value}</span>
      <span className="text-[8px] font-bold text-green-500 tracking-widest uppercase">{sub}</span>
    </Card>
  );
}

function PackageCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="bg-white/5 border-white/5 p-6 flex flex-col items-center group hover:border-[#D4AF37]/30 transition-all">
      <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-[#D4AF37]" size={18} />
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">
        {label}
      </span>
      <span className="text-xl font-black text-white italic tracking-tighter mb-1">{value}</span>
      <span className="text-[8px] font-bold text-red-500 tracking-widest uppercase">{sub}</span>
    </Card>
  );
}

function ProductRow({ name, cat, price, stock }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-4 font-bold text-white">{name}</td>
      <td className="py-4">{cat}</td>
      <td className="py-4">{price}</td>
      <td className="py-4">{stock}</td>
      <td className="py-4 text-right">
        <button className="text-[#D4AF37] hover:underline uppercase font-bold text-[10px]">
          Edit
        </button>
      </td>
    </tr>
  );
}
