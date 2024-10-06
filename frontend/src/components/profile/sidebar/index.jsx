import './sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <a href="/my-listing">My Listing</a>
                </li>
                <li>
                    <a href="/list-item">List an Item</a>
                </li>
                <li>
                    <a href="/conversations">Conversations</a>
                </li>
                <li>
                    <a href="/verify-email">Verify Email</a>
                </li>
                <li>
                    <a href="/update-profile">Update Profile</a>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
