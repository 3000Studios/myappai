'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-black italic uppercase mb-2">Settings</h2>
        <p className="text-gray-400">Global system configuration and API integrations.</p>
      </div>

      <div className="space-y-12">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/5 pb-2">
            Admin Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
              <input
                type="text"
                defaultValue="3KAI Administrator"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">Email Address</label>
              <input
                type="email"
                defaultValue="mr.jwswain@gmail.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/30"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/5 pb-2">
            Integrations
          </h3>
          <div className="space-y-4">
            <IntegrationItem name="Stripe" status="Connected" />
            <IntegrationItem name="PayPal" status="Connected" />
            <IntegrationItem name="ElevenLabs (Voice)" status="Connected" />
            <IntegrationItem name="Vercel Autodeploy" status="Connected" />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-white/5 pb-2">
            Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div>
                <div className="text-sm font-bold">2-Factor Authentication</div>
                <div className="text-xs text-gray-500">Secure your account with 2FA</div>
              </div>
              <div className="w-10 h-5 bg-green-500 rounded-full relative p-1 cursor-pointer">
                <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-8">
          <button className="bg-white text-black px-8 py-3 rounded-full font-black italic uppercase hover:bg-gray-200 transition-colors">
            SAVE CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
}

function IntegrationItem({ name, status }: { name: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
      <span className="text-sm font-bold">{name}</span>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold uppercase text-green-500">{status}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-600 group-hover:text-white transition-colors"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  );
}
