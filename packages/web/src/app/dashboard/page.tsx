'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';
import SafeNavigation from '@/components/common/SafeNavigation';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SafeNavigation />
      <div className="container mx-auto px-4">
        <DashboardProvider>
          <div className="py-6">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <Dashboard />
            </div>
          </div>
        </DashboardProvider>
      </div>
    </div>
  );
}