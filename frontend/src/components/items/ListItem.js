import { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap'; // Using Bootstrap for styling
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/AxiosInstance';

const ListItem = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImages, setItemImages] = useState(null);
  const [itemCategory, setItemCategory] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPickupLocation, setItemPickupLocation] = useState('');
  const [itemTags, setItemTags] = useState('');
  const [itemStatus, setItemStatus] = useState('');
  const [setItemListedOn] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchImageDescription = async () => {
    setIsLoading(true);
    try {
      const imageUrl = await uploadToCloud(itemImages); // Upload the image
      if (!imageUrl) throw new Error('Image upload failed');

      setItemImages([imageUrl]); // Store the uploaded URL as an array
      console.log('Uploaded Image URL:', imageUrl);

      const response = await axiosInstance.post('/analyze-image', { imageUrl });
      setAnalyzed(true);
      setItemDescription(response.data.description); // Use fetched description
    } catch (error) {
      console.error('Error fetching image description:', error);
      alert('Failed to fetch description for the image.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchImageDescription();
  }, []);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = e.target.files;
    setItemImages(files ? files[0] : null); // Store single file
  };

  async function uploadToCloud(imageFile) {
    if (!imageFile) {
      console.error('No image selected');
      return null;
    }

    console.log('Uploading image to cloud...');
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const { data } = await axiosInstance.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Uploaded Image URL:', data.url); // Log the URL
      return data.url; // Return the image URL
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Image upload failed. Please try again.');
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!itemName || !itemCategory || !itemImages || !itemDescription) {
      alert('Please fill in the required fields: Name, Category, Images, Description');
      return;
    }

    const payload = {
      name: itemName,
      images: Array.isArray(itemImages) ? itemImages : [itemImages], // Ensure it's an array
      description: itemDescription,
      category: itemCategory,
      quantity: itemQuantity,
      tags: itemTags ? itemTags.split(',').map((tag) => tag.trim()) : [], // Split tags and trim spaces
      pickupLocation: itemPickupLocation,
    };

    console.log('Payload being sent to backend:', payload); // Log payload for debugging

    try {
      const response = await axiosInstance.post('/items', payload);
      alert('Item listed successfully');
      navigate('/profile/my-listings');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.toString());
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">Donate an Item</h2>

      <Form onSubmit={handleSubmit}>
        {/* Item Images */}
        <Form.Group controlId="formItemImages" className="mb-3">
          <Form.Label>
            <strong>Item Image</strong>
          </Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
            className="p-2"
          />
        </Form.Group>

        {!analyzed && (
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() => fetchImageDescription(itemImages)}
          >
            {isLoading ? 'Analyzing...' : 'Save'}
          </Button>
        )}

        {analyzed && (
          <>
            {/* Item Name */}
            <Form.Group controlId="formItemName" className="mb-3">
              <Form.Label>
                <strong>Item Name</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Item Description</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Item Category</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Item Quantity</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Pickup Location</strong>
              </Form.Label>
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
              <Form.Label>
                <strong>Item Tags</strong>
                <span style={{ color: 'gray' }}> (Optional)</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags for the item (comma separated)"
                value={itemTags}
                onChange={(e) => setItemTags(e.target.value)}
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
          </>
        )}
      </Form>
    </div>
  );
};

export default ListItem;
