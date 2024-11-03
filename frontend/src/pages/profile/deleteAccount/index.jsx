import React, { useState } from 'react';
import axios from 'axios';
import './deleteAccount.css';

const DeleteAccount = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleDeleteClick = () => {
        setIsConfirming(true);
    };

    const handleCancel = () => {
        setIsConfirming(false);
    };

    const handleConfirmDelete = async () => {
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.delete('http://localhost:4300/api/user/delete', config);
            setMessage(response.data.message);

            // Redirect the user to the homepage or logout
            setTimeout(() => {
                // Redirect logic here
                localStorage.removeItem('token');
                window.location.href = '/';
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
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
