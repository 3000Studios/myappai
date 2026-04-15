'use client';

export default function AdSlot({ slot = 'auto' }: { slot?: string }) {
  return (
    <div className="my-10 border border-yellow-500/20 rounded-lg p-6 text-center bg-black/20 backdrop-blur">
      <div className="text-xs text-gray-500 mb-2">Advertisement</div>
      {/* AdSense will inject here in production */}
      <div className="h-32 flex items-center justify-center text-gray-600">
        <span>Ad Space - {slot}</span>
      </div>
    </div>
  );
}

