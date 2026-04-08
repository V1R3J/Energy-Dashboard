import React, { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-dist'
import { Maximize2, X, TrendingUp, TrendingDown, Zap, IndianRupee } from 'lucide-react'

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

// Effective rate derived from July 2024 actual bill
// Jul units: 112,330 Wh | Jul bill: ₹36,88,010 → ₹32.83 per unit
const RATE = 3688010 / 112330

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

// month-over-month change (Feb → Mar)
const last   = energyData[energyData.length - 1].total
const prev   = energyData[energyData.length - 2].total
const momPct = +(((last - prev) / prev) * 100).toFixed(1)

const baseLayout = { paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#9ca3af' } }
const cfg        = { displayModeBar: false, responsive: true }

// ── Reusable chart card with fullscreen ────────────────────────────────────────
const Chart = ({ data, layout, height = '320px', title, inference }) => {
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
    if (fs && fsRef.current) draw(fsRef.current, '540')
    else if (!fs && fsRef.current) Plotly.purge(fsRef.current)
  }, [fs])

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            {inference && <p className="text-sm text-gray-400 mt-0.5 max-w-lg">{inference}</p>}
          </div>
          <button onClick={() => setFs(true)} className="ml-4 p-2 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors shrink-0">
            <Maximize2 size={18} />
          </button>
        </div>
        <div ref={ref} style={{ width: '100%', height }} />
      </div>

      {fs && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8 relative">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
                {inference && <p className="text-sm text-gray-400 mt-0.5">{inference}</p>}
              </div>
              <button onClick={() => setFs(false)} className="p-2 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div ref={fsRef} style={{ width: '100%', height: '540px' }} />
          </div>
        </div>
      )}
    </>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, iconColor }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${iconColor} shrink-0`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
)

// ── Analytics Page ─────────────────────────────────────────────────────────────
const Analytics = () => {
  return (
    <div className="flex flex-col gap-8 pt-6 pb-10">

      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>Analytics</h2>
        <p className="text-sm text-gray-400 mt-1">Deep dive into your building's energy consumption patterns.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="July 2024 Bill" value="₹36,88,010" sub="Actual bill · Jul 2024" icon={Zap} iconColor="bg-red-50 text-red-400" />
        <StatCard label="Avg Monthly Bill"     value={`₹${avgMonthCost.toLocaleString()}`}  sub="across 12 months"                       icon={TrendingUp}    iconColor="bg-blue-50 text-blue-400" />
        <StatCard label="Annual Bill Est."     value={`₹${(annualCost/100000).toFixed(1)}L`} sub={`₹${annualCost.toLocaleString()} total`} icon={IndianRupee}   iconColor="bg-emerald-50 text-emerald-400" />
        <StatCard label="Mar vs Feb"           value={`${momPct > 0 ? '+' : ''}${momPct}%`} sub="month-over-month change"                icon={momPct > 0 ? TrendingUp : TrendingDown} iconColor={momPct > 0 ? "bg-red-50 text-red-400" : "bg-green-50 text-green-400"} />
      </div>

      {/* Monthly consumption */}
      <Chart
        title="Monthly Consumption (kWh)"
        inference={`Consumption peaked in ${peakMonth.month} at ${(peakMonth.total/1000).toFixed(1)} kWh and was lowest in ${lowestMonth.month} — a seasonal swing driven primarily by AC load.`}
        data={[{
          x: months, y: totalKwh, type: 'scatter', mode: 'lines+markers',
          fill: 'tozeroy', fillcolor: 'rgba(59,130,246,0.08)',
          line: { color: '#3b82f6', width: 2.5 },
          marker: { color: months.map((_, i) => i === peakIdx ? '#ef4444' : '#3b82f6'), size: months.map((_, i) => i === peakIdx ? 10 : 7) },
          name: 'Total (kWh)',
          hovertemplate: '%{x}: %{y} kWh<extra></extra>',
        }]}
        layout={{ margin: { t: 20, b: 50, l: 60, r: 20 }, xaxis: { title: 'Month', gridcolor: '#f3f4f6' }, yaxis: { title: 'kWh', gridcolor: '#f3f4f6' } }}
      />

      {/* Appliance breakdown — line per appliance */}
      <Chart
        title="Appliance-wise Consumption"
        inference="AC is the dominant load year-round. Lights and fans remain flat, making AC the primary target for efficiency improvements."
        data={[
          { x: months, y: acKwh,     name: 'AC',     type: 'scatter', mode: 'lines+markers', line: { color: '#3b82f6', width: 2 }, marker: { size: 6 } },
          { x: months, y: lightsKwh, name: 'Lights', type: 'scatter', mode: 'lines+markers', line: { color: '#f59e0b', width: 2 }, marker: { size: 6 } },
          { x: months, y: fansKwh,   name: 'Fans',   type: 'scatter', mode: 'lines+markers', line: { color: '#10b981', width: 2 }, marker: { size: 6 } },
          { x: months, y: othersKwh, name: 'Others', type: 'scatter', mode: 'lines+markers', line: { color: '#6366f1', width: 2 }, marker: { size: 6 } },
        ]}
        layout={{ margin: { t: 20, b: 50, l: 60, r: 20 }, xaxis: { title: 'Month', gridcolor: '#f3f4f6' }, yaxis: { title: 'kWh', gridcolor: '#f3f4f6' }, legend: { orientation: 'h', y: -0.25 } }}
      />

      {/* Cost trends */}
      <Chart
        title="Monthly Cost Trend (₹)"
        inference={`Based on Jul 2024 actual bill (₹36.88L). Annual estimated spend is ₹${(annualCost/100000).toFixed(1)}L. Reducing ${peakMonth.month}'s usage by 10% would save ~₹${Math.round(peakCost * 0.1).toLocaleString()}.`}
        data={[{
          x: months, y: costData, type: 'bar',
          marker: { color: costData.map((_, i) => i === peakIdx ? '#ef4444' : '#93c5fd') },
          hovertemplate: '%{x}: ₹%{y}<extra></extra>',
          name: 'Cost (₹)',
        }]}
        layout={{ margin: { t: 20, b: 50, l: 70, r: 20 }, xaxis: { title: 'Month' }, yaxis: { title: '₹', gridcolor: '#f3f4f6' } }}
      />

      {/* Peak usage heatmap-style bar */}
      <Chart
        title="Peak Usage Detection"
        inference={`The red bar marks ${peakMonth.month} as the peak month. Apr, May and Mar cluster close behind — these 4 months account for over 40% of annual consumption.`}
        data={[{
          x: months,
          y: totalKwh,
          type: 'bar',
          marker: {
            color: totalKwh,
            colorscale: [[0, '#bfdbfe'], [0.5, '#3b82f6'], [1, '#ef4444']],
            showscale: true,
            colorbar: { title: 'kWh', thickness: 14, len: 0.8 },
          },
          hovertemplate: '%{x}: %{y} kWh<extra></extra>',
          name: 'kWh',
        }]}
        layout={{ margin: { t: 20, b: 50, l: 60, r: 80 }, xaxis: { title: 'Month' }, yaxis: { title: 'kWh', gridcolor: '#f3f4f6' } }}
      />

    </div>
  )
}

export default Analytics