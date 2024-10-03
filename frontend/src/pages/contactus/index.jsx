import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../styles/contactus.css';

export default function Contactus() {
  const [showForm, setShowForm] = useState(false);

  const handleFormOpen = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <div className="contact-page">
      <div className="content-container">
        <div className="contact-info">
          <h2>SLU-Reuse Office</h2>
          <p>DuBourg Hall, Room 119</p>
          <p>Saint Louis University</p>
          <p>DuBourg Hall, Room 119</p>
          <p>314-335-0775</p>
          <p>victor@slureuse.com</p>
          <p>Mon-Fri 9:30am – 5:00pm</p>
          <p>Sat-Sun Closed</p>
          <Button variant="primary" onClick={handleFormOpen}>
            Contact Form
          </Button>
        </div>

    
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3104.899158080166!2d-90.23743878464867!3d38.63678497961637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d8b31bc0df1c6b%3A0x92cb2a5b623df4f4!2sSaint+Louis+University!5e0!3m2!1sen!2sus!4v1603395652958!5m2!1sen!2sus"
            title="Google maps location to SLU-Reuse Office"
            width="100%"
            height="450"
            style={{ border: 0, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)' }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          />
        </div>
      </div>

    
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Button className="close-button" variant="light" onClick={handleFormClose}>X</Button>
            <h2>Contact us</h2>
            <p>Thank you for considering our services. This is a donation website, SLU Reuse, pertaining to SLU users. We will get back to you within 48 hours.</p>
            <Form className="contact-form">
              <Form.Group controlId="formName">
                <Form.Label>Name*</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" required />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email address*</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" required />
              </Form.Group>

              <Form.Group controlId="formPhone">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="tel" placeholder="Enter your phone number" required />
              </Form.Group>

              <Form.Group controlId="formMessage">
                <Form.Label>What would you like to let us know?*</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter your message" required />
              </Form.Group>

              <Button variant="primary" type="submit">
                Send
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
