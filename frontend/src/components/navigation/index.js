import React from 'react'
import '../../styles/navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">SLU-Reuse</a>
      </div>
      <ul className="navbar-links">
        <li><a href="/about">About</a></li>
        <li><a href="/donate">Donate Items</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/login" className="navbar-btn">Login</a></li>
      </ul>
    </nav>
  )
};

