# Dambal Lakeside Resort & Spa — Fullstack Real-Time Hospitality Platform

> Luxury hospitality management and real-time service dispatch system designed for a luxury eco-resort on **Lake Ziway (Lake Dambal)** in the Great Rift Valley, Ethiopia.

---

## 🏗️ Architecture Overview

```
├── server/
│   ├── index.js               # Express + HTTP + Socket.io Server (Port 5000)
│   ├── storage.js             # JSON File Storage Engine (auto-persists to server/data/db/)
│   └── data/
│       ├── seedData.js        # 50 Rooms, Ethiopian Staff, Sample Requests
│       └── db/                # Persistent JSON storage files
├── src/
│   ├── components/            # Guest Portal & Staff Operations Console
│   ├── services/
│   │   ├── api.js             # REST API Client (Rooms, Staff, Requests, Metrics)
│   │   └── socket.js          # Socket.io Client (Real-time live sync without page reload)
│   ├── assets/                # Curated Lake Ziway & Resort Photography
│   └── App.jsx                # Main Fullstack Application & State Manager
```

---

## ⚡ Real-Time WebSocket Events (Socket.io)

| Event Name | Direction | Description |
|---|---|---|
| `request:created` | Server ➔ Clients | Emitted instantly when a guest submits a request. Appears immediately on the staff dashboard without refresh with a luxury audio chime. |
| `request:updated` | Server ➔ Clients | Emitted when staff changes status (`Pending` ➔ `In Progress` ➔ `Completed`), assigns staff, or appends notes. |
| `request:deleted` | Server ➔ Clients | Emitted when a request is cancelled or archived. |
| `metrics:updated` | Server ➔ Clients | Broadcasts updated KPI counts, response times, and experience demand percentages. |
| `staff:urgent_alert` | Server ➔ Clients | Triggers high-priority audible siren for medical emergencies or lake rescues. |

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

### 1. Rooms
- `GET /api/rooms` — List all 50 rooms across 4 wings (*Pelican Shore*, *Debre Sina*, *Tulu Gudo*, *Heron Bay*). Supports `?wing=`, `?type=`, `?search=`.
- `GET /api/rooms/:id` — Details of a specific villa or suite.

### 2. Staff
- `GET /api/staff` — List all authentic Ethiopian hospitality team members (*Master Buna Hostess*, *Chief Marine Navigator*, *Executive Chef*, *Chief Medical Officer*, etc.).
- `GET /api/staff/:id` — Staff member profile and current assignment.
- `PUT /api/staff/:id` — Update staff task or status.

### 3. Requests
- `GET /api/requests` — Filterable requests queue (`?status=`, `?department=`, `?room=`, `?q=`).
- `POST /api/requests` — Submit a new guest request (broadcasts via WebSocket to staff desk).
- `PUT /api/requests/:id` — Update status, assign staff, or append operational notes.
- `DELETE /api/requests/:id` — Cancel or remove request.

### 4. Metrics & Maintenance
- `GET /api/metrics` — Real-time analytics, active request counts, and popularity breakdown.
- `POST /api/seed` — Reseed database with fresh 50 rooms, staff, and initial sample requests.

---

## 👥 Seed Data Summary

1. **50 Lakefront Rooms & Suites**:
   - **Pelican Shore (Villas 101 – 112)**: Direct lakefront royal villas with private verandas.
   - **Debre Sina Wing (Suites 201 – 215)**: Panoramic executive suites overlooking Mount Alutu.
   - **Tulu Gudo Garden (Lodges 301 – 313)**: Eco-lakeside chalets and ancient monastery views.
   - **Heron Bay (Chalets 401 – 410)**: Deluxe chalets with private boat slips.
   - All rooms seeded with authentic Ethiopian guests (*Ambassador Hailemariam, Dr. Aster Vance, Kenenisa Bekele, Derartu Tulu, Haile Gebrselassie, etc.*).

2. **12 Ethiopian Hospitality Specialists**:
   - *Selamawit Tadesse* (Master Buna Hostess & Cultural Lead)
   - *Captain Abebe Kebede* (Chief Marine Navigator & Boat Captain)
   - *Chef Dawit Worku* (Executive Chef - Lakeside Kitchen)
   - *Nurse Tigist Haile* (Chief Medical Officer & First Responder)
   - *Kassahun Berhanu* (Lead Systems & Engineering Tech)
   - *Mulugeta Desta* (Watersports & Kayak Ranger)
   - *Almaz Tefera* (Executive Housekeeper)
   - *Yohannes Girma* (Chief Concierge & Rift Excursions)
   - *Solomon Wolde* (Lakefront Security Commander)
   - *Hiwot Assefa* (Zoma Lakeside Spa Director)
   - *Fikadu Lemma* (Ornithology Ranger & Bird Guide)
   - *Genet Alemu* (In-Villa Dining Attendant)

---

## 🚀 Running Locally

Open two terminal sessions or run concurrently:

### Terminal 1: Backend Server (Node.js + Express + Socket.io)
```bash
npm run server
# Server listening on http://localhost:5000 (REST + WebSockets)
```

### Terminal 2: Frontend Client (React + Vite + Tailwind)
```bash
npm run dev
# Vite dev server running at http://localhost:3000
```
