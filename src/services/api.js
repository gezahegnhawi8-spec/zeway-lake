const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Rooms
  async getRooms(query = {}) {
    try {
      const params = new URLSearchParams(query).toString();
      const res = await fetch(`${API_BASE}/rooms${params ? `?${params}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      return data.rooms;
    } catch (err) {
      console.warn('[API] Could not reach backend for rooms, falling back to local data', err.message);
      return null;
    }
  },

  // Staff
  async getStaff() {
    try {
      const res = await fetch(`${API_BASE}/staff`);
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      return data.staff;
    } catch (err) {
      console.warn('[API] Could not reach backend for staff, falling back to local data', err.message);
      return null;
    }
  },

  // Requests
  async getRequests(query = {}) {
    try {
      const params = new URLSearchParams(query).toString();
      const res = await fetch(`${API_BASE}/requests${params ? `?${params}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      return data.requests;
    } catch (err) {
      console.warn('[API] Could not reach backend for requests', err.message);
      return null;
    }
  },

  async createRequest(requestData) {
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) throw new Error('Failed to create request');
      const data = await res.json();
      return data.request;
    } catch (err) {
      console.warn('[API] Could not post request to backend, returning local object', err.message);
      return requestData;
    }
  },

  async updateRequest(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update request');
      const data = await res.json();
      return data.request;
    } catch (err) {
      console.warn('[API] Could not update request on backend', err.message);
      return null;
    }
  },

  async deleteRequest(id) {
    try {
      const res = await fetch(`${API_BASE}/requests/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete request');
      return true;
    } catch (err) {
      console.warn('[API] Could not delete request on backend', err.message);
      return false;
    }
  },

  // Metrics
  async getMetrics() {
    try {
      const res = await fetch(`${API_BASE}/metrics`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const data = await res.json();
      return data.metrics;
    } catch (err) {
      console.warn('[API] Could not fetch metrics from backend', err.message);
      return null;
    }
  },

  // Reseed
  async reseed() {
    try {
      const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reseed database');
      return await res.json();
    } catch (err) {
      console.warn('[API] Could not reseed backend', err.message);
      return null;
    }
  }
};

