import { DataRoomState, Folder, FileItem } from '@/types';
import { generateId } from './storage';

export const createDemoData = (): DataRoomState => {
  const now = new Date();
  
  // Create demo folders
  const contractsFolder: Folder = {
    id: generateId(),
    name: 'Contracts',
    type: 'folder',
    parentId: null,
    createdAt: now,
    updatedAt: now,
  };

  const financialsFolder: Folder = {
    id: generateId(),
    name: 'Financial Documents',
    type: 'folder',
    parentId: null,
    createdAt: now,
    updatedAt: now,
  };

  const legalFolder: Folder = {
    id: generateId(),
    name: 'Legal',
    type: 'folder',
    parentId: contractsFolder.id,
    createdAt: now,
    updatedAt: now,
  };

  const auditFolder: Folder = {
    id: generateId(),
    name: 'Audit Reports',
    type: 'folder',
    parentId: financialsFolder.id,
    createdAt: now,
    updatedAt: now,
  };

  const complianceFolder: Folder = {
    id: generateId(),
    name: 'Compliance',
    type: 'folder',
    parentId: legalFolder.id,
    createdAt: now,
    updatedAt: now,
  };

  // Create demo files
  const demoFiles: FileItem[] = [
    {
      id: generateId(),
      name: 'Master Service Agreement.pdf',
      type: 'file',
      parentId: contractsFolder.id,
      size: 1024 * 1024 * 2.5, // 2.5 MB
      mimeType: 'application/pdf',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Q4 Financial Report.pdf',
      type: 'file',
      parentId: financialsFolder.id,
      size: 1024 * 1024 * 5.2, // 5.2 MB
      mimeType: 'application/pdf',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Non-Disclosure Agreement.pdf',
      type: 'file',
      parentId: legalFolder.id,
      size: 1024 * 512, // 512 KB
      mimeType: 'application/pdf',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Annual Audit 2023.pdf',
      type: 'file',
      parentId: auditFolder.id,
      size: 1024 * 1024 * 8.5, // 8.5 MB
      mimeType: 'application/pdf',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'GDPR Compliance Report.pdf',
      type: 'file',
      parentId: complianceFolder.id,
      size: 1024 * 1024 * 1.2, // 1.2 MB
      mimeType: 'application/pdf',
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    items: [contractsFolder, financialsFolder, legalFolder, auditFolder, complianceFolder, ...demoFiles],
    currentFolderId: null,
  };
};

export const shouldLoadDemoData = (): boolean => {
  // Load demo data if localStorage is empty and it's the first visit
  try {
    const existing = localStorage.getItem('dataroom-state');
    const hasVisited = localStorage.getItem('dataroom-visited');
    
    if (!existing && !hasVisited) {
      localStorage.setItem('dataroom-visited', 'true');
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
};