import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../../../styles/auth/index.css';
import '../../../styles/auth/register/index.css';
import { Link, useLocation } from 'react-router-dom';

export default function VerifyEmail(){
    const [message, setMessage] = useState('');
    const location = useLocation();

    // Extract token from URL query parameter
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        if (token) {
            fetch('http://localhost:4300/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }), // Send the token in the body
            })
            .then((response) => {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    throw new Error('Response is not valid JSON');
                }
            })
            .then((data) => {
                console.log(data)
                if (data.msg) {
                    setMessage(data.msg);
                }
            })
            .catch((error) => {
                setMessage('Error verifying email.');
                console.error('Error:', error);
            });
        } else {
            setMessage('No token provided for verification.');
        }
    }, [token]);

    return ( 
         <div className="outer-container">
            <div className="form-container">
                <Form>
                    <h3 className="mb-4 center-text"><b>Email Verification</b></h3>
                    <p className="text-muted small center-text">{message}</p>

                    {message === 'Email verified successfully'}

                    <div className="center-text">
                        <Link to="/"><b>Go to Home</b></Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};