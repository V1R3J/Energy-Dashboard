import React, { useState } from 'react';
import {
  Building2,
  Users,
  Layers,
  MapPin,
  Calendar,
  Cpu,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Square,
  Home,
  Server,
  Coffee,
  FlaskConical,
  Presentation,
  DoorOpen,
  ArrowUpDown,
  Warehouse,
  GraduationCap,
  LayoutDashboard,
  Navigation,
  Phone,
  Globe,
  Clock,
  ExternalLink,
} from 'lucide-react';

import b1 from "../assets/b1.jpg";
import b2 from "../assets/b2.jpg";
import b3 from "../assets/b3.png";
import b4 from "../assets/b4.jpg";

const floorData = {
  basement: {
    name: 'Basement Floor',
    totalArea: { sqm: 3605, sqft: 38806 },
    color: 'slate',
    facilities: [
      { type: 'Storage & Infrastructure', rooms: 1, area: { sqm: 3605, sqft: 38806 }, icon: Warehouse },
    ],
  },
  ground: {
    name: 'Ground Floor',
    totalArea: { sqm: 6491, sqft: 69870 },
    color: 'blue',
    facilities: [
      { type: 'Classrooms',          rooms: 3, area: { sqm: 490,  sqft: 5274  }, icon: Presentation    },
      { type: 'Labs',                rooms: 3, area: { sqm: 569,  sqft: 6125  }, icon: FlaskConical    },
      { type: 'Library',             rooms: 1, area: { sqm: 404,  sqft: 4349  }, icon: BookOpen        },
      { type: 'Auditorium',          rooms: 1, area: { sqm: 236,  sqft: 2540  }, icon: Users           },
      { type: 'Admin Rooms',         rooms: 4, area: { sqm: 336,  sqft: 3617  }, icon: LayoutDashboard },
      { type: 'Server Room',         rooms: 1, area: { sqm: 136,  sqft: 1464  }, icon: Server          },
      { type: 'Meeting Rooms',       rooms: 2, area: { sqm: 52,   sqft: 560   }, icon: DoorOpen        },
      { type: 'Canteen',             rooms: 1, area: { sqm: 316,  sqft: 3401  }, icon: Coffee          },
      { type: 'Passage & Corridors', rooms: 1, area: { sqm: 3952, sqft: 42540 }, icon: ArrowUpDown     },
    ],
  },
  first: {
    name: 'First Floor',
    totalArea: { sqm: 6491, sqft: 69870 },
    color: 'indigo',
    facilities: [
      { type: 'Classrooms',            rooms: 9,  area: { sqm: 1415, sqft: 15231 }, icon: Presentation    },
      { type: 'Labs',                  rooms: 2,  area: { sqm: 404,  sqft: 4349  }, icon: FlaskConical    },
      { type: 'Faculty Offices',       rooms: 22, area: { sqm: 288,  sqft: 3100  }, icon: Users           },
      { type: 'Admin Rooms',           rooms: 3,  area: { sqm: 77,   sqft: 829   }, icon: LayoutDashboard },
      { type: 'Student Activity Room', rooms: 1,  area: { sqm: 134,  sqft: 1442  }, icon: GraduationCap   },
      { type: 'Meeting Rooms',         rooms: 2,  area: { sqm: 85,   sqft: 915   }, icon: DoorOpen        },
      { type: 'Passage & Stairs',      rooms: 1,  area: { sqm: 4088, sqft: 44004 }, icon: ArrowUpDown     },
    ],
  },
  second: {
    name: 'Second Floor',
    totalArea: { sqm: 6453, sqft: 69462 },
    color: 'violet',
    facilities: [
      { type: 'Classrooms',            rooms: 7,  area: { sqm: 1008, sqft: 10850 }, icon: Presentation    },
      { type: 'Labs',                  rooms: 5,  area: { sqm: 869,  sqft: 9354  }, icon: FlaskConical    },
      { type: 'Faculty Offices',       rooms: 22, area: { sqm: 288,  sqft: 3100  }, icon: Users           },
      { type: 'Admin Rooms',           rooms: 1,  area: { sqm: 48,   sqft: 517   }, icon: LayoutDashboard },
      { type: 'Student Activity Room', rooms: 1,  area: { sqm: 134,  sqft: 1442  }, icon: GraduationCap   },
      { type: 'Meeting Rooms',         rooms: 1,  area: { sqm: 63,   sqft: 678   }, icon: DoorOpen        },
      { type: 'Passage & Stairs',      rooms: 1,  area: { sqm: 4043, sqft: 43521 }, icon: ArrowUpDown     },
    ],
  },
  third: {
    name: 'Third Floor',
    totalArea: { sqm: 6453, sqft: 69462 },
    color: 'sky',
    facilities: [
      { type: 'Classrooms',            rooms: 1,  area: { sqm: 204,  sqft: 2196  }, icon: Presentation    },
      { type: 'Labs',                  rooms: 10, area: { sqm: 1663, sqft: 17900 }, icon: FlaskConical    },
      { type: 'Faculty Offices',       rooms: 22, area: { sqm: 288,  sqft: 3100  }, icon: Users           },
      { type: 'Admin Rooms',           rooms: 3,  area: { sqm: 103,  sqft: 1109  }, icon: LayoutDashboard },
      { type: 'Student Activity Room', rooms: 1,  area: { sqm: 121,  sqft: 1302  }, icon: GraduationCap   },
      { type: 'Passage & Stairs',      rooms: 1,  area: { sqm: 4074, sqft: 43854 }, icon: ArrowUpDown     },
    ],
  },
};

const colorMap = {
  slate:  { bg: 'bg-slate-50',  border: 'border-slate-300',  text: 'text-slate-600',  badge: 'bg-slate-100 text-slate-700',   accent: 'bg-slate-500',  hover: 'hover:bg-slate-50'  },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',     accent: 'bg-blue-600',   hover: 'hover:bg-blue-50'   },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', accent: 'bg-indigo-600', hover: 'hover:bg-indigo-50' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-600', badge: 'bg-violet-100 text-violet-700', accent: 'bg-violet-600', hover: 'hover:bg-violet-50' },
  sky:    { bg: 'bg-sky-50',    border: 'border-sky-300',    text: 'text-sky-600',    badge: 'bg-sky-100 text-sky-700',       accent: 'bg-sky-600',    hover: 'hover:bg-sky-50'    },
};

/* ─── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-xl ${accent} shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-1 font-semibold uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

/* ─── Location Map ───────────────────────────────────────────── */
const LocationMap = () => {
  const address = 'GICT Building, Ahmedabad University, Navrangpura, Ahmedabad, Gujarat 380009';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">Location & Contact</h2>
            <p className="text-xs text-slate-500 mt-0.5">GICT Building, Ahmedabad University</p>
          </div>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in Maps
        </a>
      </div>

      <div className="grid lg:grid-cols-3">
        <div className="lg:col-span-2 h-96 lg:h-[480px]">
          <iframe
            title="GICT Building Location"
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="border-t lg:border-t-0 lg:border-l border-slate-100 divide-y divide-slate-100">
          <div className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-rose-50 shrink-0 mt-0.5">
                <Navigation className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Address</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  GICT Building<br />
                  Ahmedabad University<br />
                  Navrangpura, Ahmedabad<br />
                  Gujarat — 380009
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 shrink-0 mt-0.5">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Website</p>
                <a
                  href="https://ahduni.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  ahduni.edu.in
                </a>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-green-50 shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Contact</p>
                <p className="text-sm text-slate-700 font-medium">+91 79 6191 0000</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Working Hours</p>
                <p className="text-sm text-slate-700 font-medium">Mon – Sat</p>
                <p className="text-sm text-slate-500">8:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Floor Panel ────────────────────────────────────────────── */
const FloorPanel = ({ floorKey, floor, isOpen, onToggle }) => {
  const c = colorMap[floor.color];
  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${isOpen ? c.border : 'border-slate-200'}`}>
      <button
        onClick={() => onToggle(floorKey)}
        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${isOpen ? c.bg : 'hover:bg-slate-50'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-lg ${c.accent}`}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{floor.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {floor.totalArea.sqm.toLocaleString()} sqm &middot; {floor.totalArea.sqft.toLocaleString()} sqft
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.badge}`}>
            {floor.facilities.length} spaces
          </span>
          {isOpen
            ? <ChevronUp className={`w-5 h-5 ${c.text}`} />
            : <ChevronDown className="w-5 h-5 text-slate-400" />
          }
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100">
          {floor.facilities.map((facility, idx) => {
            const FacIcon = facility.icon;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between px-6 py-3.5 border-b border-slate-50 last:border-0 ${c.hover} transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <FacIcon className={`w-4 h-4 ${c.text} shrink-0`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{facility.type}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {facility.rooms} {facility.rooms === 1 ? 'room' : 'rooms'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${c.text}`}>
                    {facility.area.sqm.toLocaleString()} sqm
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {facility.area.sqft.toLocaleString()} sqft
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────────── */
const BuildingDetails = () => {
  const [expandedFloor, setExpandedFloor] = useState(null);
  const toggleFloor = (floor) => setExpandedFloor(expandedFloor === floor ? null : floor);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="w-full px-6 xl:px-10 py-8 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1.5">
              <MapPin className="w-4 h-4" />
              <span>Ahmedabad University</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">GICT Building</h1>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm w-fit">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Inaugurated: <span className="text-slate-800 font-semibold">March 18, 2020</span></span>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className="p-2.5 rounded-lg bg-blue-600">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-base font-semibold text-slate-800">About the Building</h2>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                The GICT building at Ahmedabad University serves as a central hub for technology, innovation, and
                interdisciplinary learning on campus. Designed to support modern academic needs, the building houses
                advanced computer labs, collaborative workspaces, and smart classrooms that enable students to engage
                in hands-on learning and research.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-4">
                It plays a key role for students in fields like computer science, data science, and information
                technology, providing access to essential digital infrastructure and project-based environments.
                Beyond academics, GICT fosters creativity and teamwork — a space where students develop practical
                skills, experiment with ideas, and work on real-world applications.
              </p>
            </div>
            <div className="relative h-80 lg:h-auto">
              <img src={b1} alt="GICT Building" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-500" />
            Overview
          </h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard icon={Layers}   value="5"        label="Total Floors"  accent="bg-blue-600"   />
            <StatCard icon={Square}   value="29,494"   label="Area (sqm)"    accent="bg-indigo-600" />
            <StatCard icon={Home}     value="3,17,469" label="Area (sqft)"   accent="bg-violet-600" />
            <StatCard icon={BookOpen} value="20"       label="Classrooms"    accent="bg-sky-600"    />
          </div>
        </div>

        {/* Location Map */}
        <LocationMap />

        {/* Ground Floor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className="p-2.5 rounded-lg bg-blue-600">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">Ground Floor — Core Academic Infrastructure</h2>
              <p className="text-xs text-slate-500 mt-0.5">6,491 sqm &middot; 69,870 sqft</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="relative h-80 lg:h-auto">
              <img src={b2} alt="Ground Floor" className="w-full h-full object-cover" />
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { label: 'Classrooms',  val: '3 rooms · 490 sqm',  icon: Presentation    },
                { label: 'Labs',        val: '3 rooms · 569 sqm',  icon: FlaskConical    },
                { label: 'Library',     val: '1 room · 404 sqm',   icon: BookOpen        },
                { label: 'Auditorium',  val: '1 room · 236 sqm',   icon: Users           },
                { label: 'Canteen',     val: '1 room · 316 sqm',   icon: Coffee          },
                { label: 'Admin Rooms', val: '4 rooms · 336 sqm',  icon: LayoutDashboard },
              ].map(({ label, val, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between px-6 py-3.5 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                    <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                    {label}
                  </div>
                  <span className="text-sm text-blue-600 font-bold">{val}</span>
                </div>
              ))}
              <div className="flex justify-between px-6 py-3.5 bg-blue-600">
                <span className="text-white text-sm font-semibold">Total Area</span>
                <span className="text-white text-sm font-bold">6,491 sqm</span>
              </div>
            </div>
          </div>
        </div>

        {/* First Floor */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className="p-2.5 rounded-lg bg-indigo-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800">First Floor — Learning & Collaboration</h2>
              <p className="text-xs text-slate-500 mt-0.5">6,491 sqm &middot; 69,870 sqft</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2">
            <div className="divide-y divide-slate-100 lg:order-1">
              {[
                { label: 'Classrooms',           val: '9 rooms · 1,415 sqm', icon: Presentation    },
                { label: 'Faculty Offices',       val: '22 rooms · 288 sqm',  icon: Users           },
                { label: 'Labs',                  val: '2 rooms · 404 sqm',   icon: FlaskConical    },
                { label: 'Student Activity Room', val: '1 room · 134 sqm',    icon: GraduationCap   },
                { label: 'Meeting Rooms',         val: '2 rooms · 85 sqm',    icon: DoorOpen        },
                { label: 'Admin Rooms',           val: '3 rooms · 77 sqm',    icon: LayoutDashboard },
              ].map(({ label, val, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between px-6 py-3.5 hover:bg-indigo-50 transition-colors">
                  <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                    <Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                    {label}
                  </div>
                  <span className="text-sm text-indigo-600 font-bold">{val}</span>
                </div>
              ))}
              <div className="flex justify-between px-6 py-3.5 bg-indigo-600">
                <span className="text-white text-sm font-semibold">Total Area</span>
                <span className="text-white text-sm font-bold">6,491 sqm</span>
              </div>
            </div>
            <div className="relative h-80 lg:h-auto lg:order-2">
              <img src={b3} alt="First Floor" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Floor-by-Floor Breakdown */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1.5 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            Floor-by-Floor Breakdown
          </h2>
          <p className="text-sm text-slate-500 mb-4">Click a floor to expand facility details</p>
          <div className="space-y-3">
            {Object.entries(floorData).map(([key, floor]) => (
              <FloorPanel
                key={key}
                floorKey={key}
                floor={floor}
                isOpen={expandedFloor === key}
                onToggle={toggleFloor}
              />
            ))}
          </div>
        </div>

        {/* Campus Area Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm">
          <img src={b4} alt="GICT Building Overview" className="w-full h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2.5 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Total Campus Area</span>
            </div>
            <p className="text-4xl font-bold leading-tight">
              29,494 sqm
              <span className="block text-amber-400">3,17,469 sqft</span>
            </p>
            <p className="text-sm text-slate-300 mt-3 max-w-2xl">
              A state-of-the-art facility spanning five floors, designed to foster innovation, collaboration, and
              academic excellence in technology and information sciences.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BuildingDetails;