'use client';

export default function AvatarPortal() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <iframe
        src="https://readyplayer.me/avatar"
        className="w-64 h-64 rounded-full border-4 border-yellow-500 shadow-2xl"
        title="AI Avatar"
      />
    </div>
  );
}

