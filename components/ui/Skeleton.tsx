// Modern loading skeleton components
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave';
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse';
  
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// File card skeleton for data room
export function FileCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex flex-col items-center text-center">
        <Skeleton variant="circular" width={48} height={48} className="mb-3" />
        <Skeleton variant="text" className="h-4 w-20 mb-2" />
        <Skeleton variant="text" className="h-3 w-16" />
      </div>
    </div>
  );
}

// Data room loading state
export function DataRoomSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Skeleton variant="rectangular" className="h-10 w-20" />
          <Skeleton variant="text" className="h-4 w-2" />
          <Skeleton variant="rectangular" className="h-10 w-24" />
        </div>
        <Skeleton variant="rectangular" className="h-10 w-32" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <FileCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Search results skeleton
export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="text" className="h-5 w-48 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <FileCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Login form skeleton
export function LoginSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-large border border-white/20 p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <Skeleton variant="circular" width={64} height={64} className="mx-auto mb-6" />
        <Skeleton variant="text" className="h-7 w-48 mx-auto mb-2" />
        <Skeleton variant="text" className="h-5 w-64 mx-auto" />
      </div>
      
      <div className="space-y-5">
        <div>
          <Skeleton variant="text" className="h-4 w-24 mb-2" />
          <Skeleton variant="rectangular" className="h-12 w-full" />
        </div>
        <div>
          <Skeleton variant="text" className="h-4 w-20 mb-2" />
          <Skeleton variant="rectangular" className="h-12 w-full" />
        </div>
        <Skeleton variant="rectangular" className="h-12 w-full" />
      </div>
    </div>
  );
}