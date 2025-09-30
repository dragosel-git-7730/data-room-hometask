export interface DataItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder extends DataItem {
  type: 'folder';
}

export interface FileItem extends DataItem {
  type: 'file';
  size: number;
  mimeType: string;
  content?: string; // Base64 encoded content for browser storage
}

export type DataRoomItem = Folder | FileItem;

export interface DataRoomState {
  items: DataRoomItem[];
  currentFolderId: string | null;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}