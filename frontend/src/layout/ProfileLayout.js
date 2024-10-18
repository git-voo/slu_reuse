import { Outlet } from 'react-router-dom';
import Sidebar from '../components/profile/sidebar';

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
