
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap'; // Using Bootstrap for styling

const ListItem = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImages, setItemImages] = useState(null);

  const [itemCategory, setItemCategory] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPickupLocation, setItemPickupLocation] = useState('');
  const [itemTags, setItemTags] = useState('');
  const [itemDonar, setItemDonar] = useState('');
  const [itemStatus, setItemStatus] = useState('');
  const [itemListedOn, setItemListedOn] = useState('');

  

  const handleImageChange = (e) => {
    setItemImages(e.target.files);
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();
    // Here, you'd handle the form submission, such as sending the data to the backend
    console.log('Item Name:', itemName);
    console.log('Item Description:', itemDescription);
    console.log('Item Images:', itemImages);

    console.log('Item Categories:', itemCategory);
    console.log('Item Quantity:', itemQuantity);
    console.log('Item PickupLocation:', itemPickupLocation);
    console.log('Item Tags:', itemTags);
    console.log('Item Donar:', itemDonar);
    console.log('Item Status:', itemStatus);
    console.log('Item Listed On:', itemListedOn);
    
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


         {/* Item Category */}
         <Form.Group controlId="formItemCategory" className="mb-3">
          <Form.Label><strong>Item Category</strong></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter the category of the item" 
            value={itemCategory} 
            onChange={(e) => setItemCategory(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Item Quantity */}
        <Form.Group controlId="formItemQuantity" className="mb-3">
          <Form.Label><strong>Item Quantity</strong></Form.Label>
          <Form.Control 
            type="number" 
            placeholder="Enter the quantity of the item" 
            value={itemQuantity} 
            onChange={(e) => setItemQuantity(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Pickup Location */}
        <Form.Group controlId="formItemPickupLocation" className="mb-3">
          <Form.Label><strong>Pickup Location</strong></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter the pickup location" 
            value={itemPickupLocation} 
            onChange={(e) => setItemPickupLocation(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Item Tags */}
        <Form.Group controlId="formItemTags" className="mb-3">
          <Form.Label><strong>Item Tags</strong></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter tags for the item (comma separated)" 
            value={itemTags} 
            onChange={(e) => setItemTags(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Item Donar */}
        <Form.Group controlId="formItemDonar" className="mb-3">
          <Form.Label><strong>Item Donar</strong></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter the name of the donar" 
            value={itemDonar} 
            onChange={(e) => setItemDonar(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Item Status */}
        <Form.Group controlId="formItemStatus" className="mb-3">
          <Form.Label><strong>Item Status</strong></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter the status of the item" 
            value={itemStatus} 
            onChange={(e) => setItemStatus(e.target.value)} 
            className="p-2"
          />
        </Form.Group>

        {/* Item Listed On */}
        <Form.Group controlId="formItemListedOn" className="mb-3">
          <Form.Label><strong>Item Listed On</strong></Form.Label>
          <Form.Control 
            type="date" 
            value={itemListedOn} 
            onChange={(e) => setItemListedOn(e.target.value)} 
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
