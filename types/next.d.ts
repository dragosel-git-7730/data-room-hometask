import * as React from 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  var React: typeof import('react');
  var useState: typeof React.useState;
  var useEffect: typeof React.useEffect;
  var useContext: typeof React.useContext;
  var useReducer: typeof React.useReducer;
  var createContext: typeof React.createContext;
}