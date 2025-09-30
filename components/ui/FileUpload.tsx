// Modern file upload component with progress tracking
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => Promise<void>;
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
}

export function FileUpload({
  onFilesUploaded,
  acceptedTypes = ['.pdf', 'application/pdf'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  className = '',
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploads, setUploads] = useState<FileUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const validateFile = useCallback((file: File): string | null => {
    if (maxFileSize && file.size > maxFileSize) {
      return `File size must be less than ${formatFileSize(maxFileSize)}`;
    }

    if (acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  }, [acceptedTypes, maxFileSize]);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length > maxFiles) {
      error('Too many files', `Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate all files first
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        validationErrors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      error('File validation failed', validationErrors.join('\n'));
      return;
    }

    if (validFiles.length === 0) {
      return;
    }

    setIsUploading(true);

    // Initialize upload progress for each file
    const initialUploads: FileUploadProgress[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploads(initialUploads);

    try {
      // Simulate upload progress for each file
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setUploads(prev => prev.map((upload, index) => 
            index === i ? { ...upload, progress } : upload
          ));
        }

        // Mark as completed
        setUploads(prev => prev.map((upload, index) => 
          index === i ? { ...upload, status: 'completed' as const, progress: 100 } : upload
        ));
      }

      // Call the actual upload handler
      await onFilesUploaded(validFiles);

      success(
        'Files uploaded successfully',
        `${validFiles.length} file${validFiles.length > 1 ? 's' : ''} uploaded`
      );

      // Clear uploads after a delay
      setTimeout(() => {
        setUploads([]);
      }, 2000);

    } catch (err) {
      // Mark all as error
      setUploads(prev => prev.map(upload => ({
        ...upload,
        status: 'error' as const,
        error: err instanceof Error ? err.message : 'Upload failed'
      })));

      error('Upload failed', err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  }, [onFilesUploaded, maxFiles, success, error, validateFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow same file selection
    e.target.value = '';
  }, [handleFiles]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-primary-400 bg-primary-50 scale-[1.02]'
            : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            isDragOver ? 'bg-primary-100' : 'bg-gray-100'
          }`}>
            <Upload size={32} className={isDragOver ? 'text-primary-600' : 'text-gray-400'} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragOver ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-gray-600">
              Drag and drop files here, or{' '}
              <span className="text-primary-600 font-medium">browse</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {acceptedTypes.includes('.pdf') ? 'PDF files only' : `Accepted: ${acceptedTypes.join(', ')}`}
              {maxFileSize && ` • Max size: ${formatFileSize(maxFileSize)}`}
              {multiple && ` • Max ${maxFiles} files`}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Upload Progress</h4>
          {uploads.map((upload, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    upload.status === 'completed' 
                      ? 'bg-green-100' 
                      : upload.status === 'error'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}>
                    {upload.status === 'completed' ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : upload.status === 'error' ? (
                      <AlertCircle size={16} className="text-red-600" />
                    ) : (
                      <Loader2 size={16} className="text-blue-600 animate-spin" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {upload.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(upload.file.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeUpload(index)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    upload.status === 'completed' 
                      ? 'bg-green-500' 
                      : upload.status === 'error'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${upload.progress}%` }}
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${
                  upload.status === 'completed' 
                    ? 'text-green-600' 
                    : upload.status === 'error'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}>
                  {upload.status === 'completed' 
                    ? 'Completed' 
                    : upload.status === 'error'
                    ? upload.error || 'Upload failed'
                    : 'Uploading...'
                  }
                </span>
                <span className="text-gray-500">
                  {upload.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}