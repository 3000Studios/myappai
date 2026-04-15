'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const NavBar3D = dynamic(() => import('@/components/ui/NavBar3D'), { ssr: false });

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Hide all global UI elements on the landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      <NavBar3D />
      {children}
    </>
  );
}

