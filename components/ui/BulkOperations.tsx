// Bulk operations component for file management
'use client';

import React, { useState } from 'react';
import { 
  Trash2, 
  Download, 
  Move, 
  Copy, 
  Share2, 
  Archive, 
  X, 
  CheckSquare, 
  Square,
  MoreHorizontal,
  FolderPlus
} from 'lucide-react';
import { DataRoomItem } from '@/types/enhanced';
import { useToast } from '@/components/ui/Toast';

interface BulkOperationsProps {
  selectedItems: DataRoomItem[];
  onClearSelection: () => void;
  onDelete: (items: DataRoomItem[]) => void;
  onMove: (items: DataRoomItem[], targetFolderId: string | null) => void;
  onCopy: (items: DataRoomItem[], targetFolderId: string | null) => void;
  onDownload: (items: DataRoomItem[]) => void;
  onShare: (items: DataRoomItem[]) => void;
  folders: DataRoomItem[];
}

export function BulkOperations({
  selectedItems,
  onClearSelection,
  onDelete,
  onMove,
  onCopy,
  onDownload,
  onShare,
  folders
}: BulkOperationsProps) {
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [targetFolder, setTargetFolder] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error } = useToast();

  if (selectedItems.length === 0) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm(`Delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await onDelete(selectedItems);
      success(
        'Items deleted',
        `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} deleted successfully`
      );
      onClearSelection();
    } catch (err) {
      error('Delete failed', err instanceof Error ? err.message : 'Failed to delete items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMove = async () => {
    if (targetFolder === null) {
      error('No destination selected', 'Please select a destination folder');
      return;
    }

    setIsProcessing(true);
    try {
      await onMove(selectedItems, targetFolder);
      success(
        'Items moved',
        `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} moved successfully`
      );
      setShowMoveModal(false);
      setTargetFolder(null);
      onClearSelection();
    } catch (err) {
      error('Move failed', err instanceof Error ? err.message : 'Failed to move items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (targetFolder === null) {
      error('No destination selected', 'Please select a destination folder');
      return;
    }

    setIsProcessing(true);
    try {
      await onCopy(selectedItems, targetFolder);
      success(
        'Items copied',
        `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} copied successfully`
      );
      setShowCopyModal(false);
      setTargetFolder(null);
      onClearSelection();
    } catch (err) {
      error('Copy failed', err instanceof Error ? err.message : 'Failed to copy items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      await onDownload(selectedItems);
      success(
        'Download started',
        `Downloading ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`
      );
    } catch (err) {
      error('Download failed', err instanceof Error ? err.message : 'Failed to download items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = () => {
    onShare(selectedItems);
  };

  const fileCount = selectedItems.filter(item => item.type === 'file').length;
  const folderCount = selectedItems.filter(item => item.type === 'folder').length;

  return (
    <>
      {/* Bulk Operations Bar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-large p-4 animate-slide-in-up">
          <div className="flex items-center gap-4">
            {/* Selection Info */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <CheckSquare size={16} className="text-primary-600" />
              <span>
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              {fileCount > 0 && folderCount > 0 && (
                <span className="text-gray-500">
                  ({fileCount} file{fileCount > 1 ? 's' : ''}, {folderCount} folder{folderCount > 1 ? 's' : ''})
                </span>
              )}
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={isProcessing || fileCount === 0}
                className="btn-ghost p-2 disabled:opacity-50"
                title="Download selected files"
              >
                <Download size={16} />
              </button>

              <button
                onClick={() => setShowMoveModal(true)}
                disabled={isProcessing}
                className="btn-ghost p-2"
                title="Move items"
              >
                <Move size={16} />
              </button>

              <button
                onClick={() => setShowCopyModal(true)}
                disabled={isProcessing}
                className="btn-ghost p-2"
                title="Copy items"
              >
                <Copy size={16} />
              </button>

              <button
                onClick={handleShare}
                disabled={isProcessing}
                className="btn-ghost p-2"
                title="Share items"
              >
                <Share2 size={16} />
              </button>

              <div className="w-px h-6 bg-gray-300" />

              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                title="Delete items"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={onClearSelection}
                className="btn-ghost p-2"
                title="Clear selection"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-large w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Move Items</h3>
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="btn-ghost p-2"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                Select destination folder for {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                <button
                  onClick={() => setTargetFolder(null)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    targetFolder === null
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderPlus size={16} className="text-gray-500" />
                    <span className="font-medium">Root Folder</span>
                  </div>
                </button>

                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setTargetFolder(folder.id)}
                    disabled={selectedItems.some(item => item.id === folder.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      targetFolder === folder.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FolderPlus size={16} className="text-primary-600" />
                      <span className="font-medium">{folder.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowMoveModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMove}
                  disabled={isProcessing}
                  className="btn-primary flex-1"
                >
                  {isProcessing ? 'Moving...' : 'Move'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-large w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Copy Items</h3>
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="btn-ghost p-2"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                Select destination folder for copying {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}:
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                <button
                  onClick={() => setTargetFolder(null)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    targetFolder === null
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderPlus size={16} className="text-gray-500" />
                    <span className="font-medium">Root Folder</span>
                  </div>
                </button>

                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setTargetFolder(folder.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      targetFolder === folder.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FolderPlus size={16} className="text-primary-600" />
                      <span className="font-medium">{folder.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopy}
                  disabled={isProcessing}
                  className="btn-primary flex-1"
                >
                  {isProcessing ? 'Copying...' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}