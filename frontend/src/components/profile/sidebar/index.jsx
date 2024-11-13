import './sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/profile" end className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/my-listings" className={({ isActive }) => isActive ? "active" : ""}>My Listings</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/list-item" className={({ isActive }) => isActive ? "active" : ""}>List an Item</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/conversations" className={({ isActive }) => isActive ? "active" : ""}>Conversations</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/verify-email" className={({ isActive }) => isActive ? "active" : ""}>Verify Email</NavLink>
                </li>
            </ul>
            <ul className="bottom">
                <li className="delete-account">
                    <NavLink to="/profile/delete-account" className={({ isActive }) => isActive ? "active" : ""}>Delete My Account</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
