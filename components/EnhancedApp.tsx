// Enhanced main app component with all providers
'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { DataRoomProvider } from '@/hooks/useDataRoom';
import { ToastProvider } from '@/components/ui/Toast';
import LoginForm from '@/components/LoginForm';
import DataRoomView from '@/components/DataRoomView';

// Main App Content Component
function AppContent() {
  const { state } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

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
}

// Enhanced App with all providers
export default function EnhancedApp() {
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