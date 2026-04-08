import React, { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-dist'
import { Maximize2, X } from 'lucide-react'

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

const totalAnnual = energyData.reduce((s, d) => s + d.total, 0)
const avgMonthly  = Math.round(totalAnnual / energyData.length)
const peakMonth   = energyData.reduce((a, b) => a.total > b.total ? a : b)
const lowestMonth = energyData.reduce((a, b) => a.total < b.total ? a : b)

const applianceTotals = {
  AC:     energyData.reduce((s, d) => s + d.ac, 0),
  Lights: energyData.reduce((s, d) => s + d.lights, 0),
  Fans:   energyData.reduce((s, d) => s + d.fans, 0),
  Others: energyData.reduce((s, d) => s + d.others, 0),
}

const config = { displayModeBar: false, responsive: true }

const baseLayout = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { color: '#6b7280' },
}

// Reusable chart with fullscreen support
const Chart = ({ data, layout, height = '320px', title, inference }) => {
  const ref     = useRef(null)
  const fsRef   = useRef(null)
  const [fs, setFs] = useState(false)

  const draw = (el, h) => {
    if (!el) return
    Plotly.newPlot(el, data, {
      ...baseLayout,
      ...layout,
      height: parseInt(h),
    }, config)
  }

  useEffect(() => {
    draw(ref.current, height)
    return () => { if (ref.current) Plotly.purge(ref.current) }
  }, [])

  useEffect(() => {
    if (fs && fsRef.current) {
      draw(fsRef.current, '520')
    } else if (!fs && fsRef.current) {
      Plotly.purge(fsRef.current)
    }
  }, [fs])

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            {inference && <p className="text-sm text-gray-400 mt-0.5 max-w-lg">{inference}</p>}
          </div>
          <button
            onClick={() => setFs(true)}
            className="ml-4 p-2 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors shrink-0"
            aria-label="Fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>
        <div ref={ref} style={{ width: '100%', height }} />
      </div>

      {/* Fullscreen modal */}
      {fs && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-8 relative">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
                {inference && <p className="text-sm text-gray-400 mt-0.5">{inference}</p>}
              </div>
              <button
                onClick={() => setFs(false)}
                className="p-2 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div ref={fsRef} style={{ width: '100%', height: '520px' }} />
          </div>
        </div>
      )}
    </>
  )
}

const SummaryCards = () => {
  return (
    <div className="flex flex-col gap-8 pt-6">

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Annual Total', value: `${(totalAnnual / 1000).toFixed(1)} kWh` },
          { label: 'Monthly Avg',  value: `${(avgMonthly  / 1000).toFixed(1)} kWh` },
          { label: 'Peak Month',   value: peakMonth.month,   sub: `${(peakMonth.total   / 1000).toFixed(1)} kWh` },
          { label: 'Lowest Month', value: lowestMonth.month, sub: `${(lowestMonth.total / 1000).toFixed(1)} kWh` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Line + Pie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Chart
          title="Monthly Consumption"
          inference={`Usage peaks in ${peakMonth.month} and drops to its lowest in ${lowestMonth.month} — a ${Math.round((peakMonth.total - lowestMonth.total) / 1000)} kWh seasonal swing.`}
          data={[{
            x: energyData.map(d => d.month),
            y: energyData.map(d => d.total / 1000),
            type: 'scatter', mode: 'lines+markers',
            line: { color: '#3b82f6', width: 2.5 },
            marker: { color: '#3b82f6', size: 7 },
            name: 'Total (kWh)',
          }]}
          layout={{ margin: { t: 20, b: 50, l: 60, r: 20 }, xaxis: { title: 'Month' }, yaxis: { title: 'kWh' } }}
        />

        <Chart
          title="Appliance Breakdown"
          inference={`AC dominates at ~${Math.round(applianceTotals.AC / totalAnnual * 100)}% of annual usage — the single biggest lever for savings.`}
          data={[{
            labels: Object.keys(applianceTotals),
            values: Object.values(applianceTotals),
            type: 'pie', hole: 0.45,
            marker: { colors: ['#3b82f6', '#f59e0b', '#10b981', '#6366f1'] },
            textinfo: 'label+percent',
          }]}
          layout={{ margin: { t: 20, b: 20, l: 20, r: 20 }, showlegend: true, legend: { orientation: 'h', y: -0.15 } }}
        />
      </div>

      {/* Stacked bar */}
      <Chart
        title="Monthly Appliance Breakdown"
        inference={`AC load shrinks significantly in Dec–Jan, while "Others" spikes mid-year — check for seasonal standby devices.`}
        height="340px"
        data={[
          { x: energyData.map(d => d.month), y: energyData.map(d => d.ac     / 1000), name: 'AC',     type: 'bar', marker: { color: '#3b82f6' } },
          { x: energyData.map(d => d.month), y: energyData.map(d => d.lights / 1000), name: 'Lights', type: 'bar', marker: { color: '#f59e0b' } },
          { x: energyData.map(d => d.month), y: energyData.map(d => d.fans   / 1000), name: 'Fans',   type: 'bar', marker: { color: '#10b981' } },
          { x: energyData.map(d => d.month), y: energyData.map(d => d.others / 1000), name: 'Others', type: 'bar', marker: { color: '#6366f1' } },
        ]}
        layout={{ barmode: 'stack', margin: { t: 20, b: 50, l: 60, r: 20 }, xaxis: { title: 'Month' }, yaxis: { title: 'kWh' }, legend: { orientation: 'h', y: -0.25 } }}
      />

    </div>
  )
}

export default SummaryCards