import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './verifyEmail.css';

export default function VerifyEmail() {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isChangingEmail, setIsChangingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    const location = useLocation();
    const navigate = useNavigate();

    // Extract token from URL query parameter
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        if (token) {
            verifyEmail(token);
        } else {
            fetchEmailStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // Function to verify email using the token
    const verifyEmail = async (token) => {
        setIsVerifying(true);
        try {
            const response = await axios.post('http://localhost:4300/api/auth/verify-email', { token });
            setStatus('success');
            setMessage(response.data.msg);
            // Optionally, redirect to dashboard or login after verification
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds
        } catch (error) {
            setStatus('error');
            if (error.response && error.response.data && error.response.data.msg) {
                setMessage(error.response.data.msg);
            } else {
                setMessage('An error occurred during verification.');
            }
        } finally {
            setIsVerifying(false);
        }
    };

    // Function to fetch current email and its verification status
    const fetchEmailStatus = async () => {
        try {
            const token = localStorage.getItem('token'); // Adjust based on your auth method
            if (!token) {
                setMessage('You are not logged in.');
                setStatus('error'); // Ensure status is set to 'error' for styling
                return;
            }
            const response = await axios.get('http://localhost:4300/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const { email, isEmailVerified } = response.data;
            setMessage(`Your email: ${email} is ${isEmailVerified ? 'verified' : 'not verified'}.`);
            setStatus(isEmailVerified ? 'success' : 'error');
        } catch (error) {
            setStatus('error');
            if (error.response && error.response.data && error.response.data.msg) {
                setMessage(error.response.data.msg);
            } else {
                setMessage('Failed to fetch email status.');
            }
        }
    };

    // Function to resend verification email
    const resendVerificationEmail = async () => {
        setIsResending(true);
        try {
            const token = localStorage.getItem('token'); // Adjust based on your auth method
            if (!token) {
                setMessage('You are not logged in.');
                setIsResending(false);
                setStatus('error'); // Ensure status is set to 'error' for styling
                return;
            }
            const response = await axios.post('http://localhost:4300/api/auth/resend-verification-email', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStatus('success');
            setMessage(response.data.msg);
        } catch (error) {
            setStatus('error');
            if (error.response && error.response.data && error.response.data.msg) {
                setMessage(error.response.data.msg);
            } else {
                setMessage('An error occurred while resending verification email.');
            }
        } finally {
            setIsResending(false);
        }
    };

    // Function to handle email change
    const handleChangeEmail = async (e) => {
        e.preventDefault();
        if (!newEmail) {
            setMessage('Please enter a new email.');
            setStatus('error'); // Ensure status is set to 'error' for styling
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Adjust based on your auth method
            if (!token) {
                setMessage('You are not logged in.');
                setStatus('error'); // Ensure status is set to 'error' for styling
                return;
            }
            const response = await axios.post('http://localhost:4300/api/auth/change-email', { newEmail }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStatus('success');
            setMessage(response.data.msg);
            setIsChangingEmail(false);
            setNewEmail('');
        } catch (error) {
            setStatus('error');
            if (error.response && error.response.data && error.response.data.msg) {
                setMessage(error.response.data.msg);
            } else {
                setMessage('An error occurred while changing the email.');
            }
        }
    };

    return (
        <div className="outer-container">
            <div className="form-container">
                <h3 className="mb-4 center-text"><b>Email Verification</b></h3>
                {isVerifying && <p>Verifying your email...</p>}

                {/* Display styled message based on status */}
                {status === 'success' && <p className="successMessage">{message}</p>}
                {status === 'error' && <p className="errorMessage">{message}</p>}

                {!token && (
                    <>
                        {/* Removed the redundant unstyled message below */}

                        {/* Resend Verification Email Button */}
                        {/* The button is now conditionally rendered based on the status */}
                        {status !== 'success' && (
                            <button
                                onClick={resendVerificationEmail}
                                disabled={isResending}
                                className="resend-button"
                            >
                                {isResending ? 'Resending...' : 'Resend Verification Email'}
                            </button>
                        )}
                    </>
                )}

                {/* Option to Change Email */}
                <div className="changeEmailSection">
                    <button
                        onClick={() => setIsChangingEmail(!isChangingEmail)}
                        className="change-email-button"
                    >
                        {isChangingEmail ? 'Cancel' : 'Change Email'}
                    </button>
                    {isChangingEmail && (
                        <form onSubmit={handleChangeEmail} className="changeEmailForm">
                            <input
                                type="email"
                                placeholder="New Email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                                className="email-input"
                            />
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                    )}
                </div>

                {/* Link to Home */}
                <div className="center-text">
                    <Link to="/"><b>Go to Home</b></Link>
                </div>
            </div>
        </div>
    );
}
