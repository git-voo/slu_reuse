import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//import { FcGoogle } from 'react-icons/fc';
//import sluLogo from '../../../assets/slu-logo.png';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import '../../../styles/auth/index.css';
import '../../../styles/auth/register/index.css';
import '../../../styles/button.css';
import { Link } from 'react-router-dom'; 
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Redirect to landing page
    navigate('/');
  };

    return ( 
        <div className="outer-container">
          <h2 className="form-heading">SLUReuse: A Community of Givers, A Campus of Receivers</h2>
          <h6 className="form-subheading">Connecting Generous Donors to the SLU Student Community for a Sustainable Future.</h6>
            <div className="form-container">
              <Form>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <div className="password-group">
                  <Form.Control 
                  type={passwordVisible ? "text" : "password"} placeholder="Password"/>
                  {/* Toggle button to show/hide password */}
                  <Button
                    variant="link"
                    className="show-hide-btn"
                    onClick={togglePasswordVisibility}>
                    {passwordVisible ? "Hide" : "Show"}
                  </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicRegisterAs">
                  <Form.Label style={{ fontWeight: 'bold' }}>Register as:</Form.Label>
  
                  <div className="register-as">
                    <Form.Check type="checkbox" label="Donor?" />
                    <OverlayTrigger placement="right" overlay={<Tooltip>As a donor, you can donate items to students in need.</Tooltip>}>
                    <span className="info-icon">
                    <IoMdInformationCircleOutline size={15} color="#1a2b49" />
                    </span>
                    </OverlayTrigger>
                  </div>
  
                  <div className="register-as">
                  <Form.Check type="checkbox" label="Student?" />
                  <OverlayTrigger placement="right" overlay={<Tooltip>As a student, you can receive donated items from the community.</Tooltip>}>
                  <span className="info-icon">
                  <IoMdInformationCircleOutline size={15} color="#1a2b49" />
                  </span>
                 </OverlayTrigger>
                  </div>
                </Form.Group>

                  <Button className="btn-join btn-blue default-btn-settings" variant="primary" type="submit" onClick={handleSignup}>
                  Sign Up
                </Button>

                {/*<div className="divider">or</div>

                {// SLU Email Sign Up Button }
                <Button className="btn-auth slu-auth-btn default-btn-settings" onClick={handleSignup}>
                  <img src={sluLogo} alt="SLU Logo" className="auth-icon" />
                  Continue with SLU Email
                </Button>

                {// Google Sign Up Button }
                <Button className="btn-auth google-auth-btn default-btn-settings" onClick={handleSignup}>
                  <FcGoogle className="auth-icon" />
                  Continue with Google
                </Button>

                {// Facebook Sign Up Button }
                <Button className="btn-auth facebook-auth-btn default-btn-settings" onClick={handleSignup}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="auth-icon" />
                  Continue with Facebook
                </Button>*/}

                <p className="center-text">
                  Already a member? <Link to="/login">Sign in</Link>
                </p>

              </Form>
            </div>
          </div>
  )
}