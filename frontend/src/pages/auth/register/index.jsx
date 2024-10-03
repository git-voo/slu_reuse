import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FcGoogle } from 'react-icons/fc';
import sluLogo from '../../../assets/slu-logo.png';
import '../../../styles/register.css';
import '../../../styles/button.css';

export default function Register() {
    return ( 
        <div className="outer-container">
          <h2 className="form-heading">SLUReuse: A Community of Givers, A Campus of Receivers</h2>
          <h6 className="form-subheading">Connecting Generous Donors to the SLU Student Community for a Sustainable Future.</h6>
            <div className="form-container">
<Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>
      <Button className="btn-join btn-blue default-btn-settings" variant="primary" type="submit">
      Sign Up
      </Button>

      <div className="divider">or</div>


                {/* SLU Email Sign Up Button */}
                <Button className="btn-auth slu-auth-btn default-btn-settings">
                <img src={sluLogo} alt="SLU Logo" className="auth-icon" />
                  Continue with SLU Email
                </Button>

                {/* Google Sign Up Button */}
                <Button className="btn-auth google-auth-btn default-btn-settings">
                <FcGoogle className="auth-icon" />
                Continue with Google
                </Button>

                {/* Facebook Sign Up Button */}
                <Button className="btn-auth facebook-auth-btn default-btn-settings">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="auth-icon" />
                Continue with Facebook
                </Button>
    </Form>
        </div>
        </div>
    )
}