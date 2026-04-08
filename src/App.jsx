import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Importing components
import { Header } from './components/Header.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Footer } from './components/Footer.jsx'
//Pages
import Dashboard from './pages/Dashboard.jsx'
import Analytics from './pages/Analytics.jsx'
import Recommendations from './pages/Recommendations.jsx'
import Simulator from './pages/Simulator.jsx'
import BuildingDetails from './pages/BuildingDetails.jsx'
import Settings from './pages/Settings.jsx'
import SummaryCards from './components/SummaryCards.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/"                 element={<Dashboard />} />
              <Route path="/analytics"        element={<Analytics />} />
              <Route path="/recommendations"  element={<Recommendations />} />
              <Route path="/simulator"        element={<Simulator />} />
              <Route path="/building-details" element={<BuildingDetails />} />
              <Route path="/settings"         element={<Settings />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App