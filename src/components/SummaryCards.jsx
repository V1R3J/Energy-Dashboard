import React, { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-dist'
import { Maximize2, X, Zap, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

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

const totalAnnual  = energyData.reduce((s, d) => s + d.total, 0)
const avgMonthly   = Math.round(totalAnnual / energyData.length)
const peakMonth    = energyData.reduce((a, b) => a.total > b.total ? a : b)
const lowestMonth  = energyData.reduce((a, b) => a.total < b.total ? a : b)

const applianceTotals = {
  AC:     energyData.reduce((s, d) => s + d.ac, 0),
  Lights: energyData.reduce((s, d) => s + d.lights, 0),
  Fans:   energyData.reduce((s, d) => s + d.fans, 0),
  Others: energyData.reduce((s, d) => s + d.others, 0),
}

const COLORS = {
  ac:     '#3b82f6',
  lights: '#f59e0b',
  fans:   '#10b981',
  others: '#8b5cf6',
  grid:   '#f3f4f6',
  text:   '#9ca3af',
  line:   '#e5e7eb',
}

const config = { displayModeBar: false, responsive: true }

const baseLayout = {
  paper_bgcolor: 'transparent',
  plot_bgcolor:  'transparent',
  font: { family: 'Inter, sans-serif', color: COLORS.text, size: 12 },
  margin: { t: 10, b: 60, l: 65, r: 20 },
}

const axisStyle = {
  gridcolor:      COLORS.line,
  linecolor:      COLORS.line,
  tickcolor:      'transparent',
  tickfont:       { size: 11, color: COLORS.text },
  zeroline:       false,
  showgrid:       true,
}

// ── Chart Card ────────────────────────────────────────────────────────────────
const Chart = ({ data, layout, height = '320px', title, inference, fullHeight = '540px' }) => {
  const ref   = useRef(null)
  const fsRef = useRef(null)
  const [fs, setFs] = useState(false)

  const draw = (el, h) => {
    if (!el) return
    Plotly.newPlot(el, data, { ...baseLayout, ...layout, height: parseInt(h) }, config)
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
              {inference && <p className="text-xs text-gray-400 mt-1 max-w-md leading-relaxed">{inference}</p>}
            </div>
            <button
              onClick={() => setFs(true)}
              className="ml-4 p-2 rounded-xl text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors shrink-0"
              aria-label="Fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div ref={ref} style={{ width: '100%', height }} />
        </div>
      </div>

      {/* Fullscreen */}
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

// ── Main ──────────────────────────────────────────────────────────────────────
const SummaryCards = () => {
  return (
    <div className="flex flex-col gap-8 pt-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Annual Total"  value={`${(totalAnnual / 1000).toFixed(1)} kWh`}  icon={Zap}          color="bg-blue-50 text-blue-500" />
        <StatCard label="Monthly Avg"   value={`${(avgMonthly  / 1000).toFixed(1)} kWh`}  icon={Calendar}     color="bg-indigo-50 text-indigo-500" />
        <StatCard label="Peak Month"    value={peakMonth.month}    sub={`${(peakMonth.total   / 1000).toFixed(1)} kWh`} icon={TrendingUp}   color="bg-red-50 text-red-400" />
        <StatCard label="Lowest Month"  value={lowestMonth.month}  sub={`${(lowestMonth.total / 1000).toFixed(1)} kWh`} icon={TrendingDown} color="bg-green-50 text-green-500" />
      </div>

      {/* Line + Pie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Chart
          title="Monthly Energy Consumption"
          inference={`Usage peaks in ${peakMonth.month} and drops to its lowest in ${lowestMonth.month} — a ${Math.round((peakMonth.total - lowestMonth.total) / 1000)} kWh seasonal swing.`}
          data={[{
            x: energyData.map(d => d.month),
            y: energyData.map(d => d.total / 1000),
            type: 'scatter', mode: 'lines+markers',
            line: { color: COLORS.ac, width: 2.5, shape: 'spline' },
            marker: { color: '#fff', size: 8, line: { color: COLORS.ac, width: 2.5 } },
            fill: 'tozeroy',
            fillcolor: 'rgba(59,130,246,0.06)',
            name: 'Total (kWh)',
            hovertemplate: '<b>%{x}</b><br>%{y:.1f} kWh<extra></extra>',
          }]}
          layout={{
            xaxis: { ...axisStyle, title: { text: 'Month', font: { size: 12, color: COLORS.text }, standoff: 12 } },
            yaxis: { ...axisStyle, title: { text: 'Energy Consumption (kWh)', font: { size: 12, color: COLORS.text }, standoff: 12 } },
          }}
        />

        <Chart
          title="Annual Appliance Breakdown"
          inference={`AC dominates at ~${Math.round(applianceTotals.AC / totalAnnual * 100)}% of annual usage — the single biggest lever for savings.`}
          data={[{
            labels: Object.keys(applianceTotals),
            values: Object.values(applianceTotals),
            type: 'pie', hole: 0.52,
            marker: { colors: [COLORS.ac, COLORS.lights, COLORS.fans, COLORS.others], line: { color: '#fff', width: 2 } },
            textinfo: 'label+percent',
            textfont: { size: 12 },
            hovertemplate: '<b>%{label}</b><br>%{value:.0f} kWh<br>%{percent}<extra></extra>',
            pull: [0.03, 0, 0, 0],
          }]}
          layout={{
            margin: { t: 10, b: 20, l: 20, r: 20 },
            showlegend: true,
            legend: { orientation: 'h', y: -0.15, font: { size: 12 } },
          }}
        />
      </div>

      {/* Stacked bar */}
      <Chart
        title="Monthly Appliance-wise Breakdown"
        inference="AC load shrinks significantly in Dec–Jan, while 'Others' spikes mid-year — check for seasonal standby devices."
        height="360px"
        fullHeight="560px"
        data={[
          { x: energyData.map(d => d.month), y: energyData.map(d => d.ac     / 1000), name: 'AC',     type: 'bar', marker: { color: COLORS.ac },     hovertemplate: '<b>AC</b>: %{y:.1f} kWh<extra></extra>' },
          { x: energyData.map(d => d.month), y: energyData.map(d => d.lights / 1000), name: 'Lights', type: 'bar', marker: { color: COLORS.lights },  hovertemplate: '<b>Lights</b>: %{y:.1f} kWh<extra></extra>' },
          { x: energyData.map(d => d.month), y: energyData.map(d => d.fans   / 1000), name: 'Fans',   type: 'bar', marker: { color: COLORS.fans },    hovertemplate: '<b>Fans</b>: %{y:.1f} kWh<extra></extra>' },
          { x: energyData.map(d => d.month), y: energyData.map(d => d.others / 1000), name: 'Others', type: 'bar', marker: { color: COLORS.others },  hovertemplate: '<b>Others</b>: %{y:.1f} kWh<extra></extra>' },
        ]}
        layout={{
          barmode: 'stack',
          bargap: 0.3,
          xaxis: { ...axisStyle, title: { text: 'Month', font: { size: 12, color: COLORS.text }, standoff: 12 } },
          yaxis: { ...axisStyle, title: { text: 'Energy Consumption (kWh)', font: { size: 12, color: COLORS.text }, standoff: 12 } },
          legend: { orientation: 'h', y: -0.22, font: { size: 12 } },
        }}
      />

    </div>
  )
}

export default SummaryCards