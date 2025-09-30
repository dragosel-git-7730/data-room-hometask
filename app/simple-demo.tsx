// Simple working demo without complex provider issues
'use client';

import React, { useState } from 'react';
import { Folder, FileText, Upload, Plus, Search, User, LogOut } from 'lucide-react';

// Simple mock data
const initialData = [
  { id: 'folder-1', name: 'Documents', type: 'folder', parentId: null },
  { id: 'folder-2', name: 'Projects', type: 'folder', parentId: null },
  { id: 'file-1', name: 'Sample.pdf', type: 'file', parentId: 'folder-1', size: 1024000 },
];

export default function SimpleDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState(initialData);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@dataroom.com' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Use: admin@dataroom.com / admin123');
    }
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        type: 'folder',
        parentId: currentFolder,
      };
      setItems([...items, newFolder]);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };

  const currentItems = items.filter(item => item.parentId === currentFolder);
  const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Folder size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Data Room</h1>
            <p className="text-gray-600">Secure Document Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@dataroom.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin123"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 transition-all duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
            <p className="text-sm text-blue-600">admin@dataroom.com / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <Folder size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Data Room</h1>
              <p className="text-sm text-gray-500">Working Demo</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={16} />
              Admin User
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {currentFolder && (
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Back to Root
                </button>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {currentFolder ? 'Folder Contents' : 'All Files & Folders'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={16} />
                New Folder
              </button>
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                <Upload size={16} />
                Upload
              </button>
            </div>
          </div>

          {/* Create Folder Modal */}
          {showCreateFolder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Folder name"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCreateFolder(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createFolder}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* File Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (item.type === 'folder') {
                    setCurrentFolder(item.id);
                  }
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'folder' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    {item.type === 'folder' ? (
                      <Folder size={20} className="text-blue-600" />
                    ) : (
                      <FileText size={20} className="text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    {item.type === 'file' && (
                      <p className="text-sm text-gray-500">{formatFileSize(item.size)}</p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {item.type === 'folder' ? 'Folder' : 'PDF Document'}
                </div>
              </div>
            ))}
          </div>

          {currentItems.length === 0 && (
            <div className="text-center py-12">
              <Folder size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-4">
                {currentFolder ? 'This folder is empty' : 'Create your first folder or upload a file'}
              </p>
              <button
                onClick={() => setShowCreateFolder(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Create Folder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success notification area */}
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-300" id="success-toast">
        ✅ Action completed successfully!
      </div>
    </div>
  );
}