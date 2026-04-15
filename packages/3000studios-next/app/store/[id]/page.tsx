import { AddToCartButton } from '@/components/AddToCartButton';
import { ProductCard } from '@/components/ProductCard';
import { getProductById, getProducts } from '@/lib/products-data';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | 3000 Studios Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  // Get related products (same category, different product)
  const allProducts = getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Home
          </Link>
          <span className="text-purple-500/40">/</span>
          <Link href="/store" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Store
          </Link>
          <span className="text-purple-500/40">/</span>
          <span className="text-purple-300/80 font-semibold">{product.name}</span>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-cyan-600/20 text-6xl">
                  📦
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-sm font-semibold rounded-full mb-6 w-fit border border-cyan-500/30 backdrop-blur-sm">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-purple-500/20">
              <span className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-purple-300/40 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-lg text-purple-200/80 mb-8 leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-8 flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-purple-500/20 w-fit">
              {product.inStock ? (
                <>
                  <span className="inline-block w-3 h-3 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full animate-pulse"></span>
                  <span className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    In Stock
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-lg font-semibold text-red-400">Out of Stock</span>
                </>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8 p-6 rounded-lg bg-slate-800/30 border border-purple-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-cyan-400 font-bold text-lg mt-1">✓</span>
                      <span className="text-purple-200/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-8 p-6 rounded-lg bg-slate-800/30 border border-purple-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-purple-300 mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-3">
                      <dt className="font-semibold text-cyan-400 min-w-[150px]">{key}</dt>
                      <dd className="text-purple-200/80">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-purple-300/80 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <AddToCartButton product={product} disabled={!product.inStock} />
              <Link
                href="/store"
                className="block text-center px-6 py-3 border-2 border-purple-500/30 text-purple-300 font-semibold rounded-lg hover:border-purple-400 hover:text-purple-200 transition-all backdrop-blur-sm"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Info */}
            <div className="mt-12 pt-8 border-t border-purple-500/20 space-y-4 text-sm text-purple-300/80">
              <p className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Instant digital delivery
              </p>
              <p className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Lifetime updates included
              </p>
              <p className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> 30-day money-back guarantee
              </p>
              <p className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span> Secure PayPal & Stripe checkout
              </p>
            </div>
          </div>
        </div>

        {/* Video Demo Section */}
        <div className="mt-16 pt-12 border-t border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-2">Product Demo</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-400 mb-8"></div>
          <div className="relative aspect-video rounded-xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Watch Product Demo</h3>
              <p className="text-purple-300/80">See {product.name} in action</p>
              <p className="text-purple-400/60 text-sm mt-4">Demo video coming soon</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16 pt-12 border-t border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-2">What Customers Say</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-pink-400 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Sarah M.',
                rating: 5,
                text: 'Absolutely game-changing! Worth every penny and more.',
                role: 'Content Creator',
              },
              {
                name: 'Mike T.',
                rating: 5,
                text: "Best investment I've made for my business this year.",
                role: 'Entrepreneur',
              },
              {
                name: 'Emily R.',
                rating: 5,
                text: 'Incredible value. The quality exceeded my expectations.',
                role: 'Designer',
              },
              {
                name: 'David L.',
                rating: 5,
                text: 'Support is amazing and the product delivers as promised.',
                role: 'Developer',
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-900/50 to-purple-900/30 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-purple-200 mb-4 italic">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold">{review.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{review.name}</p>
                    <p className="text-purple-400 text-xs">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-2">You May Also Like</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-pink-400 mb-8"></div>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          ) : (
            <p className="text-purple-300/60">More products coming soon</p>
          )}
        </div>
      </div>
    </div>
  );
}
