'use client';

import { Product } from '@/lib/products-data';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-xl overflow-hidden h-full flex flex-col border border-purple-500/20 bg-gradient-to-br from-slate-900 to-slate-800 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/10 group">
      {/* Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-slate-800 to-purple-900 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-cyan-600/20 text-white text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category Badge */}
        {product.category && (
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-xs font-semibold rounded-full mb-3 w-fit border border-cyan-500/30">
            {product.category}
          </span>
        )}

        {/* Name */}
        <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">{product.name}</h3>

        {/* Description */}
        <p className="text-purple-300/70 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>

        {/* Pricing */}
        <div className="flex flex-col mb-4">
          <div className="mb-1">
            <span className="inline-block px-1.5 py-0.5 text-[9px] uppercase font-black tracking-tighter bg-red-600 text-white rounded animate-pulse">
              Limited Time Offer
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-purple-400/40 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {product.inStock ? (
          <span className="text-sm text-cyan-400 font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            In Stock
          </span>
        ) : (
          <span className="text-sm text-red-400 font-semibold mb-4">Out of Stock</span>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-purple-500/20">
          <Link
            href={`/store/${product.id}`}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 font-semibold rounded-lg hover:from-purple-500/30 hover:to-cyan-500/30 transition-all text-center text-sm border border-purple-500/20"
          >
            Details
          </Link>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2">
            <ShoppingCart size={16} />
            <span className="hidden sm:inline text-sm">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

