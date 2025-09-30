// Breadcrumb navigation component for folder hierarchy
'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Folder } from '@/types/enhanced';

interface BreadcrumbProps {
  path: Folder[];
  onNavigate: (folderId: string | null) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 hover:text-gray-900 transition-colors"
      >
        <Home size={16} />
        <span>Home</span>
      </button>
      
      {path.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight size={16} className="text-gray-400" />
          <button
            onClick={() => onNavigate(folder.id)}
            className={`hover:text-gray-900 transition-colors ${
              index === path.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {folder.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}