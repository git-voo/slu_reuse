import { useState } from 'react';
import './profileForm.css';

const ProfileForm = ({ profile, onSave, onCancel }) => {
    const [firstName, setFirstName] = useState(profile.first_name || '');
    const [lastName, setLastName] = useState(profile.last_name || '');
    const [email, setEmail] = useState(profile.email || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [isDonor, setIsDonor] = useState(profile.isDonor || false);
    const [isStudent, setIsStudent] = useState(profile.isStudent || false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            isDonor,
            isStudent,
        });
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
            <div className="formGroup checkboxGroup">
                <label>
                    <input
                        type="checkbox"
                        checked={isDonor}
                        onChange={(e) => setIsDonor(e.target.checked)}
                    />
                    Donor
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={isStudent}
                        onChange={(e) => setIsStudent(e.target.checked)}
                    />
                    Student
                </label>
            </div>
            <div className="buttonGroup">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default ProfileForm;
