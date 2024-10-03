import { useState } from 'react';
import './profileForm.css';

const ProfileForm = ({ profile, onSave, onCancel }) => {
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [bio, setBio] = useState(profile.bio);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, email, bio });
    };

    return (
        <form className="profileForm" onSubmit={handleSubmit}>
            <div className="formGroup">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="formGroup">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="formGroup">
                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                ></textarea>
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default ProfileForm;