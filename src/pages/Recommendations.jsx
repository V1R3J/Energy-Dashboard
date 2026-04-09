import React, { useState } from 'react'
import {
  Thermometer, Lightbulb, Zap, Lock, PowerOff,
  Wind, Sun, CalendarClock, MoonStar, Lamp,
  CheckSquare, Square
} from 'lucide-react'

const recommendations = [
  {
    id: 1,
    section: 'daytime',
    icon: Thermometer,
    palette: { icon: '#E6F1FB', iconText: '#185FA5', tag: '#E6F1FB', tagText: '#185FA5', num: '#B5D4F4', numText: '#0C447C', border: '#B5D4F4' },
    tag: 'HVAC', tagFull: 'Heating, Ventilation & Air Conditioning',
    title: 'Smart HVAC air conditioning',
    summary: 'Air conditioning is the single largest electricity consumer in the building.',
    points: [
      'Set AC temperatures at 24°C across all spaces.',
      'Install programmable thermostats for automated scheduling.',
      'Automatically turn off AC units after each class ends.',
    ],
  },
  {
    id: 2,
    section: 'daytime',
    icon: Lightbulb,
    palette: { icon: '#FAEEDA', iconText: '#854F0B', tag: '#FAEEDA', tagText: '#854F0B', num: '#FAC775', numText: '#633806', border: '#FAC775' },
    tag: 'Lighting',
    title: 'Energy-efficient appliances & equipment',
    summary: 'GICT has many old electric bulbs that consume significantly more electricity than modern LED alternatives.',
    points: [
      'Replace old bulbs with LED (Light Emitting Diode) bulbs — 80% less electricity.',
      'Use 5-star rated lights and bulbs throughout the building.',
      'Install energy-efficient ceiling fans to replace older models.',
    ],
  },
  {
    id: 3,
    section: 'daytime',
    icon: Zap,
    palette: { icon: '#EAF3DE', iconText: '#3B6D11', tag: '#EAF3DE', tagText: '#3B6D11', num: '#C0DD97', numText: '#27500A', border: '#C0DD97' },
    tag: 'Automation',
    title: 'Automated smart lighting system',
    summary: 'Motion and daylight sensors eliminate unnecessary lighting in unoccupied spaces.',
    points: [
      'Install PIR (Passive Infrared) motion sensors in classrooms, corridors, and washrooms.',
      'Use LDR (Light Dependent Resistor) daylight sensors to dim or switch off lights.',
      'Extend the same automation to water systems for additional savings.',
    ],
  },
  {
    id: 4,
    section: 'daytime',
    icon: Lock,
    palette: { icon: '#EEEDFE', iconText: '#534AB7', tag: '#EEEDFE', tagText: '#534AB7', num: '#CECBF6', numText: '#3C3489', border: '#CECBF6' },
    tag: 'Policy',
    title: 'Mandatory AC temperature policy',
    summary: 'A centralised temperature policy is the fastest, cheapest way to reduce consumption.',
    points: [
      'Fix centralised AC temperature at 24°C building-wide.',
      'Restrict manual changes by students using lockable thermostats.',
      'Immediate reduction in load at zero implementation cost.',
    ],
  },
  {
    id: 5,
    section: 'daytime',
    icon: PowerOff,
    palette: { icon: '#FCEBEB', iconText: '#A32D2D', tag: '#FCEBEB', tagText: '#A32D2D', num: '#F7C1C1', numText: '#791F1F', border: '#F7C1C1' },
    tag: 'Operations',
    title: 'Automatic shutdown after lecture hours',
    summary: 'All electrical equipment must shut down after each class and restart fresh for the next.',
    points: [
      'Mandatory shutdown of ACs, projectors, lights, and fans after every class.',
      'Next class restarts all equipment fresh — no idle consumption.',
      'Enforce as a compulsory operational policy across all departments.',
    ],
  },
  {
    id: 6,
    section: 'daytime',
    icon: Wind,
    palette: { icon: '#E6F1FB', iconText: '#185FA5', tag: '#E6F1FB', tagText: '#185FA5', num: '#B5D4F4', numText: '#0C447C', border: '#B5D4F4' },
    tag: 'Cooling',
    title: 'Optimise AC usage with natural cooling',
    summary: 'Combining smart thermostat settings with passive cooling reduces the overall cooling load.',
    points: [
      'Maintain thermostat settings between 24–26°C.',
      'Use curtains or blinds to reduce heat gain from direct sunlight.',
      'Keep doors and windows closed when AC is running.',
    ],
  },
  {
    id: 7,
    section: 'daytime',
    icon: Sun,
    palette: { icon: '#FAEEDA', iconText: '#854F0B', tag: '#FAEEDA', tagText: '#854F0B', num: '#FAC775', numText: '#633806', border: '#FAC775' },
    tag: 'Daylighting',
    title: 'Maximise daylight usage',
    summary: 'Leveraging natural light reduces the base lighting load throughout the day.',
    points: [
      'Turn off artificial lights in well-lit areas during daytime.',
      'Use LDR daylight sensors or enforce manual switching policies.',
      'Rearrange workspaces closer to natural light sources where possible.',
    ],
  },
  {
    id: 8,
    section: 'daytime',
    icon: CalendarClock,
    palette: { icon: '#E1F5EE', iconText: '#0F6E56', tag: '#E1F5EE', tagText: '#0F6E56', num: '#9FE1CB', numText: '#085041', border: '#9FE1CB' },
    tag: 'Scheduling',
    title: 'Align high-energy activities with solar generation',
    summary: 'Running heavy equipment during solar generation hours reduces dependency on grid power.',
    points: [
      'Schedule labs and heavy equipment during peak solar hours (10 AM – 3 PM).',
      'Shift high-load activities to daytime to leverage solar PV (Photovoltaic) energy.',
      'Reduce grid dependency by aligning tasks with daylight.',
    ],
  },
  {
    id: 9,
    section: 'night',
    icon: MoonStar,
    palette: { icon: '#EEEDFE', iconText: '#534AB7', tag: '#EEEDFE', tagText: '#534AB7', num: '#CECBF6', numText: '#3C3489', border: '#CECBF6' },
    tag: 'Night-time',
    title: 'Turn off idle equipment at night',
    summary: 'Eliminating idle loads after hours prevents unnecessary energy wastage overnight.',
    points: [
      'Ensure ACs, lights, and fans are off in all unused rooms at night.',
      'Implement a shutdown checklist for classrooms and labs at end of day.',
      'Assign responsibility to a designated staff member per floor or zone.',
    ],
  },
  {
    id: 10,
    section: 'night',
    icon: Lamp,
    palette: { icon: '#FAECE7', iconText: '#993C1D', tag: '#FAECE7', tagText: '#993C1D', num: '#F5C4B3', numText: '#712B13', border: '#F5C4B3' },
    tag: 'Night lighting',
    title: 'Energy-efficient night-time lighting',
    summary: 'Targeted LED and sensor-based lighting reduces the continuous overnight lighting load.',
    points: [
      'Replace all night-time lighting with energy-efficient LEDs (Light Emitting Diodes).',
      'Install PIR (Passive Infrared) motion sensors in corridors and outdoor areas.',
      'Use only 50–60% of lighting capacity for passages and common areas at night.',
    ],
  },
]

const Card = ({ rec }) => {
  const [open, setOpen] = useState(false)
  const Icon = rec.icon
  const { palette } = rec

  return (
    <div
      className="bg-white rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        border: `1px solid ${open ? palette.border : '#ebebea'}`,
        boxShadow: open ? `0 2px 16px 0 ${palette.border}44` : '0 1px 3px 0 rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className="rounded-lg flex items-center justify-center shrink-0"
          style={{ width: 38, height: 38, background: palette.icon }}
        >
          <Icon size={18} color={palette.iconText} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span
              className="font-semibold px-2 py-0.5 rounded-full"
              style={{ background: palette.tag, color: palette.tagText, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.04em' }}
            >
              {rec.tag}
            </span>
            {rec.tagFull && (
              <span
                className="px-1.5 py-0.5 rounded border"
                style={{ color: '#b0b0aa', borderColor: '#e8e8e5', fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.02em' }}
              >
                {rec.tagFull}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-0.5" style={{ fontFamily: "'Lora', Georgia, serif" }}>
            {rec.title}
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">{rec.summary}</p>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="mt-auto w-full flex items-center justify-between px-4 py-2.5 transition-colors duration-150"
        style={{
          borderTop: `1px solid ${open ? palette.border : '#f2f2f0'}`,
          background: open ? `${palette.icon}99` : '#fafaf8',
          color: open ? palette.tagText : '#b0b0aa',
        }}
      >
        <span
          className="flex items-center gap-1.5 font-medium"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.04em' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: open ? palette.iconText : '#d1d5db' }} />
          {open ? 'Hide steps' : 'Show steps'}
        </span>
        {open
          ? <CheckSquare size={15} strokeWidth={1.8} color={palette.iconText} />
          : <Square size={15} strokeWidth={1.5} color="#d1d5db" />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 flex flex-col gap-2.5" style={{ background: `${palette.icon}33` }}>
          {rec.points.map((point, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span
                className="font-semibold rounded-full flex items-center justify-center shrink-0"
                style={{ width: 18, height: 18, minWidth: 18, background: palette.num, color: palette.numText, fontFamily: "'DM Mono', monospace", marginTop: 1, fontSize: 10 }}
              >
                {i + 1}
              </span>
              <span className="text-xs text-gray-700 leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SectionBanner = ({ section }) => {
  const isDay = section === 'daytime'
  const count = recommendations.filter(r => r.section === section).length

  const config = isDay
    ? {
        bg: '#fffbeb',
        borderColor: '#fcd34d',
        iconBg: '#f59e0b',
        iconColor: '#ffffff',
        title: 'Daytime recommendations',
        titleColor: '#78350f',
        sub: `${count} strategies to reduce consumption during operating hours`,
        subColor: '#b45309',
        Icon: Sun,
        dots: ['#fde68a', '#fbbf24', '#f59e0b'],
      }
    : {
        bg: '#eef2ff',
        borderColor: '#a5b4fc',
        iconBg: '#6366f1',
        iconColor: '#ffffff',
        title: 'Night-time recommendations',
        titleColor: '#1e1b4b',
        sub: `${count} strategies to eliminate wastage after operating hours`,
        subColor: '#4338ca',
        Icon: MoonStar,
        dots: ['#c7d2fe', '#a5b4fc', '#818cf8'],
      }

  return (
    <div
      className="rounded-2xl px-5 py-4 mb-4 flex items-center gap-4 relative overflow-hidden"
      style={{ background: config.bg, border: `1.5px solid ${config.borderColor}` }}
    >
      {/* Decorative circles */}
      <div
        className="absolute right-4 top-1/2 flex items-center gap-2 pointer-events-none"
        style={{ transform: 'translateY(-50%)' }}
      >
        {config.dots.map((c, i) => (
          <div
            key={i}
            className="rounded-full opacity-50"
            style={{ width: 8 + i * 5, height: 8 + i * 5, background: c }}
          />
        ))}
      </div>

      <div
        className="rounded-xl flex items-center justify-center shrink-0"
        style={{ width: 48, height: 48, background: config.iconBg }}
      >
        <config.Icon size={24} color={config.iconColor} strokeWidth={1.8} />
      </div>

      <div>
        <p
          className="font-bold leading-tight"
          style={{ color: config.titleColor, fontFamily: "'Lora', Georgia, serif", fontSize: 15 }}
        >
          {config.title}
        </p>
        <p
          className="mt-0.5"
          style={{ color: config.subColor, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.03em' }}
        >
          {config.sub}
        </p>
      </div>
    </div>
  )
}

const daytimeRecs = recommendations.filter(r => r.section === 'daytime')
const nightRecs = recommendations.filter(r => r.section === 'night')

const Recommendations = () => (
  <div className="w-full p-4 flex flex-col gap-6">

    <section>
      <SectionBanner section="daytime" />
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
      >
        {daytimeRecs.map(rec => <Card key={rec.id} rec={rec} />)}
      </div>
    </section>

    <section>
      <SectionBanner section="night" />
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
      >
        {nightRecs.map(rec => <Card key={rec.id} rec={rec} />)}
      </div>
    </section>

  </div>
)

export default Recommendations