'use client'

export default function StoreManager() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Shopify Store Manager</h1>
      <div className="h-[70vh]">
        <iframe
          src="https://admin.shopify.com/store/3000-studios/themes?appLoadId=9624f85b-f325-4596-926e-9c87db6a0b2f"
          className="w-full h-full border-0"
          title="Shopify Admin"
        />
      </div>
    </div>
  )
}

