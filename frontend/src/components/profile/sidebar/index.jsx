import './sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <NavLink to="/" end activeClassName="active">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/profile" end activeClassName="active">Profile</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/my-listings" activeClassName="active">Listings</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/list-item" activeClassName="active">List an Item</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/conversations" activeClassName="active">Conversations</NavLink>
                </li>
                <li>
                    <NavLink to="/profile/verify-email" activeClassName="active">Verify Email</NavLink>
                </li>
            </ul>
            <ul className="bottom">
                <li className="delete-account">
                    <NavLink to="/profile/delete-account" activeClassName="active">Delete My Account</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
