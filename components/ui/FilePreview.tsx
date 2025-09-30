// File preview modal component with PDF viewer
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Download, Share2, RotateCw, ZoomIn, ZoomOut, Eye, FileText, ImageIcon, Video, Music } from 'lucide-react';
import { DataRoomItem, File } from '@/types/enhanced';

interface FilePreviewProps {
  file: DataRoomItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (file: DataRoomItem) => void;
  onShare?: (file: DataRoomItem) => void;
}

export function FilePreview({ file, isOpen, onClose, onDownload, onShare }: FilePreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && file) {
      setIsLoading(true);
      setZoom(100);
      setRotation(0);
      // Simulate loading time
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, file]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText size={48} className="text-red-500" />;
    if (mimeType.includes('image')) return <ImageIcon size={48} className="text-blue-500" />;
    if (mimeType.includes('video')) return <Video size={48} className="text-purple-500" />;
    if (mimeType.includes('audio')) return <Music size={48} className="text-green-500" />;
    return <FileText size={48} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileContent = () => {
    if (!file) return null;

    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading preview...</p>
          </div>
        </div>
      );
    }

    // PDF Preview (using iframe for demo - in production use PDF.js)
    if (file.type === 'file' && (file as File).mimeType === 'application/pdf') {
      return (
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <div 
            className="w-full h-full flex items-center justify-center bg-white"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          >
            {/* Demo PDF preview - replace with actual PDF viewer */}
            <div className="w-full max-w-2xl h-full bg-white border-2 border-gray-200 rounded-lg p-8 shadow-inner">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-32 bg-gray-100 rounded mt-8"></div>
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Image Preview
    if (file.type === 'file' && (file as File).mimeType.startsWith('image/')) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg">
          <div 
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <img 
              src={`/api/files/${file.id}/preview`} 
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              onError={(e) => {
                // Fallback to placeholder
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEyNSA3NUwxNzUgMTI1SDI1TDc1IDc1TDEwMCAxMDBaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
              }}
            />
          </div>
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {getFileIcon(file.type === 'file' ? (file as File).mimeType : 'folder')}
          <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{file.name}</h3>
          <p className="text-gray-600 mb-4">Preview not available for this file type</p>
          <button 
            onClick={() => onDownload?.(file)}
            className="btn-primary"
          >
            <Download size={16} />
            Download to View
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen || !file) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="bg-white rounded-2xl shadow-large w-full max-w-6xl h-full max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {getFileIcon(file.type === 'file' ? (file as File).mimeType : 'folder')}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {file.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{file.type === 'file' ? formatFileSize((file as File).size) : '0 Bytes'}</span>
                <span>•</span>
                <span>{new Date(file.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controls for images and PDFs */}
            {file.type === 'file' && ((file as File).mimeType.startsWith('image/') || (file as File).mimeType === 'application/pdf') && (
              <>
                <button
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  className="btn-ghost p-2"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="btn-ghost p-2"
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="btn-ghost p-2"
                  title="Rotate"
                >
                  <RotateCw size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2" />
              </>
            )}

            {onShare && (
              <button
                onClick={() => onShare(file)}
                className="btn-ghost p-2"
                title="Share"
              >
                <Share2 size={18} />
              </button>
            )}
            
            {onDownload && (
              <button
                onClick={() => onDownload(file)}
                className="btn-ghost p-2"
                title="Download"
              >
                <Download size={18} />
              </button>
            )}

            <button
              onClick={onClose}
              className="btn-ghost p-2 text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {renderFileContent()}
        </div>

        {/* Footer with file info */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <p className="font-medium text-gray-900">
                {file.type === 'file' ? (file as File).mimeType : 'Folder'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Size:</span>
              <p className="font-medium text-gray-900">
                {file.type === 'file' ? formatFileSize((file as File).size) : '--'}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <p className="font-medium text-gray-900">
                {new Date(file.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Modified:</span>
              <p className="font-medium text-gray-900">
                {new Date(file.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}