import './sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/my-listings">My Listings</Link>
                </li>
                <li>
                    <Link to="/list-item">List an Item</Link>
                </li>
                <li>
                    <Link to="/conversations">Conversations</Link>
                </li>
                <li>
                    <Link to="/verify-email">Verify Email</Link>
                </li>
                <li>
                    <Link to="/update-profile">Update Profile</Link>
                </li>
            </ul>
            <ul className="bottom">
                <li className="delete-account">
                    <Link to="/delete-account">Delete My Account</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;