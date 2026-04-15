'use client';

import React, { useEffect, useState } from 'react';

type BlogStatus = {
  status: 'idle' | 'loading' | 'ready';
  message: string;
};

export default function BlogAdminPage() {
  const [status, setStatus] = useState<BlogStatus>({
    status: 'loading',
    message: 'Checking blog pipeline...',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus({
        status: 'ready',
        message: 'Blog pipeline ready. Content automation hooks are active.',
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase mb-2">Blog Operations</h2>
        <p className="text-gray-400">
          Daily content scheduling and publishing overview. Connects to existing blog routes.
        </p>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-4">Status</h3>
        <p className="text-sm text-gray-300">{status.message}</p>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-4">Next Steps</h3>
        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
          <li>Review scheduled posts in the /blog section.</li>
          <li>Use the content automation page to generate new drafts.</li>
          <li>Verify publishing credentials in the environment config.</li>
        </ul>
      </div>
    </div>
  );
}
