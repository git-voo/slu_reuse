
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap'; // Using Bootstrap for styling

const ListItem = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImages, setItemImages] = useState(null);

  const handleImageChange = (e) => {
    setItemImages(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you'd handle the form submission, such as sending the data to the backend
    console.log('Item Name:', itemName);
    console.log('Item Description:', itemDescription);
    console.log('Item Images:', itemImages);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}> 
      <h2 className="text-center mb-4">Donate an Item</h2>
      <Form onSubmit={handleSubmit}>
        {/* Item Images */}
        <Form.Group controlId="formItemImages" className="mb-3">
          <Form.Label><strong>Item Images</strong></Form.Label>
          <Form.Control 
            type="file" 
            onChange={handleImageChange} 
            multiple 
            className="p-2"
          />
        </Form.Group>

        {/* Item Name */}
        <Form.Group controlId="formItemName" className="mb-3">
          <Form.Label><strong>Item Name</strong></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter the name of the item" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Item Description */}
        <Form.Group controlId="formItemDescription" className="mb-3">
          <Form.Label><strong>Item Description</strong></Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            placeholder="Enter a description of the item" 
            value={itemDescription} 
            onChange={(e) => setItemDescription(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Buttons */}
        <div className="d-flex justify-content-between">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ListItem;
