import { useState, useEffect } from 'react';
import '../../styles/navBar/navbar.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import avatar from "../../assets/images/avatar.png";
import { FaSearch } from "react-icons/fa";

export default function Navbar({filters, updateFilters }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [sortOption, setSortOption] = useState("newest"); 

  const categories = ["All", "Electronics", "Furniture", "Accessories", "Beauty", "Kitchen", "Books", "Toys"];
  const locations = ["All Locations", "Chesterfield", "Manchester", "St. Louis", "St. Peters", "Warson Woods", "Maryland Heights", "Overland"];
  const navigate = useNavigate();

  // Handle filter change and update the parent state
  const handleCategoryChange = (e) => {
    updateFilters({ ...filters, category: e.target.value });
  };

  const handleLocationChange = (e) => {
    updateFilters({ ...filters, location: e.target.value });
  };

  const handleSortChange = (e) => {
    updateFilters({ ...filters, sortOption: e.target.value });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">SLUReuse</Link>
      </div>

      {/* Search Bar */}
      <div className="search-area">
        <div className="search-container">
          <select className="search-category" value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category, index) => (
              <option key={index} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
          <input type="search" placeholder='Search SLUReuse' className="search-input" />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>

        {/* Location Filter */}
        <select className="location-filter" value={selectedLocation} onChange={handleLocationChange}>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Sort By Date */}
        <select className="sort-filter" value={sortOption} onChange={handleSortChange}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <ul className="navbar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/donate">Donate Items</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li>
          <Link to={"/login"} className="navbar-btn">Login</Link>
        </li>
        <li>
          <div className='user-avatar' onClick={(e) => { e.preventDefault(); setLoggedIn(false) }}>
            <img src={avatar} alt="" onClick={() => navigate("/profile")} />
          </div>
        </li>
      </ul>



      {/* Displaying items fetched from the backend */}
      {/* <div className="items-container">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p>{item.category} - {item.location}</p>
            <p>Updated At: {new Date(item.updatedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div> */}
    </nav>
  );
}
