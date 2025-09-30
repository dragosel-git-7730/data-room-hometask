import { DataRoomItem, DataRoomState } from '@/types';

const STORAGE_KEY = 'dataroom-state';

export class DataRoomStorage {
  static save(state: DataRoomState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static load(): DataRoomState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.items = parsed.items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    
    return {
      items: [],
      currentFolderId: null,
    };
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name cannot be empty';
  }
  
  if (name.length > 255) {
    return 'Name is too long (max 255 characters)';
  }
  
  const invalidChars = /[<>:"/\\|?*]/g;
  if (invalidChars.test(name)) {
    return 'Name contains invalid characters';
  }
  
  return null;
};