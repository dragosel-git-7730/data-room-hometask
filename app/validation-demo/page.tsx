'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/ui/Toast';
import EnhancedLoginForm from '@/components/EnhancedLoginForm';

export default function ValidationDemo() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <ToastProvider>
      <AuthProvider>
        <div className="min-h-screen">
          <EnhancedLoginForm 
            onToggleMode={() => setIsRegister(!isRegister)}
            isRegister={isRegister}
          />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}