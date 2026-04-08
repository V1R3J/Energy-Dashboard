import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BarChart2, Lightbulb, FlaskConical, Building2, Archive, ChevronLeft } from 'lucide-react'

const navItems = [
  { label: 'Dashboard',         icon: LayoutDashboard, path: '/' },
  { label: 'Analytics',         icon: BarChart2,        path: '/analytics' },
  { label: 'Recommendations',   icon: Lightbulb,        path: '/recommendations' },
  { label: 'What If Simulator', icon: FlaskConical,     path: '/simulator' },
  { label: 'Building Details',  icon: Building2,        path: '/building-details' },
  { label: 'Bill Archive',      icon: Archive,          path: '/bill-archive' },
]

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  return (
    <aside className={`flex flex-col bg-white border-r transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-end p-4 text-gray-400 hover:text-gray-600"
      >
        <ChevronLeft className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} size={22} />
      </button>

      <nav className="flex flex-col gap-2 px-3">
        {navItems.map(({ label, icon: Icon, path }) => {
          const active = pathname === path
          return (
            <Link key={path} to={path} className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
              <Icon size={22} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}