import { Outlet } from 'react-router-dom';
import Sidebar from '../components/profile/sidebar';
import './ProfileLayout.css';

const ProfileLayout = () => {
    return (
        <div className="profile-layout">
            <Sidebar />
            <div className="profile-content">
                <Outlet />
            </div>
        </div>
    );
};

export default ProfileLayout;
