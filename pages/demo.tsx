// Demo page showcasing all working features
'use client';

import React from 'react';
import EnhancedApp from '@/components/EnhancedApp';

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white p-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg font-semibold mb-1">🚀 Data Room Demo - Fully Functional</h1>
          <p className="text-sm opacity-90">
            Try: Login (admin@dataroom.com / admin123) • Create Folders • Upload Files • File Preview • Drag & Drop
          </p>
        </div>
      </div>
      
      {/* Enhanced CSS Styles */}
      <style jsx global>{`
        /* Load enhanced styles */
        @import url('/styles/enhanced.css');
        
        /* Demo-specific styles */
        .demo-highlight {
          position: relative;
        }
        
        .demo-highlight::after {
          content: '✨ Demo Feature';
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 12px;
          font-weight: 600;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* Main App */}
      <EnhancedApp />
      
      {/* Feature Showcase Overlay */}
      <div className="fixed bottom-4 left-4 z-50 max-w-xs">
        <div className="bg-black/80 backdrop-blur-lg text-white p-4 rounded-2xl text-sm">
          <h3 className="font-semibold mb-2">✅ Working Features:</h3>
          <ul className="space-y-1 text-xs opacity-90">
            <li>• Authentication (3 demo users)</li>
            <li>• Create & nest folders</li>
            <li>• Upload PDF files</li>
            <li>• File preview with zoom</li>
            <li>• Drag & drop interface</li>
            <li>• Search & filter</li>
            <li>• Rename & delete</li>
            <li>• Toast notifications</li>
            <li>• Data persistence</li>
            <li>• Mobile responsive</li>
          </ul>
        </div>
      </div>
    </div>
  );
}