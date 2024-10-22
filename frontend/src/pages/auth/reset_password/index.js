import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../../styles/auth/index.css';
import '../../../styles/auth/login/index.css';
import '../../../styles/button.css';

export default function ResetPassword(){
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Get the email passed from the previous page
  const location = useLocation();
  const { email } = location.state || {}; // Access the email from state

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!newPassword) {
        setErrorMessage('Please enter new password.');
        return;
      }
      if (!confirmPassword) {
        setErrorMessage('Please confirm new password.');
        return;
      }
      if (newPassword.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
    // Check if passwords match
    if (newPassword !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }

    try {
      // Call the backend API to reset the password
      const response = await fetch('http://localhost:4300/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successfully!');
        navigate('/login');
      } else {
        setErrorMessage(data.msg || 'Error resetting password');
      }
    } catch (err) {
        setErrorMessage('An error occurred while resetting the password');
    }
  };

  return (
    <div className="outer-container">
      <div className="form-container">
        <Form>
          <h3 className="mb-4"><b>Choose a new password</b></h3>
          <p>To secure your account, choose a strong password you haven’t used before and is at least 6 characters long.</p>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

          <Form.Group className="mb-3 password-group" controlId="newPassword">
            <Form.Control
              type={passwordVisible ? 'text' : 'password'}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {/* Toggle button to show/hide password */}
            <Button
                    variant="link"
                    className="show-hide-btn"
                    onClick={togglePasswordVisibility}>
                {passwordVisible ? "Hide" : "Show"}
                </Button>
          </Form.Group>

          <Form.Group className="mb-3" controlId="retypePassword">
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button className="btn-join btn-blue default-btn-settings" variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}