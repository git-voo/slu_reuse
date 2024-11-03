import React, { useState } from 'react';
import axios from 'axios';
import './deleteAccount.css';

const DeleteAccount = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState(''); // State to hold the password input

    const handleDeleteClick = () => {
        setIsConfirming(true);
    };

    const handleCancel = () => {
        setIsConfirming(false);
    };

    const handleConfirmDelete = async () => {
        // Validate that password is entered
        if (!password) {
            setError('Please enter your password to confirm.');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token'); // Ensure token is stored correctly
            if (!token) {
                setError('User is not authenticated.');
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Send the DELETE request with the password in the request body
            const response = await axios.delete('http://localhost:4300/api/user/delete', {
                headers: config.headers,
                data: { password } // Axios allows sending data with DELETE
            });

            setMessage(response.data.message);

            // Redirect the user after successful deletion
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = '/';
            }, 3000);
        } catch (err) {
            // Handle specific error messages from the backend
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred while deleting your account.');
            }
        } finally {
            setLoading(false);
            setIsConfirming(false);
        }
    };

    return (
        <div className="delete-account-container">
            <h2>Delete Your Account</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            {!isConfirming ? (
                <button className="delete-button" onClick={handleDeleteClick}>
                    Delete Account
                </button>
            ) : (
                <div className="confirmation-dialog">
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <input
                        type="password"
                        placeholder="Enter your password to confirm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="password-input"
                    />
                    <button className="confirm-button" onClick={handleConfirmDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button className="cancel-button" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;
