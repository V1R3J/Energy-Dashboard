import React from 'react'
import logo from '../assets/logo.png'
import githubIcon from '../assets/github.svg'
import linkedinIcon from '../assets/linkedin.svg'
import instagramIcon from '../assets/instagram.svg'

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t px-8 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
            Energy Dashboard
          </span>
        </div>

        <p className="text-sm text-gray-500 italic max-w-sm text-center">
          "Every watt saved is a step toward a sustainable future."
        </p>


      </div>
    </footer>
  )
}