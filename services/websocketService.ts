// Real-time WebSocket service for live updates
'use client';

import { RealTimeEvent } from '@/types/enhanced';

type EventCallback = (event: RealTimeEvent) => void;
type ConnectionCallback = (connected: boolean) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventCallbacks: Map<string, EventCallback[]> = new Map();
  private connectionCallbacks: ConnectionCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private url: string;
  private token: string | null = null;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
  }

  connect(token?: string) {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (token) {
      this.token = token;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Add token as query parameter for authentication
      const wsUrl = this.token 
        ? `${this.url}?token=${encodeURIComponent(this.token)}`
        : this.url;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.notifyConnectionCallbacks(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const data: RealTimeEvent = JSON.parse(event.data);
          this.handleEvent(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.notifyConnectionCallbacks(false);
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleEvent(event: RealTimeEvent) {
    const callbacks = this.eventCallbacks.get(event.type) || [];
    callbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event callback:', error);
      }
    });

    // Also notify wildcard listeners
    const wildcardCallbacks = this.eventCallbacks.get('*') || [];
    wildcardCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in wildcard callback:', error);
      }
    });
  }

  private notifyConnectionCallbacks(connected: boolean) {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection callback:', error);
      }
    });
  }

  // Subscribe to specific event types
  on(eventType: string, callback: EventCallback): () => void {
    if (!this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.set(eventType, []);
    }
    
    this.eventCallbacks.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.eventCallbacks.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Subscribe to connection status changes
  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) {
        this.connectionCallbacks.splice(index, 1);
      }
    };
  }

  // Send message to server
  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Send typing indicator
  sendTyping(itemId: string, isTyping: boolean) {
    this.send({
      type: 'typing',
      data: { itemId, isTyping },
      timestamp: new Date().toISOString()
    });
  }

  // Send user presence
  sendPresence(status: 'online' | 'away' | 'offline') {
    this.send({
      type: 'presence',
      data: { status },
      timestamp: new Date().toISOString()
    });
  }
}

// Singleton instance
export const wsService = new WebSocketService();

// React hook for using WebSocket
import { useEffect, useState, useCallback } from 'react';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<RealTimeEvent[]>([]);

  useEffect(() => {
    // Subscribe to connection changes
    const unsubscribeConnection = wsService.onConnectionChange(setIsConnected);

    // Subscribe to all events for debugging
    const unsubscribeEvents = wsService.on('*', (event) => {
      setEvents(prev => [...prev.slice(-49), event]); // Keep last 50 events
    });

    // Auto-connect if token is available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      wsService.connect(token);
    }

    return () => {
      unsubscribeConnection();
      unsubscribeEvents();
    };
  }, []);

  const subscribe = useCallback((eventType: string, callback: EventCallback) => {
    return wsService.on(eventType, callback);
  }, []);

  const send = useCallback((message: any) => {
    wsService.send(message);
  }, []);

  const connect = useCallback((token?: string) => {
    wsService.connect(token);
  }, []);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  return {
    isConnected,
    events,
    subscribe,
    send,
    connect,
    disconnect,
    sendTyping: wsService.sendTyping.bind(wsService),
    sendPresence: wsService.sendPresence.bind(wsService)
  };
}

// Hook for specific event types
export function useRealtimeEvent(eventType: string, callback: EventCallback) {
  useEffect(() => {
    const unsubscribe = wsService.on(eventType, callback);
    return unsubscribe;
  }, [eventType, callback]);
}

// Hook for file updates
export function useFileUpdates(onFileUpdate: (event: RealTimeEvent) => void) {
  useRealtimeEvent('file_uploaded', onFileUpdate);
  useRealtimeEvent('file_deleted', onFileUpdate);
  useRealtimeEvent('file_renamed', onFileUpdate);
  useRealtimeEvent('folder_created', onFileUpdate);
}

// Hook for user presence
export function useUserPresence() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useRealtimeEvent('user_online', (event) => {
    setOnlineUsers(prev => {
      const uniqueUsers = new Set([...prev, event.userId]);
      return Array.from(uniqueUsers);
    });
  });

  useRealtimeEvent('user_offline', (event) => {
    setOnlineUsers(prev => prev.filter(id => id !== event.userId));
  });

  return { onlineUsers };
}