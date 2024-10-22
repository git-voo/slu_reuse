import './sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
                <li>
                    <Link to="/profile/my-listings">Listings</Link>
                </li>
                <li>
                    <Link to="/profile/list-item">List an Item</Link>
                </li>
                <li>
                    <Link to="/profile/conversations">Conversations</Link>
                </li>
                <li>
                    <Link to="/profile/verify-email">Verify Email</Link>
                </li>
            </ul>
            <ul className="bottom">
                <li className="delete-account">
                    <Link to="/profile/delete-account">Delete My Account</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;