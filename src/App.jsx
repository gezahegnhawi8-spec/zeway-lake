import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import GuestHeader from './components/GuestPortal/GuestHeader';
import ServiceCard from './components/GuestPortal/ServiceCard';
import RequestModal from './components/GuestPortal/RequestModal';
import ActiveRequestsDrawer from './components/GuestPortal/ActiveRequestsDrawer';
import EmergencyModal from './components/GuestPortal/EmergencyModal';
import QRCodeModal from './components/GuestPortal/QRCodeModal';
import StaffStats from './components/StaffDashboard/StaffStats';
import RequestTable from './components/StaffDashboard/RequestTable';
import RequestDetailsModal from './components/StaffDashboard/RequestDetailsModal';
import AnalyticsChart from './components/StaffDashboard/AnalyticsChart';

import { RESORT_INFO, SERVICE_CATEGORIES } from './data/mockData';
import { SEED_ROOMS, SEED_STAFF, SEED_REQUESTS } from '../server/data/seedData.js';
import { api } from './services/api';
import { socketService } from './services/socket';
import { soundFX } from './utils/audio';

import { 
  Sparkles, 
  Waves, 
  ShieldAlert, 
  CheckCircle2, 
  Bell, 
  QrCode, 
  Compass, 
  Utensils, 
  ArrowRight, 
  Coffee, 
  Sun, 
  Clock, 
  MapPin,
  Calendar,
  ChevronRight,
  Wifi,
  WifiOff,
  RotateCcw
} from 'lucide-react';

// Uploaded Resort Images
import heroAerialImg from './assets/image_ORxLMC.png';
import kayakImg from './assets/image_xXJLjQ.png';
import poolCabanaImg from './assets/image_102mJW.png';
import diningImg from './assets/image_ufzUD-.png';

const STORAGE_KEY = 'ziway_resort_requests_v2';

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState('guest'); // 'guest' | 'staff'
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Backend / Live Data State (50 rooms & Ethiopian staff)
  const [rooms, setRooms] = useState(SEED_ROOMS);
  const [currentRoom, setCurrentRoom] = useState(SEED_ROOMS[0]);
  const [staffList, setStaffList] = useState(SEED_STAFF);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState(null);

  // Requests State
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : SEED_REQUESTS;
    } catch (e) {
      return SEED_REQUESTS;
    }
  });

  // Modals & Drawers
  const [activeServiceModal, setActiveServiceModal] = useState(null);
  const [isRequestsDrawerOpen, setIsRequestsDrawerOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [inspectedStaffRequest, setInspectedStaffRequest] = useState(null);

  // Toast Notification Banner
  const [toastNotification, setToastNotification] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Sound triggering helper
  const triggerChime = (isUrgent = false) => {
    if (!soundEnabled) return;
    if (isUrgent) {
      soundFX.playEmergencyAlert();
    } else {
      soundFX.playChime();
    }
  };

  // --- INITIAL DATA FETCH & WEBSOCKET SETUP ---
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch Rooms from REST API
    api.getRooms().then((backendRooms) => {
      if (isMounted && backendRooms && backendRooms.length > 0) {
        setRooms(backendRooms);
        setCurrentRoom(backendRooms[0]);
        console.log(`[REST] Loaded ${backendRooms.length} rooms from backend`);
      }
    });

    // 2. Fetch Staff from REST API
    api.getStaff().then((backendStaff) => {
      if (isMounted && backendStaff && backendStaff.length > 0) {
        setStaffList(backendStaff);
        console.log(`[REST] Loaded ${backendStaff.length} staff members from backend`);
      }
    });

    // 3. Fetch Requests from REST API
    api.getRequests().then((backendRequests) => {
      if (isMounted && backendRequests && backendRequests.length > 0) {
        setRequests(backendRequests);
        console.log(`[REST] Loaded ${backendRequests.length} requests from backend`);
      }
    });

    // 4. Initialize WebSocket Connection
    const socket = socketService.connect();
    if (socket) {
      socket.on('connect', () => {
        if (isMounted) setIsSocketConnected(true);
      });
      socket.on('disconnect', () => {
        if (isMounted) setIsSocketConnected(false);
      });

      // ⚡ REAL-TIME EVENT: Incoming Request (Broadcast from guest or other clients)
      const unsubCreated = socketService.onRequestCreated((newReq) => {
        console.log('⚡ [Socket.io] Instant request received:', newReq.id);
        setRequests((prev) => {
          if (prev.some((r) => r.id === newReq.id)) return prev;
          return [newReq, ...prev];
        });

        triggerChime(newReq.priority === 'Urgent');
        showToast(
          `⚡ Live Request: ${newReq.serviceTitle} for ${newReq.room}`,
          newReq.priority === 'Urgent' ? 'urgent' : 'success'
        );
      });

      // ⚡ REAL-TIME EVENT: Request Updated (Status, assigned staff, notes)
      const unsubUpdated = socketService.onRequestUpdated((updatedReq) => {
        console.log('⚡ [Socket.io] Request updated:', updatedReq.id, updatedReq.status);
        setRequests((prev) =>
          prev.map((r) => (r.id === updatedReq.id ? updatedReq : r))
        );
      });

      // ⚡ REAL-TIME EVENT: Request Deleted
      const unsubDeleted = socketService.onRequestDeleted(({ id }) => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      });

      // ⚡ REAL-TIME EVENT: Urgent SOS Alert
      const unsubAlert = socketService.onUrgentAlert((alertData) => {
        triggerChime(true);
        showToast(`🚨 HIGH PRIORITY SOS ALERT: ${alertData.service} at ${alertData.room}!`, 'urgent');
      });

      // ⚡ REAL-TIME EVENT: Metrics Update
      const unsubMetrics = socketService.onMetricsUpdated((m) => {
        if (isMounted) setLiveMetrics(m);
      });

      return () => {
        isMounted = false;
        unsubCreated();
        unsubUpdated();
        unsubDeleted();
        unsubAlert();
        unsubMetrics();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Save to localStorage as secondary backup
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (e) {
      console.error("Failed to save requests", e);
    }
  }, [requests]);

  // --- ACTIONS (Dispatch to REST API + WebSocket) ---
  const handleCreateRequest = async (requestData) => {
    // 1. Optimistic update
    setRequests((prev) => [requestData, ...prev]);
    triggerChime(requestData.priority === 'Urgent');
    showToast(
      `Request dispatched: ${requestData.serviceTitle} for ${requestData.room}`,
      requestData.priority === 'Urgent' ? 'urgent' : 'success'
    );

    // 2. Transmit to Backend REST API (which broadcasts over Socket.io)
    await api.createRequest(requestData);
  };

  const handleStatusChange = async (requestId, newStatus, assignedTo) => {
    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updated = { ...r, status: newStatus };
          if (assignedTo) updated.assignedTo = assignedTo;
          return updated;
        }
        return r;
      })
    );
    triggerChime(false);
    showToast(`Request ${requestId} status updated to: ${newStatus}`, 'info');

    // Transmit to Backend
    await api.updateRequest(requestId, { status: newStatus, assignedTo });
  };

  const handleAssignStaff = async (requestId, staffName) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, assignedTo: staffName } : r))
    );
    showToast(`Assigned ${staffName} to ticket ${requestId}`, 'info');
    await api.updateRequest(requestId, { assignedTo: staffName });
  };

  const handleAddNote = async (requestId, noteText) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const prevNotes = r.notes ? `${r.notes} | ` : '';
          return { ...r, notes: `${prevNotes}${noteText}` };
        }
        return r;
      })
    );
    showToast(`Note logged to ticket ${requestId}`, 'info');
    await api.updateRequest(requestId, { appendNote: noteText });
  };

  const handleCancelRequest = async (requestId) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast(`Request ${requestId} cancelled`, 'info');
    await api.deleteRequest(requestId);
  };

  const handleClearCompleted = () => {
    setRequests((prev) => prev.filter((r) => r.status !== 'Completed'));
    showToast("Completed tickets archived from view", 'info');
  };

  const handleReseed = async () => {
    const res = await api.reseed();
    if (res && res.success) {
      showToast("Backend database reseeded with 50 rooms & Ethiopian staff", 'success');
      const refreshedRequests = await api.getRequests();
      if (refreshedRequests) setRequests(refreshedRequests);
    } else {
      showToast("Could not contact backend to reseed", 'urgent');
    }
  };

  // Quick simulation helper
  const handleSimulateRandomRequest = () => {
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    const services = SERVICE_CATEGORIES.filter((s) => !s.isEmergency);
    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomOption = randomService.options[Math.floor(Math.random() * randomService.options.length)];

    const simulated = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      room: randomRoom.name,
      guestName: randomRoom.guest,
      serviceId: randomService.id,
      serviceTitle: randomService.title,
      department: randomService.department,
      details: `${randomOption.label} • In-villa request for Lake Ziway hospitality`,
      timeRequested: 'Just now',
      timestamp: Date.now(),
      status: 'Pending',
      priority: 'Normal',
      assignedTo: 'Unassigned',
      notes: 'Guest ordered via in-villa QR scan',
    };

    handleCreateRequest(simulated);
  };

  const openServiceById = (serviceId) => {
    const service = SERVICE_CATEGORIES.find((s) => s.id === serviceId);
    if (service) setActiveServiceModal(service);
  };

  // Filter requests for currently selected room
  const currentRoomRequests = requests.filter((r) => r.room === currentRoom.name || r.room.includes(currentRoom.number));
  const activeRoomRequestsCount = currentRoomRequests.filter((r) => r.status !== 'Completed').length;
  
  // Overall pending and urgent for Staff Navbar pill
  const totalPending = requests.filter((r) => r.status === 'Pending').length;
  const totalUrgent = requests.filter((r) => r.priority === 'Urgent' && r.status !== 'Completed').length;

  // Filter categories for the Guest Portal
  const lakeSpecificServices = SERVICE_CATEGORIES.filter((s) => s.category === "Lake Ziway Signature");
  const standardServices = SERVICE_CATEGORIES.filter((s) => s.category === "Resort Services");
  const emergencyService = SERVICE_CATEGORIES.find((s) => s.isEmergency);

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isPhoneFrame={isPhoneFrame}
        setIsPhoneFrame={setIsPhoneFrame}
        currentRoom={currentRoom}
        setCurrentRoom={setCurrentRoom}
        rooms={rooms}
        onOpenQR={() => setIsQRModalOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onSimulateRequest={handleSimulateRandomRequest}
        pendingCount={totalPending}
        urgentCount={totalUrgent}
      />

      {/* Live WebSocket Status Banner */}
      <div className="bg-teal-950/90 border-b border-teal-800/50 py-1 px-4 text-[11px] flex items-center justify-between text-sand-300">
        <div className="flex items-center space-x-2">
          {isSocketConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-300">WebSocket Connected:</span>
              <span className="text-teal-200">Real-time instant sync active</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold text-amber-300">Offline Cache:</span>
              <span className="text-sand-300/80">Connect backend on port 5000 for multi-device sync</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline text-sand-400">
            50 Lake Ziway Rooms • {staffList.length} Ethiopian Staff
          </span>
          <button
            onClick={handleReseed}
            className="text-[10px] text-sand-300 hover:text-white flex items-center space-x-1 bg-teal-900/60 px-2 py-0.5 rounded border border-teal-700 transition"
            title="Reset sample rooms, staff & requests in backend"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Toast Notification Alert */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center space-x-3 text-xs font-semibold ${
            toastNotification.type === 'urgent'
              ? 'bg-red-600 text-white border-red-700 shadow-red-900/50 animate-pulse'
              : 'bg-teal-950 text-sand-100 border-teal-800 shadow-teal-950/40'
          }`}>
            {toastNotification.type === 'urgent' ? (
              <ShieldAlert className="w-4 h-4 text-white" />
            ) : (
              <Bell className="w-4 h-4 text-sand-400" />
            )}
            <span>{toastNotification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'guest' ? (
          /* GUEST VIEW */
          <div className={`mx-auto ${isPhoneFrame ? 'max-w-md py-6 px-3' : 'max-w-6xl py-6 px-4 sm:px-6'}`}>
            
            {/* Phone Simulator Frame Wrapper if toggled */}
            <div className={isPhoneFrame ? 'bg-slate-900 p-3 rounded-[44px] shadow-2xl border-4 border-slate-700' : ''}>
              
              {/* Phone Frame Speaker & Camera Notch */}
              {isPhoneFrame && (
                <div className="flex justify-between items-center px-6 py-1.5 text-slate-400 text-[11px] font-mono">
                  <span>9:41</span>
                  <div className="w-20 h-4 bg-slate-950 rounded-full" />
                  <span>5G 100%</span>
                </div>
              )}

              <div className={isPhoneFrame ? 'bg-sand-50 dark:bg-slate-900 rounded-[36px] overflow-hidden' : ''}>
                
                {/* 1. HERO HEADER SHOWCASE */}
                <div className="relative rounded-3xl overflow-hidden shadow-luxury border border-teal-900/40 min-h-[320px] sm:min-h-[400px] flex flex-col justify-between p-6 sm:p-10 text-white">
                  <img
                    src={heroAerialImg}
                    alt="Lake Ziway Resort Aerial View"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/65 to-black/55 backdrop-blur-[0.5px]" />
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sand-400 via-teal-400 to-amber-600" />

                  {/* Top Bar: Room Badge & Weather Pill */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 bg-teal-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sand-400/30 text-xs text-sand-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-sand-100">{currentRoom.name}</span>
                      <span className="text-sand-400/80">• {currentRoom.guest.split(' ')[0]}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-sand-200">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>{RESORT_INFO.weather.temp}</span>
                        <span className="text-teal-300">• Gentle Lake Breeze</span>
                      </div>
                      <button
                        onClick={() => setIsQRModalOpen(true)}
                        className="flex items-center space-x-1 bg-sand-500/30 hover:bg-sand-500/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-sand-400/40 text-xs text-sand-100 transition"
                        title="Scan QR Stand to Switch Villa"
                      >
                        <QrCode className="w-3.5 h-3.5 text-sand-300" />
                        <span className="hidden sm:inline">QR Scan</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Overlay Text Showcase */}
                  <div className="relative z-10 my-auto py-6 max-w-2xl">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sand-500/20 border border-sand-400/40 text-sand-300 text-xs font-semibold uppercase tracking-widest mb-3 backdrop-blur-sm">
                      <Waves className="w-3.5 h-3.5 text-sand-300" />
                      <span>Great Rift Valley Sanctuary • ሐይቅ ዝዋይ</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-sand-50 tracking-tight leading-tight drop-shadow-md">
                      Welcome to Lake Ziway Resort
                    </h1>
                    <p className="mt-2.5 text-sm sm:text-base text-teal-100/90 max-w-xl font-light leading-relaxed drop-shadow">
                      Experience serene Rift Valley waters, traditional Ethiopian coffee ceremonies, private boat safaris to ancient monasteries, and luxury lakeside villas.
                    </p>

                    {/* Quick Action Hero Buttons */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => openServiceById('lake-tour')}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sand-500 to-amber-700 hover:from-sand-400 hover:to-amber-600 text-teal-950 font-bold text-xs sm:text-sm shadow-lg transition flex items-center space-x-2"
                      >
                        <Compass className="w-4 h-4 text-teal-950" />
                        <span>Book Island Tour</span>
                      </button>

                      <button
                        onClick={() => openServiceById('traditional-coffee')}
                        className="px-4 py-2.5 rounded-xl bg-teal-900/80 hover:bg-teal-900 text-sand-100 border border-teal-600/60 font-semibold text-xs sm:text-sm backdrop-blur-md transition flex items-center space-x-2"
                      >
                        <Coffee className="w-4 h-4 text-sand-300" />
                        <span>Buna Ceremony</span>
                      </button>

                      <button
                        onClick={() => setIsRequestsDrawerOpen(true)}
                        className="px-3 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-sand-200 border border-white/20 text-xs font-medium backdrop-blur-md transition flex items-center space-x-1.5"
                      >
                        <Bell className="w-3.5 h-3.5 text-sand-400" />
                        <span>Orders ({activeRoomRequestsCount})</span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Quick Status Strip */}
                  <div className="relative z-10 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-sand-200/80 gap-2">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sand-400" />
                      <span>Debre Sina & Tulu Gudo Island Waters</span>
                    </span>
                    <button
                      onClick={() => setIsEmergencyModalOpen(true)}
                      className="inline-flex items-center space-x-1 text-red-300 hover:text-red-200 font-semibold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      <span>Resort Emergency SOS</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Header Greeting & Tracker Bar */}
                <div className="mt-6">
                  <GuestHeader
                    currentRoom={currentRoom}
                    activeRequestsCount={activeRoomRequestsCount}
                    onOpenActiveRequests={() => setIsRequestsDrawerOpen(true)}
                    onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                    onOpenQR={() => setIsQRModalOpen(true)}
                  />
                </div>

                <div className="p-2 sm:p-4 space-y-9 mt-4">
                  
                  {/* 2. FEATURED ACTIVITIES ROW: Kayak & Pool Cabana */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Waves className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-sand-100">
                            Featured Activities
                          </h2>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Immerse yourself in Lake Ziway's peaceful waters and luxury cabanas
                        </p>
                      </div>
                      <span className="text-xs text-sand-600 dark:text-sand-400 font-bold uppercase tracking-wider hidden sm:block">
                        Water & Wellness
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Lake Kayaking */}
                      <div 
                        onClick={() => openServiceById('water-sports')}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-sand-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-luxury hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-xl shadow-md">
                            <img
                              src={kayakImg}
                              alt="Lake Kayaking at Ziway Resort"
                              className="w-full h-full rounded-xl shadow-md object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent rounded-xl" />
                            <span className="absolute top-3 left-3 bg-teal-950/80 backdrop-blur-md text-sand-200 border border-teal-700/80 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                              Complimentary
                            </span>
                            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-sand-300 text-xs px-2.5 py-1 rounded-lg">
                              Marina Dock Pier
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                                Water Adventures
                              </span>
                              <span className="text-xs text-sand-500 font-serif italic">
                                የሐይቅ ስፖርቶች
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-sand-100 mt-1 group-hover:text-teal-700 dark:group-hover:text-sand-300 transition-colors">
                              Lake Kayaking
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                              Paddle past authentic thatched lakefront chalets, tranquil reed beds, and sunbathing pelicans. Single and tandem kayaks available with USCG life vests and dry bags.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-800 dark:text-teal-400">
                            Available All Day • Marina Slip 1
                          </span>
                          <span className="text-xs font-bold text-sand-600 dark:text-sand-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                            <span>Request Gear</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Poolside Cabanas */}
                      <div 
                        onClick={() => openServiceById('lake-spa')}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-sand-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-luxury hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-xl shadow-md">
                            <img
                              src={poolCabanaImg}
                              alt="Luxury Poolside Cabanas at Lake Ziway"
                              className="w-full h-full rounded-xl shadow-md object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent rounded-xl" />
                            <span className="absolute top-3 left-3 bg-sand-500 text-teal-950 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                              VIP Reserved
                            </span>
                            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-sand-300 text-xs px-2.5 py-1 rounded-lg">
                              Turquoise Infinity Pool
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                                Spa & Relaxation
                              </span>
                              <span className="text-xs text-sand-500 font-serif italic">
                                የመዋኛ ገንዳ ካባና
                              </span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-sand-100 mt-1 group-hover:text-teal-700 dark:group-hover:text-sand-300 transition-colors">
                              Poolside Cabanas
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                              Lounge in secluded timber cabanas framed by crisp white drapes beside the shimmering pool. Order chilled fruit spritzers, Ethiopian coffee body wraps, or cabana massages.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-sand-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-800 dark:text-teal-400">
                            Complimentary Cabana Daybed
                          </span>
                          <span className="text-xs font-bold text-sand-600 dark:text-sand-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                            <span>Reserve Cabana</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 3. DINING SECTION */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Utensils className="w-5 h-5 text-amber-600" />
                          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-sand-100">
                            Lakeside Dining & Culinary
                          </h2>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Fresh Lake Ziway fish, royal Ethiopian feasts, and open-air pavilion breakfasts
                        </p>
                      </div>
                      <span className="text-xs text-sand-600 dark:text-sand-400 font-bold uppercase tracking-wider hidden sm:block">
                        Chef's Table
                      </span>
                    </div>

                    <div 
                      onClick={() => openServiceById('dining')}
                      className="group bg-gradient-to-br from-sand-100/90 via-sand-50 to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-3xl border border-sand-300/80 dark:border-slate-800 overflow-hidden shadow-luxury hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        <div className="lg:col-span-7 relative h-64 sm:h-80 overflow-hidden">
                          <img
                            src={diningImg}
                            alt="Lakeside Dining & Waterpark View"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                          <div className="absolute top-4 left-4 bg-teal-950/85 backdrop-blur-md text-sand-200 border border-teal-700/80 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            Table 9 • Waterpark & Lakeside Vista
                          </div>
                          <div className="absolute bottom-4 left-4 lg:hidden text-white">
                            <span className="text-xs font-medium text-sand-300">Under Thatched Veranda</span>
                            <h3 className="text-lg font-serif font-bold">Lakeside Dining & Waterpark View</h3>
                          </div>
                        </div>

                        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                              <span>Pergola Breakfast & Tilapia Feast</span>
                              <span>•</span>
                              <span className="font-serif italic text-sand-600">ምግብ ቤት</span>
                            </div>
                            
                            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-sand-100 leading-snug group-hover:text-amber-800 dark:group-hover:text-sand-300 transition-colors">
                              Lakeside Dining & Waterpark View
                            </h3>

                            <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              Dine beneath authentic woven grass ceilings looking directly onto the vibrant resort waterpark and shimmering Lake Ziway. Enjoy table-side freshly roasted coffee, tropical fruit juices, whole grilled Tilapia (*Asa Tibs*), and sizzling *Shekla Tibs*.
                            </p>

                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-sand-200 dark:border-slate-700">
                                <span className="text-slate-400 text-[10px] uppercase font-bold block">Breakfast Table</span>
                                <span className="font-semibold text-slate-800 dark:text-sand-200">Fresh pastries, honey & eggs</span>
                              </div>
                              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800 border border-sand-200 dark:border-slate-700">
                                <span className="text-slate-400 text-[10px] uppercase font-bold block">Lake Catch</span>
                                <span className="font-semibold text-slate-800 dark:text-sand-200">Crispy Ziway Asa Tibs</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-sand-200/90 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Serving Hours: <strong>06:30 – 22:30</strong>
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openServiceById('dining');
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                            >
                              <span>Reserve Table / Order</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. COMPLETE LAKE ZIWAY & RESORT CATALOG SECTION */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Compass className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-sand-100">
                          All Lake Experiences & In-Villa Services
                        </h2>
                      </div>
                      <span className="text-xs text-slate-500">
                        Touch any service to customize
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {lakeSpecificServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onSelect={(s) => setActiveServiceModal(s)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 5. RESORT COMFORTS & HOUSEKEEPING */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-sand-500" />
                        <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-sand-100">
                          In-Villa & Attendant Services
                        </h2>
                      </div>
                      <span className="text-xs text-slate-500">
                        24/7 Hospitality Team
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {standardServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onSelect={(s) => setActiveServiceModal(s)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 6. EMERGENCY SOS CARD */}
                  {emergencyService && (
                    <div className="pt-2">
                      <ServiceCard
                        service={emergencyService}
                        onSelect={() => setIsEmergencyModalOpen(true)}
                      />
                    </div>
                  )}

                  {/* Footer Brand Note */}
                  <div className="text-center py-8 border-t border-sand-200 dark:border-slate-800">
                    <div className="tibeb-accent-bar w-32 mx-auto mb-3" />
                    <p className="font-serif italic text-sm text-sand-800 dark:text-sand-300">
                      "Where the Rift Valley Waters Meet Timeless Ethiopian Hospitality"
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Lake Ziway (Dambal), Oromia Region, Ethiopia • Dial Ext. 0 from your villa phone
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        ) : (
          /* STAFF DASHBOARD VIEW */
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
            
            {/* Staff Desk Hero Operational Bar */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-950 via-teal-900 to-teal-950 border border-teal-800 p-6 sm:p-8 text-sand-100 shadow-luxury">
              <img
                src={heroAerialImg}
                alt="Lake Ziway Resort Desk"
                className="absolute inset-0 w-full h-full object-cover opacity-20 object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-950/95 via-teal-950/90 to-teal-900/80" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-sand-500/20 border border-sand-400/40 text-sand-300 text-[10px] uppercase font-bold tracking-widest">
                      Live Operations Desk • Lake Ziway Command
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      isSocketConnected ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' : 'bg-amber-950 text-amber-300 border border-amber-700/60'
                    }`}>
                      {isSocketConnected ? '⚡ Real-time Socket.io Active' : '🟡 Offline Mode'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-sand-100 tracking-tight mt-1.5">
                    Guest Request Management Console
                  </h1>
                  <p className="text-xs sm:text-sm text-teal-200/90 max-w-xl mt-1">
                    Real-time WebSocket dispatch board across 50 lakefront villas, boat excursions, buna ceremonies, and culinary orders.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateRandomRequest}
                    className="px-4 py-2.5 bg-gradient-to-r from-sand-500 to-sand-600 hover:from-sand-400 hover:to-sand-500 text-teal-950 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-950 animate-spin" />
                    <span>Simulate Guest Influx</span>
                  </button>
                  <button
                    onClick={() => setIsQRModalOpen(true)}
                    className="px-3.5 py-2.5 bg-teal-900/80 hover:bg-teal-850 text-sand-200 border border-teal-700/80 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5 text-sand-300" />
                    <span>50 Villa QR Cards</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top KPI Metrics Row */}
            <StaffStats requests={requests} />

            {/* Experience Popularity Breakdown & Peak Hours */}
            <AnalyticsChart
              requests={requests}
              onClearCompleted={handleClearCompleted}
              onSimulateSurge={handleSimulateRandomRequest}
            />

            {/* Central Filterable Request Board Table across all 50 rooms */}
            <RequestTable
              requests={requests}
              onStatusChange={handleStatusChange}
              onSelectRequest={(req) => setInspectedStaffRequest(req)}
              onAssignStaff={handleAssignStaff}
              rooms={rooms}
            />

          </div>
        )}
      </main>

      {/* MODALS & DRAWERS */}
      
      {/* 1. Guest Service Request Customization Modal */}
      {activeServiceModal && (
        <RequestModal
          service={activeServiceModal}
          currentRoom={currentRoom}
          onClose={() => setActiveServiceModal(null)}
          onSubmitRequest={handleCreateRequest}
        />
      )}

      {/* 2. Guest Active Orders Tracker Drawer */}
      <ActiveRequestsDrawer
        isOpen={isRequestsDrawerOpen}
        onClose={() => setIsRequestsDrawerOpen(false)}
        requests={currentRoomRequests}
        onCancelRequest={handleCancelRequest}
      />

      {/* 3. Emergency SOS Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        currentRoom={currentRoom}
        onTriggerEmergency={handleCreateRequest}
      />

      {/* 4. QR Code In-Villa Card & Room Switcher Modal across 50 rooms */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        currentRoom={currentRoom}
        rooms={rooms}
        onSelectRoom={(r) => {
          setCurrentRoom(r);
          showToast(`Switched active view to ${r.name}`, 'info');
        }}
      />

      {/* 5. Staff Detailed Request Management Drawer */}
      {inspectedStaffRequest && (
        <RequestDetailsModal
          request={inspectedStaffRequest}
          onClose={() => setInspectedStaffRequest(null)}
          onUpdateStatus={(id, status, staff) => handleStatusChange(id, status, staff)}
          onUpdateStaff={(id, staff) => handleAssignStaff(id, staff)}
          onAddNote={(id, note) => handleAddNote(id, note)}
          staffList={staffList}
        />
      )}

    </div>
  );
}
