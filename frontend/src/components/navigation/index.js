import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/images/avatar.png";
import '../../styles/navBar/navbar.css';

export default function Navbar({ filters, updateFilters }) {
  const categories = ["All", "Electronics", "Furniture", "Accessories", "Beauty", "Kitchen", "Books", "Toys"];
  const locations = ["All Locations", "Chesterfield", "Manchester", "St. Louis", "St. Peters", "Warson Woods", "Maryland Heights", "Overland"];
  const navigate = useNavigate();

  // Handle changes for category and update the filters
  const handleCategoryChange = (e) => {
    updateFilters({ category: e.target.value });
  };

  // Handle changes for location and update the filters
  const handleLocationChange = (e) => {
    updateFilters({ location: e.target.value });
  };

  // Handle changes for sorting by time (newest or oldest) and update the filters
  const handleSortChange = (e) => {
    updateFilters({ sortOption: e.target.value });
  };

  // Handle changes for search query and update the filters
  const handleSearchChange = (e) => {
    updateFilters({ searchQuery: e.target.value });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">SLUReuse</Link>
      </div>

      {/* Search Bar */}
      <div className="search-area">
        <div className="search-container">
          <select className="search-category" value={filters.category} onChange={handleCategoryChange}>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="search"
            placeholder="Search SLUReuse"
            className="search-input"
            value={filters.searchQuery}
            onChange={handleSearchChange}  // Bind search input to searchQuery
          />

          <button className="search-btn">
            <FaSearch />
          </button>
        </div>

        {/* Location Filter */}
        <select className="location-filter" value={filters.location} onChange={handleLocationChange}>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Sort By Date (Newest/Oldest) */}
        <select className="sort-filter" value={filters.sortOption} onChange={handleSortChange}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <ul className="navbar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/donate">Donate Items</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to={"/login"} className="navbar-btn">Login</Link></li>
        <li>
          <div className='user-avatar'>
            <img src={avatar} alt="" onClick={() => navigate("/profile")} />
          </div>
        </li>
      </ul>
    </nav>
  );
}
