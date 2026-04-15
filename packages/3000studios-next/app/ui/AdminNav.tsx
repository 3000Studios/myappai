import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Live Stream', href: '/admin/stream' },
  { label: 'Store Manager', href: '/admin/store-manager' },
  { label: 'Revenue Watcher', href: '/admin/revenue' },
  { label: 'Idea Page', href: '/admin/ideas' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Referral', href: '/admin/referrals' },
  { label: 'Content Automation', href: '/admin/automation' },
  { label: 'Voice Editor', href: '/admin/voice-remote' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="relative z-[100] bg-black/80 backdrop-blur-2xl border-b border-[#D4AF37]/20 w-full">
      <div className="container-standard flex items-center justify-between h-20">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          <Link href="/admin" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 relative rounded-full border border-[#D4AF37] overflow-hidden">
              <Image src="/admin_avatar.png" alt="Admin" fill className="object-cover" />
            </div>
            <span className="text-white font-black tracking-tighter text-lg italic hidden sm:block">
              NEXUS
            </span>
          </Link>

          <div className="flex items-center gap-2 py-2">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href="/"
          className="px-6 py-2 rounded-xl border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all active:scale-95 flex-shrink-0 ml-4"
        >
          Exit
        </Link>
      </div>
    </nav>
  );
}
