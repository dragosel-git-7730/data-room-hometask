'use client';

import React, { useState } from 'react';
import { User, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onToggleMode: () => void;
  isRegister: boolean;
}

const LoginForm = ({ onToggleMode, isRegister }: LoginFormProps) => {
  const { login, register, state } = useAuth();
  const [formData, setFormData] = useState({ 
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        setIsSubmitting(false);
        return;
      }
      if (!formData.name.trim()) {
        setError('Full name is required');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login(formData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // This is now just for debugging, the actual submission is handled by the form
    console.log('Button clicked - form will be submitted via onSubmit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-large border border-white/20 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 shadow-medium">
            <User size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Data Room</h1>
          <p className="text-gray-600">
            {isRegister ? 'Create your account to get started' : 'Sign in to access your documents'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={16} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={state.isLoading || isSubmitting}
            onClick={handleButtonClick}
            className="btn-primary w-full text-base font-medium"
            style={{ padding: '0.875rem 1rem' }}
          >
            {(state.isLoading || isSubmitting) ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={onToggleMode}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            {isRegister 
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        {!isRegister && (
          <div className="mt-6 p-4 bg-primary-25 rounded-xl border border-primary-100">
            <p className="text-sm font-medium text-primary-900 mb-3">Demo Accounts:</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-primary-700 font-medium">Admin</span>
                <code className="bg-white px-2 py-1 rounded text-primary-600">admin@dataroom.com</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-700 font-medium">User</span>
                <code className="bg-white px-2 py-1 rounded text-primary-600">user@dataroom.com</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-primary-700 font-medium">Viewer</span>
                <code className="bg-white px-2 py-1 rounded text-primary-600">viewer@dataroom.com</code>
              </div>
              <p className="text-primary-600 text-center mt-3 font-medium text-xs">
                All passwords: admin123 / user123 / viewer123
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;