import { useState, useEffect } from 'react';
import ProfileForm from '../../../components/profile/profileForm';
import profileService from '../../../services/profileService';

import './profilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await profileService.getProfile();
                setProfile(profileData);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setProfile({ error: "Failed to load prodile data" });
            }
        };
        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = async (updatedProfile) => {
        try {
            await profileService.updateProfile(updatedProfile);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!profile) return <div>Loading...</div>;
    if (profile.error) return <div>{profile.error}</div>;

    return (
        <div className="profilePage">
            {isEditing ? (
                <ProfileForm profile={profile} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
                <div className="profileDetails">
                    <h2>{profile.name}</h2>
                    <p>Email: {profile.email}</p>
                    <p>Bio: {profile.bio}</p>
                    <button onClick={handleEditClick}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;