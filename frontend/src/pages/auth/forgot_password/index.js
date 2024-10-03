import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../../styles/auth/index.css';
import { Link } from 'react-router-dom';

export default function Forgot_Password() {
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Redirect to login page
    navigate('/login');
  };
    return ( 
        <div className="outer-container">
            <div className="form-container">
              <Form>
                 <h3 className="mb-4"><b>Forgot password</b></h3>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                   <Form.Control type="email" placeholder="Enter email" />
                   <Form.Text className="text-muted"></Form.Text>
                </Form.Group>

                <p className="text-muted small">We’ll send a verification code to this emai if it matches an existing account.</p>

                <Button className="btn-join btn-blue default-btn-settings" 
                        variant="primary"
                        type="submit"
                        onClick={handleResetPassword}>
                    Reset Password
                </Button>

                <div className="center-text">
                    <Link to="/login"><b>Back</b></Link>
                </div>

              </Form>
            </div>
        </div>
    )
}