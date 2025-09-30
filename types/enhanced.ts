// Enhanced types for data room with file metadata
export type DataRoomItemType = 'file' | 'folder';

export interface BaseItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder extends BaseItem {
  type: 'folder';
}

export interface File extends BaseItem {
  type: 'file';
  size: number;
  mimeType: string;
  url?: string;
  thumbnailUrl?: string;
}

export type DataRoomItem = Folder | File;

export interface DataRoomState {
  items: DataRoomItem[];
  currentFolderId: string | null;
}

// File upload types
export interface FileUploadData {
  file: globalThis.File;
  name: string;
  size: number;
  type: string;
}

// Search and filter types
export interface SearchFilter {
  query: string;
  type?: DataRoomItemType;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sizeRange?: {
    min: number;
    max: number;
  };
}

// Permission types
export interface Permission {
  userId: string;
  level: 'read' | 'write' | 'admin';
}

export interface SharedItem {
  id: string;
  itemId: string;
  sharedBy: string;
  sharedWith: string[];
  permissions: Permission[];
  expiresAt?: string;
  createdAt: string;
}

// Activity types
export interface Activity {
  id: string;
  type: 'upload' | 'download' | 'share' | 'delete' | 'rename' | 'move';
  itemId: string;
  userId: string;
  userName: string;
  description: string;
  createdAt: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
  lastSeen?: string;
}

// Collaboration types
export interface Comment {
  id: string;
  itemId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Annotation {
  id: string;
  itemId: string;
  userId: string;
  type: 'highlight' | 'note' | 'drawing';
  position: {
    page?: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  content: string;
  createdAt: string;
}

// Real-time event types
export interface RealTimeEvent {
  type: 'file_uploaded' | 'file_deleted' | 'file_renamed' | 'folder_created' | 'user_online' | 'user_offline';
  data: any;
  userId: string;
  timestamp: string;
}