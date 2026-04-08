import React, { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-dist'
import { Thermometer, Lightbulb, Zap, Clock, TrendingDown, IndianRupee, RefreshCw, Wind, Sun, AlertCircle } from 'lucide-react'

// ── Base data ──────────────────────────────────────────────────────────────────
const baseData = [
  { month: "Apr", total: 127450, lights: 11501, fans: 7628, ac: 86346, others: 21974 },
  { month: "May", total: 126560, lights: 11501, fans: 7628, ac: 79950, others: 27480 },
  { month: "Jun", total: 111860, lights: 11501, fans: 7628, ac: 63960, others: 28770 },
  { month: "Jul", total: 112330, lights: 11501, fans: 7628, ac: 57564, others: 35636 },
  { month: "Aug", total: 118710, lights: 11501, fans: 7628, ac: 86346, others: 13234 },
  { month: "Sep", total: 121940, lights: 11501, fans: 7628, ac: 86346, others: 16464 },
  { month: "Oct", total: 118270, lights: 11501, fans: 7628, ac: 76752, others: 22388 },
  { month: "Nov", total: 92370,  lights: 11501, fans: 7628, ac: 50368, others: 22871 },
  { month: "Dec", total: 70570,  lights: 11501, fans: 7628, ac: 35817, others: 15622 },
  { month: "Jan", total: 76720,  lights: 11501, fans: 7628, ac: 35817, others: 21772 },
  { month: "Feb", total: 84790,  lights: 10616, fans: 7041, ac: 51660, others: 15471 },
  { month: "Mar", total: 124460, lights: 11501, fans: 7628, ac: 86346, others: 18984 },
]

const RATE        = 3688010 / 112330
const BASE_ANNUAL = baseData.reduce((s, d) => s + d.total, 0)
const BASE_COST   = Math.round(BASE_ANNUAL * RATE)
const months      = baseData.map(d => d.month)

// ── Chart ──────────────────────────────────────────────────────────────────────
const cfg        = { displayModeBar: false, responsive: true }
const baseLayout = { paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#9ca3af' } }

const Chart = ({ data, layout, height = '280px' }) => {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    Plotly.newPlot(ref.current, data, { ...baseLayout, ...layout, height: parseInt(height) }, cfg)
    return () => { if (ref.current) Plotly.purge(ref.current) }
  }, [data, layout])
  return <div ref={ref} style={{ width: '100%', height }} />
}

// ── Slider ─────────────────────────────────────────────────────────────────────
const Slider = ({ icon: Icon, color, label, sublabel, value, min, max, unit, onChange }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-3 rounded-xl ${color} shrink-0`}><Icon size={20} /></div>
      <div>
        <p className="text-base font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
      <p className="ml-auto text-3xl font-bold text-gray-800">{value}<span className="text-lg font-medium text-gray-400 ml-1">{unit}</span></p>
    </div>
    <input type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500" />
    <div className="flex justify-between text-xs text-gray-300 mt-1"><span>{min}{unit}</span><span>{max}{unit}</span></div>
  </div>
)

// ── Input field ────────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, color, label, sublabel, value, unit, optional, onChange }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-3 rounded-xl ${color} shrink-0`}><Icon size={20} /></div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-gray-700">{label}</p>
          {optional && <span className="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">optional</span>}
        </div>
        <p className="text-xs text-gray-400">{sublabel}</p>
      </div>
    </div>
    <div className="relative">
      <input
        type="number" min={0} value={value === '' ? '' : value}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={optional ? '0' : 'Enter value'}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">{unit}</span>
    </div>
  </div>
)

// ── Saving card ────────────────────────────────────────────────────────────────
const SavingCard = ({ label, value, sub, color, icon: Icon }) => (
  <div className={`rounded-2xl border ${color} p-5 flex items-start gap-4`}>
    <div className={`p-3 rounded-xl ${color} shrink-0`}><Icon size={20} /></div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
)

// ── Main ───────────────────────────────────────────────────────────────────────
const Simulator = () => {

  // Sliders
  const [acReduction,    setAcReduction]    = useState(0)
  const [lightReduction, setLightReduction] = useState(0)
  const [acHours,        setAcHours]        = useState(10)
  const [loadFactor,     setLoadFactor]     = useState(100)

  // Load inputs (Wh/month)
  const [hvacLoad,   setHvacLoad]   = useState('')
  const [lightsLoad, setLightsLoad] = useState('')
  const [fansLoad,   setFansLoad]   = useState('')

  // Optional inputs
  const [solar,      setSolar]      = useState('')
  const [prevDues,   setPrevDues]   = useState('')

  const reset = () => {
    setAcReduction(0); setLightReduction(0); setAcHours(10); setLoadFactor(100)
    setHvacLoad(''); setLightsLoad(''); setFansLoad(''); setSolar(''); setPrevDues('')
  }

  // ── Project data — only runs when at least one load input is filled ──────────
  const hasInput = hvacLoad !== '' || lightsLoad !== '' || fansLoad !== ''

  const projected = baseData.map(d => {
    if (!hasInput) return { month: d.month, ac: 0, lights: 0, fans: 0, others: 0, total: 0 }

    const acBase    = hvacLoad   !== '' ? Number(hvacLoad)   : d.ac
    const lightBase = lightsLoad !== '' ? Number(lightsLoad) : d.lights
    const fanBase   = fansLoad   !== '' ? Number(fansLoad)   : d.fans

    const acAdj     = acBase    * (1 - acReduction / 100) * (acHours / 10) * (loadFactor / 100)
    const lightsAdj = lightBase * (1 - lightReduction / 100)
    const newTotal  = acAdj + lightsAdj + fanBase + d.others
    return { month: d.month, ac: acAdj, lights: lightsAdj, fans: fanBase, others: d.others, total: newTotal }
  })

  const projAnnual  = projected.reduce((s, d) => s + d.total, 0)
  const solarOffset = solar    !== '' ? Number(solar)    * 12 : 0
  const netAnnual   = Math.max(0, projAnnual - solarOffset)
  const projCost    = hasInput ? Math.round(netAnnual * RATE) + (prevDues !== '' ? Number(prevDues) : 0) : 0
  const savedKwh    = hasInput ? Math.round((BASE_ANNUAL - netAnnual) / 1000) : 0
  const savedCost   = hasInput ? BASE_COST - projCost : 0
  const savedPct    = hasInput ? +((savedKwh / (BASE_ANNUAL / 1000)) * 100).toFixed(1) : 0

  return (
    <div className="flex flex-col gap-8 pt-6 pb-10">

      {/* Heading */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>What-If Simulator</h2>
          <p className="text-sm text-gray-400 mt-1">Adjust parameters and see real-time impact on energy and cost.</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* ── Section 1: Load Inputs ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Step 1 — Enter Appliance Loads</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InputField icon={Thermometer} color="bg-blue-50 text-blue-500"
            label="HVAC Load"   sublabel="Monthly AC consumption"     value={hvacLoad}   unit="Wh" onChange={setHvacLoad} />
          <InputField icon={Lightbulb}   color="bg-amber-50 text-amber-500"
            label="Lights Load" sublabel="Monthly lighting consumption" value={lightsLoad} unit="Wh" onChange={setLightsLoad} />
          <InputField icon={Wind}        color="bg-emerald-50 text-emerald-500"
            label="Fans Load"   sublabel="Monthly fan consumption"     value={fansLoad}   unit="Wh" onChange={setFansLoad} />
        </div>
      </div>

      {/* ── Section 2: Optional Inputs ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Step 2 — Optional Adjustments</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField icon={Sun}          color="bg-yellow-50 text-yellow-500"
            label="Solar Generation" sublabel="Monthly solar offset (subtracted from net units)" value={solar}    unit="Wh" optional onChange={setSolar} />
          <InputField icon={AlertCircle}  color="bg-red-50 text-red-400"
            label="Previous Dues"    sublabel="Added to projected bill total"                    value={prevDues} unit="₹"  optional onChange={setPrevDues} />
        </div>
      </div>

      {/* ── Section 3: Sliders ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Step 3 — Simulate Changes</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Slider icon={Thermometer} color="bg-blue-50 text-blue-500"
            label="AC Usage Reduction"      sublabel="Via temp policy / schedules"
            value={acReduction}    min={0}  max={50}  unit="%" onChange={setAcReduction} />
          <Slider icon={Lightbulb}   color="bg-amber-50 text-amber-500"
            label="Lighting Efficiency Gain" sublabel="LED switching impact"
            value={lightReduction} min={0}  max={80}  unit="%" onChange={setLightReduction} />
          <Slider icon={Clock}       color="bg-emerald-50 text-emerald-500"
            label="AC Hours / Day"           sublabel="Baseline is 10 hrs/day"
            value={acHours}        min={4}  max={14}  unit=" hrs" onChange={setAcHours} />
          <Slider icon={Zap}         color="bg-violet-50 text-violet-500"
            label="AC Load Factor"           sublabel="% of rated capacity used"
            value={loadFactor}     min={50} max={100} unit="%" onChange={setLoadFactor} />
        </div>
      </div>

      {/* ── Savings summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SavingCard label="Energy Saved"   value={hasInput ? `${savedKwh.toLocaleString()} kWh` : '—'}          sub="vs baseline annually"                            color="border-emerald-100 bg-emerald-50/40" icon={TrendingDown} />
        <SavingCard label="Cost Saved"     value={hasInput ? `₹${Math.abs(savedCost).toLocaleString()}` : '—'}  sub={savedCost >= 0 ? 'savings' : 'extra cost'}       color="border-blue-100 bg-blue-50/40"       icon={IndianRupee}  />
        <SavingCard label="Projected Bill" value={hasInput ? `₹${(projCost/100000).toFixed(1)}L` : '—'}         sub={prevDues ? 'incl. previous dues' : 'annual est.'} color="border-gray-100 bg-gray-50/40"       icon={IndianRupee}  />
        <SavingCard label="Reduction"      value={hasInput ? `${savedPct}%` : '—'}                              sub="vs current baseline"                             color="border-violet-100 bg-violet-50/40"   icon={TrendingDown} />
      </div>

      {/* Chart 1 — Baseline vs Projected */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Monthly Consumption — Baseline vs Projected</h3>
        <p className="text-sm text-gray-400 mb-3">Red dashed = current baseline · Blue = your scenario</p>
        <Chart height="300px"
          data={[
            { x: months, y: baseData.map(d => +(d.total / 1000).toFixed(2)), name: 'Baseline',
              type: 'scatter', mode: 'lines+markers',
              line: { color: '#fca5a5', width: 2, dash: 'dot' }, marker: { color: '#fca5a5', size: 6 } },
            { x: months, y: projected.map(d => +(d.total / 1000).toFixed(2)), name: 'Projected',
              type: 'scatter', mode: 'lines+markers',
              fill: 'tozeroy', fillcolor: 'rgba(59,130,246,0.07)',
              line: { color: '#3b82f6', width: 2.5 }, marker: { color: '#3b82f6', size: 7 } },
          ]}
          layout={{ margin: { t: 10, b: 50, l: 60, r: 20 }, xaxis: { title: 'Month', gridcolor: '#f3f4f6' }, yaxis: { title: 'kWh', gridcolor: '#f3f4f6' }, legend: { orientation: 'h', y: -0.25 } }}
        />
      </div>

      {/* Chart 2 — Appliance breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Projected Appliance Breakdown</h3>
        <p className="text-sm text-gray-400 mb-3">How changes distribute across appliances</p>
        <Chart height="300px"
          data={[
            { x: months, y: projected.map(d => +(d.ac     / 1000).toFixed(2)), name: 'AC',     type: 'bar', marker: { color: '#3b82f6' } },
            { x: months, y: projected.map(d => +(d.lights / 1000).toFixed(2)), name: 'Lights', type: 'bar', marker: { color: '#f59e0b' } },
            { x: months, y: projected.map(d => +(d.fans   / 1000).toFixed(2)), name: 'Fans',   type: 'bar', marker: { color: '#10b981' } },
            { x: months, y: projected.map(d => +(d.others / 1000).toFixed(2)), name: 'Others', type: 'bar', marker: { color: '#6366f1' } },
          ]}
          layout={{ barmode: 'stack', margin: { t: 10, b: 50, l: 60, r: 20 }, xaxis: { title: 'Month' }, yaxis: { title: 'kWh', gridcolor: '#f3f4f6' }, legend: { orientation: 'h', y: -0.25 } }}
        />
      </div>

      {/* Chart 3 — Cost comparison */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Monthly Cost — Baseline vs Projected (₹)</h3>
        <p className="text-sm text-gray-400 mb-3">Direct monthly cost impact of your scenario</p>
        <Chart height="280px"
          data={[
            { x: months, y: baseData.map(d =>  Math.round(d.total * RATE)),    name: 'Baseline',  type: 'bar', marker: { color: '#fca5a5' } },
            { x: months, y: projected.map(d => Math.round(d.total * RATE)),    name: 'Projected', type: 'bar', marker: { color: '#93c5fd' } },
          ]}
          layout={{ barmode: 'group', margin: { t: 10, b: 50, l: 80, r: 20 }, xaxis: { title: 'Month' }, yaxis: { title: '₹', gridcolor: '#f3f4f6' }, legend: { orientation: 'h', y: -0.25 } }}
        />
      </div>

    </div>
  )
}

export default Simulator