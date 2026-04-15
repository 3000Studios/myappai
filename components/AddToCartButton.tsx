'use client';

import { useCartStore } from '@/lib/cart-store';
import { Product } from '@/lib/products-data';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
  const _router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
    });

    // Show feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);

    // Optionally redirect to checkout
    // router.push('/store/checkout');
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`w-full px-6 py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
        isAdded
          ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-white shadow-lg shadow-green-500/50'
          : disabled
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
      }`}
    >
      <ShoppingCart size={20} />
      {isAdded ? 'Added to Cart! ✓' : disabled ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}

