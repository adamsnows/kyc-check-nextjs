'use client';

import KYCValidator from '@/components/KYCValidator';
import SafeNavigation from '@/components/common/SafeNavigation';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <SafeNavigation />
        <div className="flex items-center justify-center py-8">
          <KYCValidator />
        </div>
      </div>
    </div>
  );
}