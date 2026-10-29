import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return this.socket;

    try {
      this.socket = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 5000,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('⚡ [WebSocket] Connected to Lake Ziway Resort backend (ID:', this.socket.id, ')');
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        console.log('⚡ [WebSocket] Disconnected from backend:', reason);
      });

      this.socket.on('connect_error', (err) => {
        this.isConnected = false;
        console.warn('⚡ [WebSocket] Connection error (server may be starting):', err.message);
      });

      return this.socket;
    } catch (e) {
      console.warn('⚡ [WebSocket] Could not initialize socket.io client:', e);
      return null;
    }
  }

  // Event subscription helpers
  onRequestCreated(callback) {
    if (!this.socket) this.connect();
    if (this.socket) {
      this.socket.on('request:created', callback);
    }
    return () => this.socket?.off('request:created', callback);
  }

  onRequestUpdated(callback) {
    if (!this.socket) this.connect();
    if (this.socket) {
      this.socket.on('request:updated', callback);
    }
    return () => this.socket?.off('request:updated', callback);
  }

  onRequestDeleted(callback) {
    if (!this.socket) this.connect();
    if (this.socket) {
      this.socket.on('request:deleted', callback);
    }
    return () => this.socket?.off('request:deleted', callback);
  }

  onMetricsUpdated(callback) {
    if (!this.socket) this.connect();
    if (this.socket) {
      this.socket.on('metrics:updated', callback);
    }
    return () => this.socket?.off('metrics:updated', callback);
  }

  onUrgentAlert(callback) {
    if (!this.socket) this.connect();
    if (this.socket) {
      this.socket.on('staff:urgent_alert', callback);
    }
    return () => this.socket?.off('staff:urgent_alert', callback);
  }

  joinVillaRoom(roomName) {
    if (!this.socket) this.connect();
    this.socket?.emit('guest:join_room', roomName);
  }

  joinStaffDesk() {
    if (!this.socket) this.connect();
    this.socket?.emit('staff:join');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();

