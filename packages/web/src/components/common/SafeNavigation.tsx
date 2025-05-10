'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Importar ThemeToggle dinamicamente para evitar SSR
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
  loading: () => <div className="w-5 h-5"></div>
});

interface NavItemProps {
  href: string;
  text: string;
  active: boolean;
}

function NavItem({ href, text, active }: NavItemProps) {
  return (
    <Link href={href} className={`px-4 py-2 rounded-md ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      {text}
    </Link>
  );
}

export default function SafeNavigation() {
  const pathname = usePathname();

  return (
    <div className="py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
      <div className="flex space-x-2 items-center">
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center">
          <img src="/kyc-icon.png" alt="KYC Logo" className="h-8 w-8 mr-2" />
          KYC System
        </Link>

        <div className="hidden md:flex space-x-2 ml-6">
          <NavItem href="/" text="Validação" active={pathname === '/'} />
          <NavItem href="/dashboard" text="Dashboard" active={pathname === '/dashboard'} />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
