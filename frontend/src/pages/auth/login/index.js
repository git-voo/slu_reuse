import React, { useState }  from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FcGoogle } from 'react-icons/fc';
import sluLogo from '../../../assets/slu-logo.png';
import '../../../styles/auth/index.css';
import '../../../styles/auth/login/index.css';
import '../../../styles/button.css';
import { Link } from 'react-router-dom'; 

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    const navigate = useNavigate();

    const handleSignin = (e) => {
        e.preventDefault();
        // Redirect to landing page
        navigate('/');
      };

    return ( <div className="outer-container">
          <div className="form-container">
            <Form>
               <h3><b>Sign in</b></h3>
               <p>Connect to your SLU community</p>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>

              <Form.Group className="mb-3 password-group" controlId="formBasicPassword">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  />
                {/* Toggle button to show/hide password */}
                <Button
                    variant="link"
                    className="show-hide-btn"
                    onClick={togglePasswordVisibility}>
                {passwordVisible ? "Hide" : "Show"}
                </Button>
              </Form.Group>

              <Form.Group className="mb-3">
                <Link to="/forgot-password">Forgot Password?</Link>
              </Form.Group>
             
              <Button className="btn-join btn-blue default-btn-settings" variant="primary" type="submit" onClick={handleSignin}>
                Sign in
              </Button>

              <div className="divider">or</div>

              {/* SLU Email Sign Up Button */}
              <Button className="btn-auth slu-auth-btn default-btn-settings" onClick={handleSignin}>
                <img src={sluLogo} alt="SLU Logo" className="auth-icon" />
                Continue with SLU Email
              </Button>

              {/* Google Sign Up Button */}
              <Button className="btn-auth google-auth-btn default-btn-settings" onClick={handleSignin}>
                <FcGoogle className="auth-icon" />
                Continue with Google
              </Button>

              {/* Facebook Sign Up Button */}
              <Button className="btn-auth facebook-auth-btn default-btn-settings" onClick={handleSignin}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="auth-icon" />
                Continue with Facebook
              </Button>
            </Form>
          </div>
          <p className="center-text">
                New to SLUReuse? <Link to="/register">Join now</Link>
          </p>
        </div>
    )
}