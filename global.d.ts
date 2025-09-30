/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace React {
    // Global React namespace
  }
  
  // Make React available globally for Next.js generated types
  const React: typeof import('react');
}

export {};
