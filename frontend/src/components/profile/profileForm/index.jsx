import { useState } from 'react';
import './profileForm.css';

const ProfileForm = ({ profile, onSave, onCancel }) => {
    const [firstName, setFirstName] = useState(profile.first_name || '');
    const [lastName, setLastName] = useState(profile.last_name || '');
    const [email, setEmail] = useState(profile.email || '');
    const [phone, setPhone] = useState(profile.phone || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            // Remove isDonor and isStudent from the save payload
        });
    };

    // Determine user status based on isDonor and isStudent
    const getStatus = () => {
        if (profile.isDonor && profile.isStudent) {
            return 'Donor & Student';
        } else if (profile.isDonor) {
            return 'Donor';
        } else if (profile.isStudent) {
            return 'Student';
        } else {
            return 'None';
        }
    };

    return (
        <form className="profileForm" onSubmit={handleSubmit}>
            <div className="formGroup">
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div className="formGroup">
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className="formGroup">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled // Disabling email editing for security
                />
            </div>
            <div className="formGroup">
                <label htmlFor="phone">Phone</label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="formGroup">
                <label>Status: {getStatus()}</label>
            </div>
            <div className="buttonGroup">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default ProfileForm;
