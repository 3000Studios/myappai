'use client';

import { useState } from 'react';

export default function ContentLabPage() {
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const product = {
      name: formData.get('name'),
      description: formData.get('description'),
      audience: formData.get('audience'),
    };

    // Simulate server action call (in real impl this calls a server action wrapping lib/googleAi)
    // For now, we mock the delay to show UI state
    setTimeout(() => {
      setCampaign({
        headlines: ['Generated Headline 1', 'Generated Headline 2'],
        landingPageCopy: 'This is the generated copy for the product...',
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 font-mono">
      <header className="mb-12 border-b border-yellow-500/30 pb-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          CONTENT CREATOR LAB
        </h1>
        <p className="text-gray-400 mt-2">AI-Powered Manufacturing & Distribution Factory</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* INPUT SECTION */}
        <section className="bg-gray-900/50 p-8 rounded-xl border border-white/10">
          <h2 className="text-xl text-yellow-500 mb-6 font-bold">{'/// PRODUCT INPUT'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Product Name</label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Omni-Tool V3"
                className="w-full bg-black border border-gray-700 p-3 rounded focus:border-yellow-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="What does it do? Unique selling proposition?"
                className="w-full bg-black border border-gray-700 p-3 rounded focus:border-yellow-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Target Audience</label>
              <input
                name="audience"
                type="text"
                placeholder="e.g., High-ticket freelancers"
                className="w-full bg-black border border-gray-700 p-3 rounded focus:border-yellow-500 outline-none"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-4 rounded transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">GENERATING CAMPAIGN...</span>
              ) : (
                <>🚀 LAUNCH CAMPAIGN GENERATION</>
              )}
            </button>
          </form>
        </section>

        {/* OUTPUT SECTION */}
        <section className="bg-gray-900/50 p-8 rounded-xl border border-white/10 min-h-[500px]">
          <h2 className="text-xl text-yellow-500 mb-6 font-bold">{'/// GENERATED ASSETS'}</h2>

          {campaign ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Ad Headlines
                </h3>
                <ul className="space-y-2">
                  {campaign.headlines?.map((h: string, i: number) => (
                    <li key={i} className="bg-black/40 p-3 border-l-2 border-yellow-500 text-lg">
                      &quot;{h}&quot;
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Copy Strategy
                </h3>
                <div className="bg-black/40 p-4 border border-white/5 rounded text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {campaign.landingPageCopy}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex gap-4">
                <button className="flex-1 bg-green-900/40 border border-green-500/50 text-green-400 py-3 font-bold hover:bg-green-900/60">
                  PUSH TO GOOGLE PLAY
                </button>
                <button className="flex-1 bg-blue-900/40 border border-blue-500/50 text-blue-400 py-3 font-bold hover:bg-blue-900/60">
                  PUSH TO GUMROAD
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
              <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full animate-spin-slow" />
              <p>AWAITING INPUT DATA</p>
            </div>
          )}
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500">
        <p>3000 STUDIOS // AUTOMATED REVENUE SYSTEM // V1.0</p>
      </div>
    </div>
  );
}

