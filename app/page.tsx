'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/Toast';
import { DataRoomProvider } from '@/hooks/useDataRoom';
import DataRoomView from '@/components/DataRoomView';
import EnhancedLoginForm from '@/components/EnhancedLoginForm';

function AppContent() {
  const { state } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  console.log('App authentication state:', state);

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
}

export default function Home() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}