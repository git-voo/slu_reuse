import { useState } from 'react'
import '../../styles/navBar/navbar.css'
import { Link, useNavigate } from "react-router-dom"
import avatar from "../../assets/images/avatar.png"


export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">SLUReuse</Link>
      </div>
      <div className="search-area">
        <input type="search" placeholder='Find anything...' />
      </div>
      <ul className="navbar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/donate">Donate Items</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
        <Link to={"/login"} className="navbar-btn">Login</Link>
          
        {/* {
          loggedIn ? (
            <div className='user-avatar' onClick={(e) => { e.preventDefault(); setLoggedIn(false) }}>
              <img src={avatar} alt="" onClick={()=>navigate("/login")} />
            </div>
          ) : (
            <Link onClick={(e) => { e.preventDefault(); setLoggedIn(true) }} to={"/login"} className="navbar-btn">Login</Link>
          )
        } */}

        </li>
        <li>
        <div className='user-avatar' onClick={(e) => { e.preventDefault(); setLoggedIn(false) }}>
              <img src={avatar} alt="" onClick={()=>navigate("/profile")} />
            </div>
        </li>
      </ul>
    </nav>
  )
};

