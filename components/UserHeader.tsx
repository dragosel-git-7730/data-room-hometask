'use client';

import { useState } from 'react';
import { LogOut, User, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserHeader = () => {
  const { state, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!state.user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
          <User size={18} className="text-white" />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
            {state.user.name}
          </p>
          <p className="text-xs text-gray-500">{state.user.email}</p>
        </div>
        <span className={`hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full font-medium ${getRoleColor(state.user.role)}`}>
          {state.user.role}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-large border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 bg-gradient-to-br from-primary-50 to-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{state.user.name}</p>
                <p className="text-sm text-gray-600 truncate">{state.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-primary-600" />
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getRoleColor(state.user.role)}`}>
                {state.user.role.toUpperCase()} ACCESS
              </span>
            </div>
          </div>
          
          <div className="p-2">
            <button className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition-all duration-200 group">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Settings size={16} className="text-gray-600 group-hover:text-primary-600" />
              </div>
              <span>Account Settings</span>
            </button>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <LogOut size={16} className="text-red-600" />
              </div>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserHeader;