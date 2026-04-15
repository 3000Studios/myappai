/**
 * Product Grid Component
 * Displays products in a responsive grid layout
 * Features: Hover effects, quick view, add to cart, ultra-luxe styling
 */

'use client';

import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  featured?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: (product: Product) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div
      className="card group relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gold text-black text-xs font-bold rounded-full">
          FEATURED
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass border border-gold/20 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Add to favorites"
      >
        <Heart size={16} className={isFavorite ? 'text-gold fill-gold' : 'text-gray-400'} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-900">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <div className="text-center">
              <div className="w-20 h-20 bg-gold/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <ShoppingCart size={32} className="text-gold" />
              </div>
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button className="w-10 h-10 rounded-full bg-gold text-black hover:bg-platinum transition-colors flex items-center justify-center">
            <Eye size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="w-10 h-10 rounded-full bg-sapphire text-white hover:bg-sapphire/80 transition-colors flex items-center justify-center"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Category */}
        <p className="text-xs text-gold uppercase tracking-wide">{product.category}</p>

        {/* Product Name */}
        <h3 className="text-white font-semibold text-lg line-clamp-2 group-hover:text-gold transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < product.rating! ? 'text-gold fill-gold' : 'text-gray-600'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-white">
            ${product.price}
            <span className="text-sm text-gray-400">.00</span>
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="px-4 py-2 bg-gold/10 border border-gold text-gold rounded-lg hover:bg-gold hover:text-black transition-all text-sm font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

