import React from "react";
import { Navigation } from "@/components/ui/Navigation";
import { Footer } from "@/components/ui/Footer";
import { PageHeader } from "@/components/ui/PageHeader";

async function fetchDashboardData() {
  // TODO: Replace with real API calls for analytics, traffic, revenue, logs, and system status
  return {
    analytics: {
      visitors: 12894,
      pageViews: 48213,
      bounceRate: 0.37,
      avgSession: "4m 12s",
    },
    revenue: {
      total: 12450.32,
      mrr: 1042.50,
      newCustomers: 23,
    },
    system: {
      status: "ONLINE",
      uptime: "99.998%",
      lastDeploy: "2025-11-29 02:14 UTC",
    },
    logs: [
      { time: "02:14", event: "DEPLOYMENT COMPLETED", status: "success" },
      { time: "01:58", event: "API SYNCHRONIZATION", status: "success" },
      { time: "01:45", event: "USER AUTHENTICATION", status: "success" },
    ],
  };
}

export default async function DashboardPage() {
  const data = await fetchDashboardData();
  return (
    <main className="relative min-h-screen">
      <Navigation />
      
      <PageHeader 
        title="COMMAND CENTER" 
        subtitle="System Analytics & Status" 
      />

      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
          {/* Analytics */}
          <div className="hyper-glass p-8 rounded-sm flex flex-col items-center text-center group hover:border-hologram/30 transition-colors duration-500">
            <h2 className="font-sans text-xs tracking-[0.2em] text-platinum/50 mb-6 uppercase">Analytics</h2>
            <div className="font-display text-5xl text-white mb-2 group-hover:text-hologram transition-colors">{data.analytics.visitors.toLocaleString()}</div>
            <div className="font-sans text-xs text-platinum/40 mb-6 tracking-widest">VISITORS</div>
            
            <div className="w-full space-y-2 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs font-sans tracking-widest">
                    <span className="text-platinum/40">PAGE VIEWS</span>
                    <span className="text-white">{data.analytics.pageViews.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-sans tracking-widest">
                    <span className="text-platinum/40">BOUNCE RATE</span>
                    <span className="text-white">{(data.analytics.bounceRate * 100).toFixed(1)}%</span>
                </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="hyper-glass p-8 rounded-sm flex flex-col items-center text-center group hover:border-hologram/30 transition-colors duration-500">
            <h2 className="font-sans text-xs tracking-[0.2em] text-platinum/50 mb-6 uppercase">Revenue</h2>
            <div className="font-display text-5xl text-white mb-2 group-hover:text-hologram transition-colors">${data.revenue.total.toLocaleString(undefined, {minimumFractionDigits:0})}</div>
            <div className="font-sans text-xs text-platinum/40 mb-6 tracking-widest">TOTAL REVENUE</div>
            
            <div className="w-full space-y-2 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs font-sans tracking-widest">
                    <span className="text-platinum/40">MRR</span>
                    <span className="text-white">${data.revenue.mrr.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                </div>
                <div className="flex justify-between text-xs font-sans tracking-widest">
                    <span className="text-platinum/40">NEW CLIENTS</span>
                    <span className="text-white">{data.revenue.newCustomers}</span>
                </div>
            </div>
          </div>

          {/* System Status */}
          <div className="hyper-glass p-8 rounded-sm flex flex-col items-center text-center group hover:border-hologram/30 transition-colors duration-500">
            <h2 className="font-sans text-xs tracking-[0.2em] text-platinum/50 mb-6 uppercase">System Status</h2>
            <div className="font-display text-5xl text-white mb-2 group-hover:text-hologram transition-colors">{data.system.status}</div>
            <div className="font-sans text-xs text-platinum/40 mb-6 tracking-widest">OPERATIONAL</div>
            
            <div className="w-full space-y-2 border-t border-white/5 pt-6">
                <div className="flex justify-between text-xs font-sans tracking-widest">
                    <span className="text-platinum/40">UPTIME</span>
                    <span className="text-white">{data.system.uptime}</span>
                </div>
                <div className="flex justify-between text-xs font-sans tracking-widest">
                    <span className="text-platinum/40">LAST DEPLOY</span>
                    <span className="text-white truncate ml-4">{data.system.lastDeploy.split(' ')[0]}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="w-full max-w-3xl mx-auto hyper-glass p-8 rounded-sm">
          <h2 className="font-sans text-xs tracking-[0.2em] text-platinum/50 mb-6 uppercase">System Logs</h2>
          <ul className="space-y-4">
            {data.logs.map((log, idx) => (
              <li key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="font-mono text-xs text-hologram">{log.time}</span>
                <span className="font-sans text-xs tracking-widest text-white/80">{log.event}</span>
                <span className={`font-mono text-[10px] uppercase tracking-widest ${log.status === "success" ? "text-green-400" : "text-red-400"}`}>
                    [{log.status}]
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}

