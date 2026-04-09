import React, { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-dist'
import { Maximize2, X, TrendingUp, TrendingDown, Zap, IndianRupee } from 'lucide-react'
import bg from '../assets/bg.jpg'

const energyData = [
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

const RATE       = 3688010 / 112330
const months     = energyData.map(d => d.month)
const totalKwh   = energyData.map(d => +(d.total / 1000).toFixed(2))
const costData   = energyData.map(d => Math.round(d.total * RATE))
const acKwh      = energyData.map(d => +(d.ac     / 1000).toFixed(2))
const lightsKwh  = energyData.map(d => +(d.lights / 1000).toFixed(2))
const fansKwh    = energyData.map(d => +(d.fans   / 1000).toFixed(2))
const othersKwh  = energyData.map(d => +(d.others / 1000).toFixed(2))

const totalAnnual  = energyData.reduce((s, d) => s + d.total, 0)
const annualCost   = Math.round(totalAnnual * RATE)
const avgMonthCost = Math.round(annualCost / 12)
const peakMonth    = energyData.reduce((a, b) => a.total > b.total ? a : b)
const lowestMonth  = energyData.reduce((a, b) => a.total < b.total ? a : b)
const peakIdx      = energyData.indexOf(peakMonth)
const peakCost     = Math.round(peakMonth.total * RATE)
const last         = energyData[energyData.length - 1].total
const prev         = energyData[energyData.length - 2].total
const momPct       = +(((last - prev) / prev) * 100).toFixed(1)

const COLORS = {
  ac:     '#3b82f6',
  lights: '#f59e0b',
  fans:   '#10b981',
  others: '#8b5cf6',
  grid:   '#f3f4f6',
  text:   '#9ca3af',
  line:   '#e5e7eb',
}

const baseLayout = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font: { family: 'Inter, sans-serif', color: COLORS.text, size: 12 },
  margin: { t: 10, b: 60, l: 65, r: 20 },
}

const axisStyle = {
  gridcolor:  COLORS.line,
  linecolor:  COLORS.line,
  tickcolor:  'transparent',
  tickfont:   { size: 11, color: COLORS.text },
  zeroline:   false,
  showgrid:   true,
}

const cfg = { displayModeBar: false, responsive: true }

// ── Chart Card ────────────────────────────────────────────────────────────────
const Chart = ({ data, layout, height = '320px', title, inference, fullHeight = '540px' }) => {
  const ref   = useRef(null)
  const fsRef = useRef(null)
  const [fs, setFs] = useState(false)

  const draw = (el, h) => {
    if (!el) return
    Plotly.newPlot(el, data, { ...baseLayout, ...layout, height: parseInt(h) }, cfg)
  }

  useEffect(() => {
    draw(ref.current, height)
    return () => { if (ref.current) Plotly.purge(ref.current) }
  }, [])

  useEffect(() => {
    if (fs && fsRef.current) draw(fsRef.current, fullHeight)
    else if (!fs && fsRef.current) Plotly.purge(fsRef.current)
  }, [fs])

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="px-6 pt-5 pb-2 border-b border-gray-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-800">{title}</h3>
              {inference && <p className="text-xs text-gray-400 mt-1 max-w-lg leading-relaxed">{inference}</p>}
            </div>
            <button onClick={() => setFs(true)} className="ml-4 p-2 rounded-xl text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors shrink-0">
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div ref={ref} style={{ width: '100%', height }} />
        </div>
      </div>

      {fs && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setFs(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-8 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                {inference && <p className="text-sm text-gray-400 mt-1">{inference}</p>}
              </div>
              <button onClick={() => setFs(false)} className="p-2 rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div ref={fsRef} style={{ width: '100%', height: fullHeight }} />
          </div>
        </div>
      )}
    </>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
    <div className="flex items-start justify-between">
      <p className="text-sm font-medium text-gray-400">{label}</p>
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon size={16} />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-800 mt-3 tracking-tight">{value}</p>
    {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
  </div>
)

// ── Analytics Page ─────────────────────────────────────────────────────────────
const Analytics = () => {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <div className="relative w-full h-48 overflow-hidden">
        <img src={bg} alt="background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        <div className="absolute bottom-5 left-8">
          <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>Analytics</h1>
          <p className="text-lg text-gray-500 mt-1">Deep dive into your building's energy consumption patterns</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-8 pb-10 mt-4 flex flex-col gap-8">

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="July 2024 Bill"    value="₹36,88,010"                              sub="Actual bill · Jul 2024"         icon={Zap}                                      color="bg-red-50 text-red-400" />
          <StatCard label="Avg Monthly Bill"  value={`₹${avgMonthCost.toLocaleString()}`}     sub="across 12 months"               icon={TrendingUp}                               color="bg-blue-50 text-blue-400" />
          <StatCard label="Annual Bill Est."  value={`₹${(annualCost/100000).toFixed(1)}L`}   sub={`₹${annualCost.toLocaleString()} total`} icon={IndianRupee}                    color="bg-emerald-50 text-emerald-400" />
          <StatCard label="Mar vs Feb"        value={`${momPct > 0 ? '+' : ''}${momPct}%`}   sub="month-over-month change"        icon={momPct > 0 ? TrendingUp : TrendingDown}   color={momPct > 0 ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-400'} />
        </div>

        {/* Monthly consumption */}
        <Chart
          title="Monthly Energy Consumption (kWh)"
          inference={`Consumption peaked in ${peakMonth.month} at ${(peakMonth.total/1000).toFixed(1)} kWh and was lowest in ${lowestMonth.month} — a seasonal swing driven primarily by AC load.`}
          data={[{
            x: months, y: totalKwh, type: 'scatter', mode: 'lines+markers',
            fill: 'tozeroy', fillcolor: 'rgba(59,130,246,0.06)',
            line: { color: COLORS.ac, width: 2.5, shape: 'spline' },
            marker: { color: months.map((_, i) => i === peakIdx ? '#ef4444' : '#fff'), size: months.map((_, i) => i === peakIdx ? 10 : 8), line: { color: months.map((_, i) => i === peakIdx ? '#ef4444' : COLORS.ac), width: 2.5 } },
            name: 'Total (kWh)',
            hovertemplate: '<b>%{x}</b><br>%{y} kWh<extra></extra>',
          }]}
          layout={{
            xaxis: { ...axisStyle, title: { text: 'Month', font: { size: 12, color: COLORS.text }, standoff: 12 } },
            yaxis: { ...axisStyle, title: { text: 'Energy Consumption (kWh)', font: { size: 12, color: COLORS.text }, standoff: 12 } },
          }}
        />

        {/* Appliance-wise lines */}
        <Chart
          title="Appliance-wise Consumption (kWh)"
          inference="AC is the dominant load year-round. Lights and fans remain flat, making AC the primary target for efficiency improvements."
          data={[
            { x: months, y: acKwh,     name: 'AC',     type: 'scatter', mode: 'lines+markers', line: { color: COLORS.ac,     width: 2, shape: 'spline' }, marker: { size: 6, color: COLORS.ac     }, hovertemplate: '<b>AC</b>: %{y} kWh<extra></extra>' },
            { x: months, y: lightsKwh, name: 'Lights', type: 'scatter', mode: 'lines+markers', line: { color: COLORS.lights, width: 2, shape: 'spline' }, marker: { size: 6, color: COLORS.lights }, hovertemplate: '<b>Lights</b>: %{y} kWh<extra></extra>' },
            { x: months, y: fansKwh,   name: 'Fans',   type: 'scatter', mode: 'lines+markers', line: { color: COLORS.fans,   width: 2, shape: 'spline' }, marker: { size: 6, color: COLORS.fans   }, hovertemplate: '<b>Fans</b>: %{y} kWh<extra></extra>' },
            { x: months, y: othersKwh, name: 'Others', type: 'scatter', mode: 'lines+markers', line: { color: COLORS.others, width: 2, shape: 'spline' }, marker: { size: 6, color: COLORS.others }, hovertemplate: '<b>Others</b>: %{y} kWh<extra></extra>' },
          ]}
          layout={{
            xaxis: { ...axisStyle, title: { text: 'Month', font: { size: 12, color: COLORS.text }, standoff: 12 } },
            yaxis: { ...axisStyle, title: { text: 'Energy Consumption (kWh)', font: { size: 12, color: COLORS.text }, standoff: 12 } },
            legend: { orientation: 'h', y: -0.22, font: { size: 12 } },
          }}
        />

        {/* Cost trend */}
        <Chart
          title="Monthly Cost Trend (₹)"
          inference={`Based on Jul 2024 actual bill (₹36.88L). Annual estimated spend is ₹${(annualCost/100000).toFixed(1)}L. Reducing ${peakMonth.month}'s usage by 10% would save ~₹${Math.round(peakCost * 0.1).toLocaleString()}.`}
          data={[{
            x: months, y: costData, type: 'bar',
            marker: { color: costData.map((_, i) => i === peakIdx ? '#ef4444' : '#93c5fd'), borderradius: 6 },
            hovertemplate: '<b>%{x}</b><br>₹%{y:,.0f}<extra></extra>',
            name: 'Cost (₹)',
          }]}
          layout={{
            bargap: 0.3,
            xaxis: { ...axisStyle, title: { text: 'Month', font: { size: 12, color: COLORS.text }, standoff: 12 } },
            yaxis: { ...axisStyle, title: { text: 'Estimated Cost (₹)', font: { size: 12, color: COLORS.text }, standoff: 12 } },
          }}
        />

        {/* Peak heatmap bar */}
        <Chart
          title="Peak Usage Detection"
          inference={`The red end of the scale marks ${peakMonth.month} as the peak month. Apr, May and Mar cluster close behind — these 4 months account for over 40% of annual consumption.`}
          data={[{
            x: months, y: totalKwh, type: 'bar',
            marker: {
              color: totalKwh,
              colorscale: [[0, '#bfdbfe'], [0.5, '#3b82f6'], [1, '#ef4444']],
              showscale: true,
              colorbar: { title: 'kWh', thickness: 14, len: 0.8, tickfont: { size: 11 } },
            },
            hovertemplate: '<b>%{x}</b><br>%{y} kWh<extra></extra>',
            name: 'kWh',
          }]}
          layout={{
            bargap: 0.3,
            margin: { t: 10, b: 60, l: 65, r: 80 },
            xaxis: { ...axisStyle, title: { text: 'Month', font: { size: 12, color: COLORS.text }, standoff: 12 } },
            yaxis: { ...axisStyle, title: { text: 'Energy Consumption (kWh)', font: { size: 12, color: COLORS.text }, standoff: 12 } },
          }}
        />

      </div>
    </div>
  )
}

export default Analytics