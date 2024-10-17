import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../../styles/auth/index.css';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // State to manage form step
  const [email, setEmail] = useState(''); // To store the email
  const [verificationCode, setVerificationCode] = useState(''); // To store the code
  const [errorMessage, setErrorMessage] = useState(''); // To handle errors
  const [successMessage, setSuccessMessage] = useState(''); 
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Disable resend initially
  const [countdown, setCountdown] = useState(60); // Countdown timer for resend
  const navigate = useNavigate();


  // Unified method to send/reset the verification code
  const sendResetCode = async (isResend = false) => {
    setErrorMessage(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages

    if (!email) {
      setErrorMessage('Please enter email.');
      return;
    }

    try {
      // Call the API to send the verification code
      const response = await fetch('http://localhost:4300/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isResend) {
          setSuccessMessage('Verification code resent successfully.');
        } else {
          setStep(2); // Move to step 2 (enter verification code)
        }
      } else {
        setErrorMessage(data.msg || 'Error sending verification code');
      }
    } catch (err) {
      setErrorMessage('An error occurred while sending the verification code');
    }
  };

  // To send the reset code (same logic as handleNext before)
  const handleNext = (e) => {
    e.preventDefault();
    sendResetCode(false); // Pass false to indicate sending reset code for the first time
  };

  // To resend the verification code
  const handleResendCode = () => {
    sendResetCode(true); // Pass true to indicate resending the code
    startCountdown();
  };
  const startCountdown = () => {
    setIsResendDisabled(true); // Disable the resend button
    setCountdown(30); // Set initial countdown value to 30 seconds

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer); // Clear the interval when it reaches 0
          setIsResendDisabled(false); // Enable the resend button
        }
        return prev - 1; // Decrease the countdown by 1 second
      });
    }, 1000); // Run the timer every 1 second
  };

  useEffect(() => {
    if (step === 2) {
      startCountdown(); // Start countdown when moving to step 2
    }
  }, [step]);

  // Handle "Submit" button click after entering the code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    if (!verificationCode) {
      setErrorMessage('Please enter verification code.');
      return;
    }

    try {
      // Call the backend to verify the code
      const response = await fetch('http://localhost:4300/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }), // Send email and code
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to reset password page if code is valid
        navigate('/reset-password', { state: { email } });
      } else {
        // Show error if code is invalid
        setErrorMessage(data.msg || 'Invalid verification code');
      }
    } catch (err) {
      setErrorMessage('An error occurred while verifying the code');
    }
  };

    return ( 
        <div className="outer-container">
            <div className="form-container">
            {step === 1 && (
              <Form>
                 <h3 className="mb-4"><b>Forgot password</b></h3>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
                   <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <p className="text-muted small">We’ll send a verification code to this emai if it matches an existing account.</p>

                <Button className="btn-join btn-blue default-btn-settings" 
                        variant="primary"
                        type="submit"
                        onClick={handleNext}>
                    Next
                </Button>

                <div className="center-text">
                    <Link to="/login"><b>Back</b></Link>
                </div>

              </Form>
            )}
             {step === 2 && (
          <Form>
            <h3 className="mb-4"><b>Enter the 6-digit code</b></h3>
            <p>Check {email} for a verification code. 
            <Link to="#" onClick={() => setStep(1)}>Change</Link> {/* Change link to go back to Step 1 */}
              </p>
            <Form.Group className="mb-3" controlId="formBasicCode">
              <Form.Control
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Form.Group>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            
            {/* Disable the Resend Code link and show a countdown */}
            <p>
              {isResendDisabled ? (
                <span className="text-muted">
                  Resend code in {countdown}s
                </span>
              ) : (
                <Link to="#" onClick={handleResendCode}>
                  Resend code
                </Link>
              )}
            </p>
            
            <Button
              className="btn-join btn-blue default-btn-settings"
              variant="primary"
              type="submit"
              onClick={handleVerifyCode}>
              Submit
            </Button>
            <p className="text-muted small">
              If you don’t see the email in your inbox, check your spam folder. If it’s not there, the email address may not be confirmed, or it may not match an existing account.
            </p>
          </Form>
        )}
            </div>
        </div>
    )
}