// Complete mock backend service that actually works
import { DataRoomItem, File, Folder } from '@/types/enhanced';

// In-memory storage (in real app, this would be a database)
let mockData = {
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@dataroom.com',
      role: 'admin',
      password: 'admin123',
    },
    {
      id: '2',
      name: 'Regular User',
      email: 'user@dataroom.com',
      role: 'user',
      password: 'user123',
    },
    {
      id: '3',
      name: 'Viewer User',
      email: 'viewer@dataroom.com',
      role: 'viewer',
      password: 'viewer123',
    },
  ],
  items: [
    {
      id: 'folder-1',
      name: 'Documents',
      type: 'folder' as const,
      parentId: null,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'folder-2',
      name: 'Projects',
      type: 'folder' as const,
      parentId: null,
      createdAt: '2024-01-16T11:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
    },
    {
      id: 'folder-3',
      name: 'Legal Documents',
      type: 'folder' as const,
      parentId: 'folder-1',
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
    },
    {
      id: 'file-1',
      name: 'Sample Document.pdf',
      type: 'file' as const,
      parentId: 'folder-1',
      size: 1024000,
      mimeType: 'application/pdf',
      url: '/api/files/file-1/download',
      thumbnailUrl: '/api/files/file-1/thumbnail',
      createdAt: '2024-01-18T13:00:00Z',
      updatedAt: '2024-01-18T13:00:00Z',
    },
    {
      id: 'file-2',
      name: 'Project Proposal.pdf',
      type: 'file' as const,
      parentId: 'folder-2',
      size: 2048000,
      mimeType: 'application/pdf',
      url: '/api/files/file-2/download',
      thumbnailUrl: '/api/files/file-2/thumbnail',
      createdAt: '2024-01-19T14:00:00Z',
      updatedAt: '2024-01-19T14:00:00Z',
    },
    {
      id: 'file-3',
      name: 'Contract.pdf',
      type: 'file' as const,
      parentId: 'folder-3',
      size: 512000,
      mimeType: 'application/pdf',
      url: '/api/files/file-3/download',
      thumbnailUrl: '/api/files/file-3/thumbnail',
      createdAt: '2024-01-20T15:00:00Z',
      updatedAt: '2024-01-20T15:00:00Z',
    },
  ] as DataRoomItem[],
  currentUser: null as any,
};

// Save to localStorage for persistence
const saveData = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('mockDataRoom', JSON.stringify(mockData));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    }
  }
};

// Load from localStorage
const loadData = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem('mockDataRoom');
      if (saved) {
        mockData = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load saved data, using defaults:', error);
    }
  }
};

// Initialize only on client side
if (typeof window !== 'undefined') {
  loadData();
}

// Utility functions
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockBackend = {
  // Authentication
  async login(credentials: { email: string; password: string }) {
    await delay(800); // Simulate network delay
    
    const user = mockData.users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    mockData.currentUser = user;
    saveData();
    
    return {
      token: `mock_token_${user.id}_${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async register(userData: { name: string; email: string; password: string }) {
    await delay(1000);
    
    const existingUser = mockData.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      role: 'user',
      password: userData.password,
    };
    
    mockData.users.push(newUser);
    mockData.currentUser = newUser;
    saveData();
    
    return {
      token: `mock_token_${newUser.id}_${Date.now()}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  },

  async validateToken() {
    await delay(200);
    if (!mockData.currentUser) {
      throw new Error('Invalid token');
    }
    return {
      id: mockData.currentUser.id,
      name: mockData.currentUser.name,
      email: mockData.currentUser.email,
      role: mockData.currentUser.role,
    };
  },

  // Data Room Operations
  async getItems(parentId: string | null = null): Promise<DataRoomItem[]> {
    await delay(300);
    
    // Load fresh data from localStorage to ensure we have latest changes
    if (typeof window !== 'undefined') {
      loadData();
    }
    
    return mockData.items.filter(item => item.parentId === parentId);
  },

  async createFolder(name: string, parentId: string | null = null): Promise<Folder> {
    await delay(500);
    
    const newFolder: Folder = {
      id: generateId(),
      name,
      type: 'folder',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockData.items.push(newFolder);
    saveData();
    
    return newFolder;
  },

  async uploadFile(fileData: { 
    file: globalThis.File; 
    name: string; 
    parentId: string | null; 
  }): Promise<File> {
    await delay(1500); // Simulate upload time
    
    const newFile: File = {
      id: generateId(),
      name: fileData.name,
      type: 'file',
      parentId: fileData.parentId,
      size: fileData.file.size,
      mimeType: fileData.file.type,
      url: `/api/files/${generateId()}/download`,
      thumbnailUrl: `/api/files/${generateId()}/thumbnail`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockData.items.push(newFile);
    saveData();
    
    return newFile;
  },

  async renameItem(id: string, newName: string): Promise<DataRoomItem> {
    await delay(400);
    
    const item = mockData.items.find(item => item.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    item.name = newName;
    item.updatedAt = new Date().toISOString();
    saveData();
    
    return item;
  },

  async deleteItem(id: string): Promise<void> {
    await delay(600);
    
    const deleteRecursively = (itemId: string) => {
      // Find all children
      const children = mockData.items.filter(item => item.parentId === itemId);
      
      // Delete children first
      children.forEach(child => deleteRecursively(child.id));
      
      // Delete the item itself
      mockData.items = mockData.items.filter(item => item.id !== itemId);
    };
    
    deleteRecursively(id);
    saveData();
  },

  async moveItem(id: string, newParentId: string | null): Promise<DataRoomItem> {
    await delay(500);
    
    const item = mockData.items.find(item => item.id === id);
    if (!item) {
      throw new Error('Item not found');
    }
    
    item.parentId = newParentId;
    item.updatedAt = new Date().toISOString();
    saveData();
    
    return item;
  },

  async searchItems(query: string): Promise<DataRoomItem[]> {
    await delay(300);
    
    const lowerQuery = query.toLowerCase();
    return mockData.items.filter(item =>
      item.name.toLowerCase().includes(lowerQuery)
    );
  },

  // File operations
  async downloadFile(id: string): Promise<Blob> {
    await delay(800);
    
    const file = mockData.items.find(item => item.id === id && item.type === 'file') as File;
    if (!file) {
      throw new Error('File not found');
    }
    
    // Create a mock PDF blob
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 24 Tf
100 700 Td
(${file.name}) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000348 00000 n 
0000000441 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
538
%%EOF`;
    
    return new Blob([pdfContent], { type: 'application/pdf' });
  },

  // Get breadcrumb path
  getBreadcrumb(folderId: string | null): Folder[] {
    const path: Folder[] = [];
    let currentId = folderId;
    
    while (currentId) {
      const folder = mockData.items.find(item => 
        item.id === currentId && item.type === 'folder'
      ) as Folder;
      
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    
    return path;
  },

  // Reset data (for demo purposes)
  resetData() {
    localStorage.removeItem('mockDataRoom');
    mockData = {
      users: mockData.users, // Keep users
      items: [],
      currentUser: mockData.currentUser,
    };
    saveData();
  },
};