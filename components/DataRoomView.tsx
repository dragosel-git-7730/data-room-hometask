'use client';

import React, { useState } from 'react';
import { Folder, FileText, Plus, Upload, Home, ChevronRight, Search, Move, X, Edit2 } from 'lucide-react';
import { useDataRoom } from '@/hooks/useDataRoom';
import { DataRoomItem, File } from '@/types/enhanced';
import { formatFileSize } from '@/utils/storage';
import UserHeader from '@/components/UserHeader';
import { useToast } from '@/components/ui/Toast';
import { FileUpload } from '@/components/ui/FileUpload';
import { DataRoomSkeleton } from '@/components/ui/Skeleton';
import { FilePreview } from '@/components/ui/FilePreview';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const DataRoomView = () => {
  const {
    state,
    currentItems,
    breadcrumb,
    createFolder,
    uploadFile,
    navigateToFolder,
    deleteItem,
    renameItem,
    moveItem,
    searchItems,
  } = useDataRoom();

  const { success, error: showError } = useToast();

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const [previewFile, setPreviewFile] = useState<DataRoomItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCreateFolder = async () => {
    try {
      setError('');
      await createFolder(newFolderName);
      setNewFolderName('');
      setShowCreateFolder(false);
      success('Folder created', `"${newFolderName}" was created successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create folder';
      setError(errorMessage);
      showError('Failed to create folder', errorMessage);
    }
  };

  const handleFileUpload = async (files: globalThis.File[]) => {
    try {
      setError('');
      
      for (const file of files) {
        // Validate file type (PDF only for now)
        if (file.type !== 'application/pdf') {
          throw new Error('Only PDF files are supported');
        }

        await uploadFile({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
      
      success(
        'Files uploaded successfully',
        `${files.length} file${files.length > 1 ? 's' : ''} uploaded`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload files';
      setError(errorMessage);
      showError('Upload failed', errorMessage);
    }
  };

  const handleRename = async (itemId: string) => {
    try {
      setError('');
      await renameItem(itemId, editName);
      setEditingItem(null);
      setEditName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename item');
    }
  };

  const startEditing = (item: DataRoomItem) => {
    setEditingItem(item.id);
    setEditName(item.name);
    setError('');
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
    setError('');
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnterFolder = (folderId: string) => {
    setDragOverFolder(folderId);
  };

  const handleDragLeaveFolder = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetFolderId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedItemId = e.dataTransfer.getData('text/plain') || draggedItem;
    
    if (draggedItemId && draggedItemId !== targetFolderId) {
      // Prevent dropping a folder into itself or its children
      const draggedItemData = state.items.find(item => item.id === draggedItemId);
      if (draggedItemData && targetFolderId) {
        const isDescendant = (parentId: string, childId: string): boolean => {
          let current = state.items.find(item => item.id === childId);
          while (current && current.parentId) {
            if (current.parentId === parentId) return true;
            current = state.items.find(item => item.id === current!.parentId);
          }
          return false;
        };
        
        if (draggedItemData.type === 'folder' && isDescendant(draggedItemId, targetFolderId)) {
          setError('Cannot move a folder into its own subfolder');
          setDraggedItem(null);
          return;
        }
      }
      
      moveItem(draggedItemId, targetFolderId);
      setError('');
    }
    setDraggedItem(null);
    setDragOverFolder(null);
  };

  const handleDropOnEmpty = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleDrop(e, state.currentFolderId);
  };

  const displayItems = searchQuery ? searchItems(searchQuery) : currentItems;

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Folder size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Data Room</h1>
                <p className="text-sm text-gray-500">Secure document management</p>
              </div>
            </div>
            
            {/* Modern Search Bar */}
            <div className="flex-1 max-w-2xl mx-12">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all duration-200 text-sm placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Action Buttons & User */}
            <div className="flex items-center gap-3">
              <FileUpload
                onFilesUploaded={handleFileUpload}
                acceptedTypes={['.pdf', 'application/pdf']}
                maxFileSize={10 * 1024 * 1024}
                maxFiles={5}
                multiple={true}
                className="hidden"
              />
              
              <label className="btn-primary cursor-pointer">
                <Upload size={16} />
                Upload
              </label>
              
              <button
                onClick={() => setShowCreateFolder(true)}
                className="btn-success"
              >
                <Plus size={16} />
                New Folder
              </button>
              
              <div className="w-px h-8 bg-gray-200 mx-2" />
              
              <UserHeader />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Modern Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => navigateToFolder(null)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <Home size={16} />
              Home
            </button>
            
            {breadcrumb.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <ChevronRight size={16} className="text-gray-300 mx-1" />
                <button
                  onClick={() => navigateToFolder(folder.id)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </nav>
          
          {/* Quick Actions */}
          {state.currentFolderId && (
            <button
              onClick={() => setShowCreateFolder(true)}
              className="btn-ghost text-sm"
            >
              <Plus size={14} />
              New Subfolder
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Modern Empty State */}
        {displayItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Folder size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No results found' : 'Empty folder'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No files or folders match "${searchQuery}". Try a different search term.`
                : 'This folder is empty. Start by uploading files or creating new folders to organize your documents.'
              }
            </p>
            {!searchQuery && (
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowCreateFolder(true)}
                  className="btn-primary"
                >
                  <Plus size={18} />
                  Create Folder
                </button>
                <FileUpload
                  onFilesUploaded={handleFileUpload}
                  acceptedTypes={['.pdf', 'application/pdf']}
                  maxFileSize={10 * 1024 * 1024}
                  maxFiles={5}
                  multiple={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Modern Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-large w-full max-w-md transform transition-all duration-200">
              <div className="p-8">
                <div className="w-12 h-12 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus size={24} className="text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Create New Folder</h3>
                <p className="text-gray-500 text-center mb-6">Enter a name for your new folder</p>
                
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="input mb-6"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCreateFolder(false);
                      setNewFolderName('');
                      setError('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Folder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drag Helper */}
        {draggedItem && (
          <div className="fixed top-24 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-large z-50 backdrop-blur-lg">
            <p className="text-sm font-medium">Drop on a folder to move</p>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6 px-1">
            <p className="text-sm text-gray-600 font-medium">
              {displayItems.length} result{displayItems.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {/* Modern Items Grid */}
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          onDragOver={handleDragOver}
          onDrop={handleDropOnEmpty}
        >
          {displayItems.map((item) => (
            <div
              key={item.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={item.type === 'folder' ? handleDragOver : undefined}
              onDragEnter={item.type === 'folder' ? () => handleDragEnterFolder(item.id) : undefined}
              onDragLeave={item.type === 'folder' ? handleDragLeaveFolder : undefined}
              onDrop={item.type === 'folder' ? (e) => handleDrop(e, item.id) : undefined}
              onClick={(e) => {
                // Allow folder opening on card click, but not when clicking on edit input or action buttons
                if (item.type === 'folder' && editingItem !== item.id) {
                  const target = e.target as HTMLElement;
                  // Check if click is on action buttons or input
                  if (!target.closest('button') && !target.closest('input')) {
                    navigateToFolder(item.id);
                  }
                }
              }}
              className={`group relative card p-4 cursor-pointer select-none transition-all duration-200 ${
                draggedItem === item.id ? 'opacity-40 scale-95' : 'hover:scale-[1.02]'
              } ${
                item.type === 'folder' && dragOverFolder === item.id
                  ? 'border-primary-300 bg-primary-50 scale-105 shadow-medium' 
                  : item.type === 'folder' 
                    ? 'hover:border-primary-200 hover:bg-primary-25' 
                    : 'hover:border-gray-200'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {/* Modern Icon */}
                <div className={`mb-3 p-3 rounded-2xl transition-all duration-200 ${
                  item.type === 'folder' 
                    ? 'bg-primary-100 text-primary-600 group-hover:bg-primary-200' 
                    : 'bg-red-100 text-red-600 group-hover:bg-red-200'
                }`}>
                  {item.type === 'folder' ? (
                    <Folder size={24} />
                  ) : (
                    <FileText size={24} />
                  )}
                </div>

                {/* Item Name */}
                {editingItem === item.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-center bg-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(item.id);
                      if (e.key === 'Escape') cancelEditing();
                    }}
                    onBlur={() => handleRename(item.id)}
                  />
                ) : (
                  <h3
                    className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors mb-1 line-clamp-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.type === 'folder') {
                        navigateToFolder(item.id);
                      } else {
                        // Open file preview
                        setPreviewFile(item);
                        setShowPreview(true);
                      }
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      startEditing(item);
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                )}

                {/* File Info */}
                {item.type === 'file' && (
                  <p className="text-xs text-gray-500 font-medium">
                    {formatFileSize((item as File).size)}
                  </p>
                )}

                {/* Modern Action Buttons */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(item);
                    }}
                    className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 shadow-soft"
                    title="Rename"
                  >
                    <Edit2 size={12} className="text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${item.name}"?`)) {
                        deleteItem(item.id);
                      }
                    }}
                    className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-soft"
                    title="Delete"
                  >
                    <X size={12} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* File Preview Modal */}
      <FilePreview
        file={previewFile}
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPreviewFile(null);
        }}
        onDownload={(file) => {
          // Handle download
          console.log('Download file:', file);
        }}
        onShare={(file) => {
          // Handle share
          console.log('Share file:', file);
        }}
      />
    </div>
  );
};

export default DataRoomView;