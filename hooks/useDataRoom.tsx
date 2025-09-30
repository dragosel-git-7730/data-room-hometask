'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { DataRoomItem, File, Folder, DataRoomState } from '@/types/enhanced';
import { mockBackend } from '@/services/mockBackend';

interface DataRoomContextValue {
  state: DataRoomState;
  currentItems: DataRoomItem[];
  breadcrumb: Folder[];
  createFolder: (name: string) => Promise<Folder>;
  uploadFile: (fileData: { file: globalThis.File; name: string; size: number; type: string }) => Promise<void>;
  navigateToFolder: (folderId: string | null) => void;
  deleteItem: (itemId: string) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<void>;
  moveItem: (itemId: string, targetFolderId: string | null) => Promise<void>;
  searchItems: (query: string) => DataRoomItem[];
  refreshItems: () => Promise<void>;
}

type DataRoomAction =
  | { type: 'SET_ITEMS'; payload: DataRoomItem[] }
  | { type: 'SET_CURRENT_FOLDER'; payload: string | null }
  | { type: 'ADD_ITEM'; payload: DataRoomItem }
  | { type: 'UPDATE_ITEM'; payload: DataRoomItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: DataRoomState & { isLoading: boolean } = {
  items: [],
  currentFolderId: null,
  isLoading: false,
};

function dataRoomReducer(
  state: DataRoomState & { isLoading: boolean }, 
  action: DataRoomAction
): DataRoomState & { isLoading: boolean } {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false };
    case 'SET_CURRENT_FOLDER':
      return { ...state, currentFolderId: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const DataRoomContext = createContext<DataRoomContextValue | undefined>(undefined);

interface DataRoomProviderProps {
  children: ReactNode;
}

export function DataRoomProvider({ children }: DataRoomProviderProps) {
  const [state, dispatch] = useReducer(dataRoomReducer, initialState);

  const loadItems = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const allItems = await mockBackend.getItems(null);
      dispatch({ type: 'SET_ITEMS', payload: allItems });
    } catch (error) {
      console.error('Failed to load items:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const refreshItems = async () => {
    await loadItems();
  };

  // Load initial data ONLY on mount, not on folder change
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const createFolder = async (name: string) => {
    try {
      const parentId = state.currentFolderId;
      const newFolder = await mockBackend.createFolder(name, parentId);
      dispatch({ type: 'ADD_ITEM', payload: newFolder });
      return newFolder;
    } catch (error) {
      console.error('Failed to create folder:', error);
      throw error;
    }
  };

  const uploadFile = async (fileData: {
    file: globalThis.File;
    name: string;
    size: number;
    type: string;
  }) => {
    try {
      const newFile = await mockBackend.uploadFile({
        file: fileData.file,
        name: fileData.name,
        parentId: state.currentFolderId,
      });
      dispatch({ type: 'ADD_ITEM', payload: newFile });
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  };

  const navigateToFolder = (folderId: string | null) => {
    dispatch({ type: 'SET_CURRENT_FOLDER', payload: folderId });
  };

  const deleteItem = async (itemId: string) => {
    try {
      await mockBackend.deleteItem(itemId);
      
      // Remove item and all its children from state
      const removeRecursively = (id: string) => {
        const children = state.items.filter(item => item.parentId === id);
        children.forEach(child => removeRecursively(child.id));
        dispatch({ type: 'REMOVE_ITEM', payload: id });
      };
      
      removeRecursively(itemId);
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  };

  const renameItem = async (itemId: string, newName: string) => {
    try {
      const updatedItem = await mockBackend.renameItem(itemId, newName);
      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    } catch (error) {
      console.error('Failed to rename item:', error);
      throw error;
    }
  };

  const moveItem = async (itemId: string, targetFolderId: string | null) => {
    try {
      const updatedItem = await mockBackend.moveItem(itemId, targetFolderId);
      dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    } catch (error) {
      console.error('Failed to move item:', error);
      throw error;
    }
  };

  const searchItems = (query: string): DataRoomItem[] => {
    if (!query.trim()) return currentItems;
    
    const lowerQuery = query.toLowerCase();
    return state.items.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  };

  // Get current folder items
  const currentItems = state.items.filter(item => item.parentId === state.currentFolderId);

  // Get breadcrumb path
  const breadcrumb = mockBackend.getBreadcrumb(state.currentFolderId);

  const value: DataRoomContextValue = {
    state: {
      items: state.items,
      currentFolderId: state.currentFolderId,
    },
    currentItems,
    breadcrumb,
    createFolder,
    uploadFile,
    navigateToFolder,
    deleteItem,
    renameItem,
    moveItem,
    searchItems,
    refreshItems,
  };

  return (
    <DataRoomContext.Provider value={value}>
      {children}
    </DataRoomContext.Provider>
  );
}

export function useDataRoom() {
  const context = useContext(DataRoomContext);
  if (context === undefined) {
    throw new Error('useDataRoom must be used within a DataRoomProvider');
  }
  return context;
}