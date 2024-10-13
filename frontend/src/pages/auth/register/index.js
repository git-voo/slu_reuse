import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../../../styles/auth/index.css';
import '../../../styles/auth/register/index.css';
import '../../../styles/button.css';
import { Link } from 'react-router-dom'; 
import Spinner from 'react-bootstrap/Spinner'; // Bootstrap Spinner

export default function Register() {
  // State to manage all form fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    isDonor: false,
    isStudent: false,
    rememberMe: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,  // Handle checkbox and other input types
    });
    // Clear error message when user modifies any input
    setErrorMessage('');
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check for first name
    if (!formData.first_name.trim()) {
      setErrorMessage('First name is required.');
      return;
    }

    // Check for last name
    if (!formData.last_name.trim()) {
      setErrorMessage('Last name is required.');
      return;
    }

    // Check for email
    if (!formData.email.trim()) {
      setErrorMessage('Email is required.');
      return;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    // Check for password
    if (!formData.password.trim()) {
      setErrorMessage('Password is required.');
      return;
    } else if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(formData.phone)) {
      setErrorMessage('Phone number must be exactly 10 digits.');
      return;
  }

    // Check if at least one checkbox is selected (either Donor or Student)
    if (!formData.isDonor && !formData.isStudent) {
      setErrorMessage('Please select either Donor or Student.');
      return;
    }

    console.log('Form Data:', formData);

     // If no errors, proceed with form submission
    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      isDonor: formData.isDonor,
      isStudent: formData.isStudent,
    };

    try{
      setIsLoading(true);
       const response = await fetch('http://localhost:4300/api/auth/register',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (response.ok) {
      alert('Registration successful! Check your email for verification.');
      setIsLoading(false);
      navigate('/login');
    } else {
      alert(data.msg || 'Registration failed');
    }
    }
    catch(error){
      console.error('Error', error);
      alert('Error occurred while registration')
    }
  };

  return (

    <div className={`register-form ${isLoading ? 'loading-active' : ''}`}> {/* Apply loading class */}
    {isLoading && (
        <div className="loading-overlay"> {/* Loading spinner */}
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </div>
    )}

    <div className="outer-container">
      <h2 className="form-heading">SLUReuse: A Community of Givers, A Campus of Receivers</h2>
      <h6 className="form-subheading">Connecting Generous Donors to the SLU Student Community for a Sustainable Future.</h6>
      <div className="form-container">
        <Form>
          {/* First Name Field */}
          <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </Form.Group>

          {/* Last Name Field */}
          <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </Form.Group>

          {/* Phone Field */}
          <Form.Group className="mb-3" controlId="formBasicPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </Form.Group>

          {/* Email Field */}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </Form.Group>

          {/* Password Field */}
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div className="password-group">
              <Form.Control
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <Button
                variant="link"
                className="show-hide-btn"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </Button>
            </div>
          </Form.Group>

          {/* "Remember Me" Checkbox */}
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              name="rememberMe"
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleChange}  // Use handleChange to update the checkbox state
            />
          </Form.Group>

          {/* Register as: Donor/Student Checkboxes */}
          <Form.Group className="mb-3" controlId="formBasicRegisterAs">
            <Form.Label style={{ fontWeight: 'bold' }}>Register as:</Form.Label>

            <div className="register-as">
              <Form.Check
                type="checkbox"
                name="isDonor"
                label="Donor?"
                checked={formData.isDonor}
                onChange={handleChange}
              />
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>As a donor, you can donate items to students in need.</Tooltip>}
              >
                <span className="info-icon">
                  <IoMdInformationCircleOutline size={15} color="#1a2b49" />
                </span>
              </OverlayTrigger>
            </div>

            <div className="register-as">
              <Form.Check
                type="checkbox"
                name="isStudent"
                label="Student?"
                checked={formData.isStudent}
                onChange={handleChange}
              />
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>As a student, you can receive donated items from the community.</Tooltip>}
              >
                <span className="info-icon">
                  <IoMdInformationCircleOutline size={15} color="#1a2b49" />
                </span>
              </OverlayTrigger>
            </div>
          </Form.Group>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          <Button className="btn-join btn-blue default-btn-settings" variant="primary" type="submit" onClick={handleSignup}>
            Sign Up
          </Button>

          <p className="center-text">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </Form>
      </div>
    </div>
    </div>
  );
}
