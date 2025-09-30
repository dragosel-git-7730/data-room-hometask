'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { DataRoomProvider } from '@/hooks/useDataRoom';
import DataRoomView from '@/components/DataRoomView';
import EnhancedLoginForm from '@/components/EnhancedLoginForm';
import LoginForm from '@/components/LoginForm';
import EnhancedApp from '@/components/EnhancedApp';
import '@/styles/globals.css';

const AppContent = () => {
  const { state } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  console.log('App authentication state:', state);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-medium">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Data Room</h3>
          <p className="text-gray-600">Preparing your secure workspace...</p>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <EnhancedLoginForm 
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}