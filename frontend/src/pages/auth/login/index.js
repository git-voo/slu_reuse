import { useState }  from 'react'
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../../styles/auth/index.css';
import '../../../styles/auth/login/index.css';
import '../../../styles/button.css';
import { Link } from 'react-router-dom'; 

export default function Login() {
  // State to manage all form fields
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

   // Handle input changes for all fields
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error message when user modifies any input
    setErrorMessage('');
  };

  const handleSignin = async (e) => {
    e.preventDefault();

     // Check for email
     if (!formData.email.trim()) {
      setErrorMessage('Email is required.');
      return;
    }

    // Check for password
    if (!formData.password.trim()) {
      setErrorMessage('Password is required.');
      return;
    }

    const credentials = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:4300/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
       localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (error) {
        console.error('Error:', error);
        alert('Error occurred while logging in');
      }
  };

    return ( <div className="outer-container">
          <div className="form-container">
            <Form>
               <h3><b>Sign in</b></h3>
               <p>Connect to your SLU community</p>

              <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"/>

              <Form.Text className="text-muted"></Form.Text>
              </Form.Group>

              <Form.Group className="mb-3 password-group" controlId="formBasicPassword">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
              <Form.Group className="mb-3">
                <Link to="/forgot-password">Forgot Password?</Link>
              </Form.Group>
             
              <Button className="btn-join btn-blue default-btn-settings" variant="primary" type="submit" onClick={handleSignin}>
                Sign in
              </Button>
            </Form>
          </div>
          <p className="center-text">
                New to SLUReuse? <Link to="/register">Join now</Link>
          </p>
        </div>
    )
}