'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/Toast';
import { DataRoomProvider } from '@/hooks/useDataRoom';
import DataRoomView from '@/components/DataRoomView';
import LoginForm from '@/components/LoginForm';

const AppContent = () => {
  const { state } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Data Room</h3>
          <p className="text-gray-600">Preparing your secure workspace...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <LoginForm 
        onToggleMode={() => setIsRegister(!isRegister)}
        isRegister={isRegister}
      />
    );
  }

  return (
    <DataRoomProvider>
      <DataRoomView />
    </DataRoomProvider>
  );
};

export default function Home() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-25">
          <AppContent />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}