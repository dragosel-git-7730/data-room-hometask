// Debug component to show current data room state
'use client';

import React from 'react';
import { useDataRoom } from '@/hooks/useDataRoom';

export function DataRoomDebug() {
  const { state, currentItems, breadcrumb, createFolder } = useDataRoom();

  const testCreateFolder = async () => {
    try {
      console.log('=== MANUAL TEST FOLDER CREATION ===');
      console.log('Before creation - Current folder:', state.currentFolderId);
      console.log('Before creation - Total items:', state.items.length);
      console.log('Before creation - Current items:', currentItems.length);
      
      const newFolder = await createFolder('Debug Test Folder ' + Date.now());
      
      console.log('After creation - Returned folder:', newFolder);
      console.log('After creation - Total items:', state.items.length);
      console.log('After creation - Current items:', currentItems.length);
      
      // Check if the new folder appears in current items
      const foundInCurrent = currentItems.find(item => item.id === newFolder.id);
      console.log('New folder found in current items:', foundInCurrent);
      
      console.log('Manual test folder created successfully');
    } catch (error) {
      console.error('Manual test folder creation failed:', error);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('mockDataRoom');
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold text-green-400 mb-2">🐛 Debug Info</h3>
      
      <div className="space-y-2 mb-4">
        <div>
          <strong>Current Folder:</strong> {state.currentFolderId || 'Root'}
        </div>
        
        <div>
          <strong>Total Items:</strong> {state.items.length}
        </div>
        
        <div>
          <strong>Current Items:</strong> {currentItems.length}
        </div>
        
        <div>
          <strong>Breadcrumb:</strong> {breadcrumb.length > 0 ? breadcrumb.map(f => f.name).join(' > ') : 'Root'}
        </div>
        
        <div>
          <strong>Items in current folder:</strong>
          <ul className="ml-2 mt-1">
            {currentItems.map(item => (
              <li key={item.id} className={item.type === 'folder' ? 'text-blue-300' : 'text-yellow-300'}>
                {item.type === 'folder' ? '📁' : '📄'} {item.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <strong>All Items Structure:</strong>
          <ul className="ml-2 mt-1 max-h-32 overflow-y-auto">
            {state.items.map(item => (
              <li key={item.id} className="text-gray-300">
                {item.type === 'folder' ? '📁' : '📄'} {item.name} 
                <span className="text-gray-500"> (parent: {item.parentId || 'root'})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={testCreateFolder}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          🧪 Test Create Folder
        </button>
        
        <button
          onClick={clearStorage}
          className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          🗑️ Clear Storage & Reload
        </button>
      </div>
    </div>
  );
}