// Enhanced login form with real-time validation
'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authValidation, ValidationError } from '@/utils/authValidation';

interface LoginFormProps {
  onToggleMode: () => void;
  isRegister: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function EnhancedLoginForm({ onToggleMode, isRegister }: LoginFormProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validation state
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  const { login, register, state } = useAuth();

  // Real-time validation
  useEffect(() => {
    const newErrors: FormErrors = {};
    
    if (isRegister) {
      // Name validation
      if (touched.name) {
        const nameError = authValidation.validateName(formData.name);
        if (nameError) newErrors.name = nameError.message;
      }
      
      // Confirm password validation
      if (touched.confirmPassword) {
        const confirmError = authValidation.validateConfirmPassword(formData.password, formData.confirmPassword);
        if (confirmError) newErrors.confirmPassword = confirmError.message;
      }
    }

    // Email validation
    if (touched.email) {
      const emailError = authValidation.validateEmail(formData.email);
      if (emailError) newErrors.email = emailError.message;
    }

    // Password validation
    if (touched.password) {
      const passwordError = authValidation.validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError.message;
    }

    setErrors(newErrors);

    // Check form validity
    const requiredFields = isRegister 
      ? ['name', 'email', 'password', 'confirmPassword']
      : ['email', 'password'];
    
    const hasAllRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData].trim() !== '');
    const hasNoErrors = Object.keys(newErrors).length === 0;
    
    setIsFormValid(hasAllRequiredFields && hasNoErrors);
  }, [formData, touched, isRegister]);

  // Password strength check
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(authValidation.getPasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation display
    const allFields = isRegister 
      ? ['name', 'email', 'password', 'confirmPassword']
      : ['email', 'password'];
    
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (!isFormValid) return;

    try {
      if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (error) {
      // Error handling is done in the auth hook
    }
  };

  const getFieldIcon = (field: string, hasError: boolean) => {
    if (!touched[field]) return null;
    
    return hasError ? (
      <XCircle size={20} className="text-red-500" />
    ) : (
      <CheckCircle size={20} className="text-green-500" />
    );
  };

  const renderPasswordStrength = () => {
    if (!passwordStrength || !touched.password) return null;

    const { score, label, color, suggestions } = passwordStrength;
    const strengthPercentage = (score / 5) * 100;

    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-600">Password strength:</span>
          <span className={`text-xs font-medium ${color}`}>{label}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              score <= 1 ? 'bg-red-500' :
              score === 2 ? 'bg-orange-500' :
              score === 3 ? 'bg-yellow-500' :
              score === 4 ? 'bg-blue-500' : 'bg-green-500'
            }`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="mt-1 text-xs text-gray-500">
            {suggestions.slice(0, 2).map((suggestion, index) => (
              <li key={index} className="flex items-center gap-1">
                <AlertCircle size={12} />
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isRegister 
              ? 'Join our secure document management platform' 
              : 'Sign in to access your secure workspace'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Name Field (Register only) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 
                    touched.name && !errors.name ? 'border-green-500 focus:ring-green-500' :
                    'border-gray-300 focus:ring-primary-500'
                  }`}
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {getFieldIcon('name', !!errors.name)}
                </div>
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircle size={16} />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 
                  touched.email && !errors.email ? 'border-green-500 focus:ring-green-500' :
                  'border-gray-300 focus:ring-primary-500'
                }`}
                placeholder="Enter your email"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {getFieldIcon('email', !!errors.email)}
              </div>
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle size={16} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 
                  touched.password && !errors.password ? 'border-green-500 focus:ring-green-500' :
                  'border-gray-300 focus:ring-primary-500'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <XCircle size={16} />
                {errors.password}
              </p>
            )}
            {isRegister && renderPasswordStrength()}
          </div>

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 
                    touched.confirmPassword && !errors.confirmPassword ? 'border-green-500 focus:ring-green-500' :
                    'border-gray-300 focus:ring-primary-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <XCircle size={16} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || state.isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              isFormValid && !state.isLoading
                ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {state.isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Error Message */}
          {state.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm flex items-center gap-2">
                <XCircle size={16} />
                {state.error}
              </p>
            </div>
          )}

          {/* Toggle Mode */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary-600 hover:text-primary-800 font-semibold"
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}