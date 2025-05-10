'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';
import Navigation from '@/components/common/Navigation';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <Navigation />
        <DashboardProvider>
          <div className="py-8">
            <Dashboard />
          </div>
        </DashboardProvider>
      </div>
    </div>
  );
}
