import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { storage } from './storage.js';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Enable CORS for Vite dev server (port 3000) and any localhost
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Initialize storage database
storage.init();

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    resort: 'Lake Ziway (Dambal) Luxury Resort API',
    time: new Date().toISOString(),
    rooms: storage.rooms.length,
    staff: storage.staff.length,
    requests: storage.requests.length,
  });
});

// 1. Rooms API
app.get('/api/rooms', (req, res) => {
  try {
    const rooms = storage.getRooms(req.query);
    res.json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/rooms/:id', (req, res) => {
  try {
    const room = storage.getRoomById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Staff API
app.get('/api/staff', (req, res) => {
  try {
    const staff = storage.getStaff(req.query);
    res.json({ success: true, count: staff.length, staff });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/staff/:id', (req, res) => {
  try {
    const member = storage.getStaffById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.json({ success: true, staff: member });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/staff/:id', (req, res) => {
  try {
    const updated = storage.updateStaff(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Staff member not found' });
    
    // Broadcast staff update
    io.emit('staff:updated', updated);
    res.json({ success: true, staff: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Requests API
app.get('/api/requests', (req, res) => {
  try {
    const requests = storage.getRequests(req.query);
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/requests/:id', (req, res) => {
  try {
    const request = storage.getRequestById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST: Guest submits request (Triggers WebSocket event to Staff Dashboard!)
app.post('/api/requests', (req, res) => {
  try {
    const { room, serviceTitle, serviceId } = req.body;
    if (!room || !serviceTitle) {
      return res.status(400).json({ success: false, message: 'Room and serviceTitle are required' });
    }

    const newRequest = storage.createRequest(req.body);

    // ⚡ REAL-TIME WEBSOCKET BROADCAST:
    // Instantly notify staff dashboard without page refresh!
    io.emit('request:created', newRequest);
    io.emit('metrics:updated', storage.getMetrics());

    // If Urgent, emit high-priority alert sound event
    if (newRequest.priority === 'Urgent') {
      io.emit('staff:urgent_alert', {
        id: newRequest.id,
        room: newRequest.room,
        service: newRequest.serviceTitle,
        details: newRequest.details,
      });
    }

    res.status(201).json({ success: true, request: newRequest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT / PATCH: Update request status, assigned staff, or notes
app.put('/api/requests/:id', (req, res) => {
  try {
    const updated = storage.updateRequest(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Request not found' });

    // ⚡ WEBSOCKET BROADCAST: Request updated
    io.emit('request:updated', updated);
    io.emit('metrics:updated', storage.getMetrics());

    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/requests/:id', (req, res) => {
  try {
    const updated = storage.updateRequest(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Request not found' });

    // ⚡ WEBSOCKET BROADCAST
    io.emit('request:updated', updated);
    io.emit('metrics:updated', storage.getMetrics());

    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE: Cancel or archive request
app.delete('/api/requests/:id', (req, res) => {
  try {
    const id = req.params.id;
    const deleted = storage.deleteRequest(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Request not found' });

    // ⚡ WEBSOCKET BROADCAST
    io.emit('request:deleted', { id });
    io.emit('metrics:updated', storage.getMetrics());

    res.json({ success: true, message: `Request ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Metrics API
app.get('/api/metrics', (req, res) => {
  try {
    const metrics = storage.getMetrics();
    res.json({ success: true, metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Re-seed Endpoint
app.post('/api/seed', (req, res) => {
  try {
    const result = storage.reseed();
    io.emit('data:reseeded', result);
    io.emit('metrics:updated', storage.getMetrics());
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- WEBSOCKET EVENT LISTENERS ---
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send current metrics immediately upon connection
  socket.emit('metrics:updated', storage.getMetrics());

  // Guest joins specific villa channel
  socket.on('guest:join_room', (roomName) => {
    socket.join(roomName);
    console.log(`[Socket.io] Guest in ${roomName} joined personal channel`);
  });

  // Staff joins command dashboard channel
  socket.on('staff:join', () => {
    socket.join('staff_desk');
    console.log(`[Socket.io] Staff console joined desk channel`);
  });

  // Direct socket event to submit request
  socket.on('request:submit', (data) => {
    try {
      const newRequest = storage.createRequest(data);
      io.emit('request:created', newRequest);
      io.emit('metrics:updated', storage.getMetrics());
      
      if (newRequest.priority === 'Urgent') {
        io.emit('staff:urgent_alert', newRequest);
      }
    } catch (e) {
      socket.emit('error', { message: e.message });
    }
  });

  // Direct socket event to update request status/staff
  socket.on('request:update_status', ({ id, status, assignedTo, notes }) => {
    try {
      const updated = storage.updateRequest(id, { status, assignedTo, notes });
      if (updated) {
        io.emit('request:updated', updated);
        io.emit('metrics:updated', storage.getMetrics());
      }
    } catch (e) {
      socket.emit('error', { message: e.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Start HTTP + WebSocket Server
server.listen(PORT, () => {
  console.log(`
  ==============================================================
  🌊 LAKE ZIWAY RESORT & SPA - BACKEND REST API & SOCKET.IO
  ==============================================================
  🚀 Server running on: http://localhost:${PORT}
  📡 WebSocket Endpoint: ws://localhost:${PORT}
  🏨 Rooms seeded: ${storage.rooms.length} (4 wings across Lake Ziway)
  👥 Ethiopian Staff seeded: ${storage.staff.length}
  📋 Active Sample Requests: ${storage.requests.length}
  📊 REST API Endpoints:
     - GET    /api/health
     - GET    /api/rooms (?wing=, ?search=)
     - GET    /api/rooms/:id
     - GET    /api/staff
     - GET    /api/requests (?status=, ?department=, ?room=, ?q=)
     - POST   /api/requests (triggers instant WebSocket broadcast)
     - PUT    /api/requests/:id
     - DELETE /api/requests/:id
     - GET    /api/metrics
     - POST   /api/seed (reset database)
  ==============================================================
  `);
});

