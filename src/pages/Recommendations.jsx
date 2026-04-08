import React, { useState } from 'react'
import {
  Thermometer, Lightbulb, Zap, Lock, PowerOff,
  ChevronDown, ChevronUp, Wind, Sun, CalendarClock,
  MoonStar, BatteryLow, Lamp
} from 'lucide-react'

const recommendations = [
  {
    id: 1,
    icon: Thermometer,
    color: 'bg-blue-50 text-blue-500',
    border: 'border-blue-100',
    tag: 'HVAC',
    
    tagColor: 'bg-blue-50 text-blue-500',
    title: 'Smart HVAC Air Conditioning',
    summary: 'Air conditioning is the single largest electricity consumer in the building.',
    points: [
      'Set AC temperatures at 24°C across all spaces.',
      'Install programmable thermostats for automated scheduling.',
      'Automatically turn off AC units after each class ends.',
    ],
  },
  {
    id: 2,
    icon: Lightbulb,
    color: 'bg-amber-50 text-amber-500',
    border: 'border-amber-100',
    tag: 'Lighting',
    tagColor: 'bg-amber-50 text-amber-500',
    title: 'Energy-Efficient Appliances & Equipment',
    summary: 'GICT has many old electric bulbs that consume significantly more electricity than modern alternatives.',
    points: [
      'Replace old bulbs with LED bulbs — 80% less electricity consumption.',
      'Use 5-star rated lights and bulbs throughout the building.',
      'Install energy-efficient ceiling fans to replace older models.',
    ],
  },
  {
    id: 3,
    icon: Zap,
    color: 'bg-emerald-50 text-emerald-500',
    border: 'border-emerald-100',
    tag: 'Automation',
    tagColor: 'bg-emerald-50 text-emerald-500',
    title: 'Automated Smart Lighting System',
    summary: 'Motion and daylight sensors eliminate unnecessary lighting in unoccupied spaces.',
    points: [
      'Install motion sensors in classrooms, corridors, and washrooms.',
      'Use daylight sensors to dim or switch off lights when natural light is sufficient.',
      'Extend the same automation to water systems for additional savings.',
    ],
  },
  {
    id: 4,
    icon: Lock,
    color: 'bg-violet-50 text-violet-500',
    border: 'border-violet-100',
    tag: 'Policy',
    tagColor: 'bg-violet-50 text-violet-500',
    title: 'Mandatory AC Temperature Policy',
    summary: 'A centralized temperature policy is the fastest, cheapest way to reduce consumption.',
    points: [
      'Fix centralized AC temperature at 24°C building-wide.',
      'Restrict manual changes by students using lockable thermostats.',
      'Immediate reduction in consumption load at zero implementation cost.',
    ],
  },
  {
    id: 5,
    icon: PowerOff,
    color: 'bg-red-50 text-red-500',
    border: 'border-red-100',
    tag: 'Operations',
    tagColor: 'bg-red-50 text-red-500',
    title: 'Automatic Shutdown After Lecture Hours',
    summary: 'All electrical equipment must shut down after each class and restart fresh for the next.',
    points: [
      'Mandatory shutdown of ACs, projectors, lights, and fans after every class.',
      'Next class restarts all equipment fresh — no idle consumption.',
      'Enforce as a compulsory operational policy across all departments.',
    ],
  },
  {
    id: 6,
    icon: Wind,
    color: 'bg-sky-50 text-sky-500',
    border: 'border-sky-100',
    tag: 'Cooling',
    tagColor: 'bg-sky-50 text-sky-500',
    title: 'Optimize AC Usage with Natural Cooling',
    summary: 'Combining smart thermostat settings with passive cooling reduces the overall cooling load.',
    points: [
      'Maintain thermostat settings between 24–26°C.',
      'Use curtains or blinds to reduce heat gain from direct sunlight.',
      'Ensure doors and windows are kept closed when AC is running.',
    ],
  },
  {
    id: 7,
    icon: Sun,
    color: 'bg-yellow-50 text-yellow-500',
    border: 'border-yellow-100',
    tag: 'Daylighting',
    tagColor: 'bg-yellow-50 text-yellow-500',
    title: 'Maximize Daylight Usage',
    summary: 'Leveraging natural light reduces the base lighting load throughout the day.',
    points: [
      'Turn off artificial lights in well-lit areas during daytime.',
      'Use daylight sensors or enforce manual switching policies.',
      'Rearrange workspaces to be closer to natural light sources where possible.',
    ],
  },
  {
    id: 8,
    icon: CalendarClock,
    color: 'bg-teal-50 text-teal-500',
    border: 'border-teal-100',
    tag: 'Scheduling',
    tagColor: 'bg-teal-50 text-teal-500',
    title: 'Align High-Energy Activities with Solar Generation',
    summary: 'Running heavy equipment during solar generation hours reduces dependency on grid power.',
    points: [
      'Schedule labs and heavy equipment usage during peak solar generation hours.',
      'Shift high-load activities to daytime to make better use of solar energy.',
      'Reduce grid dependency by aligning energy-intensive tasks with daylight.',
    ],
  },
  {
    id: 9,
    icon: MoonStar,
    color: 'bg-indigo-50 text-indigo-500',
    border: 'border-indigo-100',
    tag: 'Night-Time',
    tagColor: 'bg-indigo-50 text-indigo-500',
    title: 'Turn Off Idle Equipment at Night',
    summary: 'Eliminating idle loads after hours prevents unnecessary energy wastage overnight.',
    points: [
      'Ensure ACs, lights, and fans are turned off in all unused rooms at night.',
      'Implement a shutdown checklist for classrooms and labs at end of day.',
      'Assign responsibility to a designated staff member per floor or zone.',
    ],
  },
  {
    id: 10,
    icon: Lamp,
    color: 'bg-orange-50 text-orange-500',
    border: 'border-orange-100',
    tag: 'Night Lighting',
    tagColor: 'bg-orange-50 text-orange-500',
    title: 'Energy-Efficient Night-Time Lighting',
    summary: 'Targeted LED and sensor-based lighting reduces the continuous overnight lighting load.',
    points: [
      'Replace all night-time lighting with energy-efficient LEDs.',
      'Install motion sensors in corridors, washrooms, and outdoor areas.',
      'Use only 50–60% of total lighting capacity for passages and common areas at night.',
    ],
  },
]

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3 mt-4 mb-1">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
)

const Card = ({ rec }) => {
  const [open, setOpen] = useState(false)
  const Icon = rec.icon

  return (
    <div className={`bg-white rounded-2xl border ${rec.border} shadow-sm overflow-hidden`}>
      <div className="p-6 flex items-start gap-5">
        <div className={`p-4 rounded-2xl ${rec.color} shrink-0`}>
          <Icon size={28} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rec.tagColor}`}>
              {rec.tag}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{rec.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{rec.summary}</p>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-3 border-t border-gray-50 text-sm text-gray-400 hover:bg-gray-50 transition-colors"
      >
        <span>{open ? 'Hide recommendations' : 'View recommendations'}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <ul className="px-6 pb-6 flex flex-col gap-3 pt-2">
          {rec.points.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-gray-600">
              <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${rec.color}`} />
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const daytimeRecs = recommendations.filter(r => r.id <= 8)
const nightRecs = recommendations.filter(r => r.id > 8)

const Recommendations = () => {
  return (
    <div className="flex flex-col gap-6 pt-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
          Recommendations
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Actionable steps to reduce energy consumption and lower your building's electricity bill.
        </p>
      </div>

      <SectionDivider label="Daytime" />
      <div className="flex flex-col gap-5">
        {daytimeRecs.map(rec => <Card key={rec.id} rec={rec} />)}
      </div>

      <SectionDivider label="Night-Time" />
      <div className="flex flex-col gap-5">
        {nightRecs.map(rec => <Card key={rec.id} rec={rec} />)}
      </div>
    </div>
  )
}

export default Recommendations