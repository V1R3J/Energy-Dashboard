import React from 'react'
import logo from '../assets/logo.png'

export const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm px-8 py-6 flex items-center gap-4">
      <a href="/">
        <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
      </a>
      <h1 className="text-3xl font-semibold tracking-wide text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
        Energy Dashboard
      </h1>
    </header>
  )
}