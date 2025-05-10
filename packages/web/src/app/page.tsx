'use client';

import KYCValidator from '@/components/KYCValidator';
import Navigation from '@/components/common/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <Navigation />
        <div className="flex items-center justify-center py-8">
          <KYCValidator />
        </div>
      </div>
    </div>
  );
}