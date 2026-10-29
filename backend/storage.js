import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_ROOMS, SEED_STAFF, SEED_REQUESTS } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, 'data', 'db');

const ROOMS_FILE = path.join(DB_DIR, 'rooms.json');
const STAFF_FILE = path.join(DB_DIR, 'staff.json');
const REQUESTS_FILE = path.join(DB_DIR, 'requests.json');

class JSONStorage {
  constructor() {
    this.rooms = [];
    this.staff = [];
    this.requests = [];
    this.isInitialized = false;
  }

  ensureDbDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  init() {
    if (this.isInitialized) return;
    this.ensureDbDir();

    // 1. Rooms
    if (fs.existsSync(ROOMS_FILE)) {
      try {
        this.rooms = JSON.parse(fs.readFileSync(ROOMS_FILE, 'utf-8'));
      } catch (e) {
        this.rooms = [...SEED_ROOMS];
        this.saveRooms();
      }
    } else {
      this.rooms = [...SEED_ROOMS];
      this.saveRooms();
    }

    // 2. Staff
    if (fs.existsSync(STAFF_FILE)) {
      try {
        this.staff = JSON.parse(fs.readFileSync(STAFF_FILE, 'utf-8'));
      } catch (e) {
        this.staff = [...SEED_STAFF];
        this.saveStaff();
      }
    } else {
      this.staff = [...SEED_STAFF];
      this.saveStaff();
    }

    // 3. Requests
    if (fs.existsSync(REQUESTS_FILE)) {
      try {
        this.requests = JSON.parse(fs.readFileSync(REQUESTS_FILE, 'utf-8'));
      } catch (e) {
        this.requests = [...SEED_REQUESTS];
        this.saveRequests();
      }
    } else {
      this.requests = [...SEED_REQUESTS];
      this.saveRequests();
    }

    this.isInitialized = true;
    console.log(`[Storage] Initialized with ${this.rooms.length} rooms, ${this.staff.length} staff members, ${this.requests.length} requests.`);
  }

  reseed() {
    this.ensureDbDir();
    this.rooms = JSON.parse(JSON.stringify(SEED_ROOMS));
    this.staff = JSON.parse(JSON.stringify(SEED_STAFF));
    this.requests = JSON.parse(JSON.stringify(SEED_REQUESTS));
    this.saveRooms();
    this.saveStaff();
    this.saveRequests();
    return {
      message: "Database reseeded successfully with 50 rooms, 12 Ethiopian staff members, and initial sample requests.",
      roomCount: this.rooms.length,
      staffCount: this.staff.length,
      requestCount: this.requests.length
    };
  }

  saveRooms() {
    this.ensureDbDir();
    fs.writeFileSync(ROOMS_FILE, JSON.stringify(this.rooms, null, 2), 'utf-8');
  }

  saveStaff() {
    this.ensureDbDir();
    fs.writeFileSync(STAFF_FILE, JSON.stringify(this.staff, null, 2), 'utf-8');
  }

  saveRequests() {
    this.ensureDbDir();
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify(this.requests, null, 2), 'utf-8');
  }

  // --- Rooms ---
  getRooms(query = {}) {
    this.init();
    let result = [...this.rooms];
    if (query.wing) {
      result = result.filter(r => r.wing.toLowerCase() === query.wing.toLowerCase());
    }
    if (query.type) {
      result = result.filter(r => r.type.toLowerCase().includes(query.type.toLowerCase()));
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.guest.toLowerCase().includes(q) ||
        r.number.includes(q)
      );
    }
    return result;
  }

  getRoomById(id) {
    this.init();
    return this.rooms.find(r => r.id === id || r.number === id) || null;
  }

  // --- Staff ---
  getStaff(query = {}) {
    this.init();
    let result = [...this.staff];
    if (query.department) {
      result = result.filter(s => s.department.toLowerCase() === query.department.toLowerCase());
    }
    if (query.status) {
      result = result.filter(s => s.status.toLowerCase() === query.status.toLowerCase());
    }
    return result;
  }

  getStaffById(id) {
    this.init();
    return this.staff.find(s => s.id === id || s.name.toLowerCase() === id.toLowerCase()) || null;
  }

  updateStaff(id, updates) {
    this.init();
    const index = this.staff.findIndex(s => s.id === id || s.name.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;
    this.staff[index] = { ...this.staff[index], ...updates };
    this.saveStaff();
    return this.staff[index];
  }

  // --- Requests ---
  getRequests(query = {}) {
    this.init();
    let result = [...this.requests];

    if (query.status && query.status !== 'ALL') {
      result = result.filter(r => r.status.toLowerCase() === query.status.toLowerCase());
    }
    if (query.department && query.department !== 'ALL') {
      result = result.filter(r => r.department.toLowerCase() === query.department.toLowerCase());
    }
    if (query.room && query.room !== 'ALL') {
      result = result.filter(r => r.room.toLowerCase().includes(query.room.toLowerCase()));
    }
    if (query.priority) {
      result = result.filter(r => r.priority.toLowerCase() === query.priority.toLowerCase());
    }
    if (query.q) {
      const q = query.q.toLowerCase();
      result = result.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.guestName.toLowerCase().includes(q) ||
        r.serviceTitle.toLowerCase().includes(q) ||
        (r.details && r.details.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }

  getRequestById(id) {
    this.init();
    return this.requests.find(r => r.id === id) || null;
  }

  createRequest(data) {
    this.init();
    const newRequest = {
      id: data.id || `REQ-${Math.floor(100 + Math.random() * 900)}`,
      room: data.room,
      guestName: data.guestName || "Resort Guest",
      serviceId: data.serviceId,
      serviceTitle: data.serviceTitle,
      department: data.department || "Guest Services",
      details: data.details || "",
      timeRequested: "Just now",
      timestamp: Date.now(),
      status: data.status || "Pending",
      priority: data.priority || (data.serviceId === 'emergency' ? 'Urgent' : 'Normal'),
      assignedTo: data.assignedTo || "Unassigned",
      notes: data.notes || "Awaiting staff acknowledgement.",
    };

    this.requests.unshift(newRequest);
    this.saveRequests();
    return newRequest;
  }

  updateRequest(id, updates) {
    this.init();
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) return null;

    const existing = this.requests[index];
    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // prevent overwriting ID
      timestamp: existing.timestamp,
    };

    // If note is being appended
    if (updates.appendNote && updates.appendNote.trim()) {
      const prev = existing.notes ? `${existing.notes} | ` : '';
      updated.notes = `${prev}${updates.appendNote.trim()}`;
      delete updated.appendNote;
    }

    this.requests[index] = updated;
    this.saveRequests();
    return updated;
  }

  deleteRequest(id) {
    this.init();
    const index = this.requests.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.requests.splice(index, 1);
    this.saveRequests();
    return true;
  }

  // --- Metrics ---
  getMetrics() {
    this.init();
    const total = this.requests.length;
    const pending = this.requests.filter(r => r.status === 'Pending').length;
    const inProgress = this.requests.filter(r => r.status === 'In Progress').length;
    const completed = this.requests.filter(r => r.status === 'Completed').length;
    const urgent = this.requests.filter(r => r.priority === 'Urgent' && r.status !== 'Completed').length;

    const coffeeCount = this.requests.filter(r => r.serviceId === 'traditional-coffee').length;
    const lakeToursCount = this.requests.filter(r => ['lake-tour', 'bird-watching', 'water-sports'].includes(r.serviceId)).length;
    const diningCount = this.requests.filter(r => ['dining', 'room-service'].includes(r.serviceId)).length;
    const spaCount = this.requests.filter(r => r.serviceId === 'lake-spa').length;

    return {
      totalRequests: total,
      pendingRequests: pending,
      inProgressRequests: inProgress,
      completedRequests: completed,
      urgentAlerts: urgent,
      fulfillmentRate: total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : '100%',
      avgResponseTime: '11m 45s',
      activeRoomsCount: this.rooms.length,
      activeStaffCount: this.staff.filter(s => s.status === 'Active').length,
      experienceBreakdown: [
        { name: "Ethiopian Coffee Ceremony (Buna)", percent: total > 0 ? Math.round((coffeeCount / total) * 100) : 36, count: coffeeCount },
        { name: "Lake Ziway Tours & Kayaking", percent: total > 0 ? Math.round((lakeToursCount / total) * 100) : 28, count: lakeToursCount },
        { name: "Fresh Tilapia & Dining", percent: total > 0 ? Math.round((diningCount / total) * 100) : 22, count: diningCount },
        { name: "Poolside Cabana & Spa", percent: total > 0 ? Math.round((spaCount / total) * 100) : 14, count: spaCount },
      ],
      updatedAt: new Date().toISOString()
    };
  }
}

export const storage = new JSONStorage();

