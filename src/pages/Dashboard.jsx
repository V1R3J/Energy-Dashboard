import React from 'react'
import bg from '../assets/bg.jpg'
import SummaryCards from '../components/SummaryCards'

const Dashboard = () => {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <div className="relative w-full h-64 overflow-hidden">
        <img src={bg} alt="background" className="w-full h-full object-cover" />
        {/* fade to white at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />

        {/* Title over image */}
        <div className="absolute bottom-6 left-8">
          <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
            Energy Dashboard
          </h1>
          <p className="text-xl text-gray-500 mt-1">
            Annual overview of your building's energy consumption
          </p>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="px-8 pb-10 -mt-2">
        <SummaryCards />
      </div>

    </div>
  )
}

export default Dashboard