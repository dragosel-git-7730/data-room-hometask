/// <reference types="react" />
/// <reference types="react-dom" />

import * as React from 'react';

declare global {
  namespace React {
    // Ensure React namespace is available globally for Next.js type generation
  }
  
  // Make React available as a global namespace
  const React: typeof import('react');
}

export {};