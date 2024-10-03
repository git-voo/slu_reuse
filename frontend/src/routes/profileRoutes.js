import { Route, Routes } from 'react-router-dom';
import ProfilePage from '../pages/profile/profilePage';

const ProfileRoutes = () => (
    <Routes>
        <Route path="/" element={<ProfilePage />} />
    </Routes>
);

export default ProfileRoutes