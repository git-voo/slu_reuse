import { useState } from 'react'
import '../../styles/navBar/navbar.css'
import { Link } from "react-router-dom"
import avatar from "../../assets/images/avatar.png"


export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">SLU-Reuse</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/donate">Donate Items</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>{
          loggedIn ? (
            <div className='user-avatar' onClick={(e) => { e.preventDefault(); setLoggedIn(false) }}>
              <img src={avatar} alt="" />
            </div>
          ) : (
            <Link onClick={(e) => { e.preventDefault(); setLoggedIn(true) }} to={"/login"} className="navbar-btn">Login</Link>
          )
        }</li>
      </ul>
    </nav>
  )
};

