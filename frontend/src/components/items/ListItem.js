
import { useState, useEffect} from 'react'
import { Button, Form } from 'react-bootstrap' // Using Bootstrap for styling
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import axiosInstance from '../../services/AxiosInstance'



const ListItem = () => {
  const [itemName, setItemName] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [itemImages, setItemImages] = useState([])
  const [itemCategory, setItemCategory] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')
  const [itemPickupLocation, setItemPickupLocation] = useState('')
  const [itemTags, setItemTags] = useState('')
  const [itemStatus, setItemStatus] = useState('')
  const [setItemListedOn] = useState('')

  const navigate = useNavigate()
  const imageUrl = "https://drive.google.com/uc?export=view&id=1NMAXe9QFB910oXc4RGqlUowIezwj0vvR";

  const fetchImageDescription = async () => {
    try {
      const response = await axios.post('/api/analyze-image', { imageUrl }); // Use your backend endpoint
      setItemDescription(response.data.description); // Set the fetched description
    } catch (error) {
      console.error('Error fetching image description:', error);
      alert('Failed to fetch description for the image.');
    }
  };

  useEffect(() => {
    fetchImageDescription();
  }, []);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const files = e.target.files
    setItemImages(files ? Array.from(files) : []) // Convert FileList to Array

  }

  const handleSubmit = async (e) => {

    const handleCancel = () => {
      setItemName('')
      setItemDescription('')
      setItemImages([])
      setItemCategory('')
      setItemQuantity('')
      setItemPickupLocation('')
      setItemTags('')
      setItemStatus('')
      setItemListedOn('')
    }


    e.preventDefault()

    // validation on client side
    if (!itemName || !itemCategory || !itemImages.length || !itemDescription) {
      alert("Please fill in the required fields: Name, Category, Images, Description, ")
      return
    }


    // Create a FormData object to send images and other form data
    const formData = new FormData()

    const payload = {
      "name": itemName,
      "images": JSON.stringify(itemImages),
      "description": itemDescription,
      "category": itemCategory,
      "quantity": itemQuantity,
      "tags": itemTags,
      'pickupLocation': itemPickupLocation
    }
    try {
      const response = await axiosInstance.post('/items', payload)
      alert("Item listed successfully")
      navigate("/")
      console.log('Response:', response.data)
      // Handle success (e.g., show a success message, clear the form, etc.)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(error.toString())
      // Handle error (e.g., show an error message)
    }
  }




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
          <Form.Label><strong>Item Tags</strong><span style={{ color: 'gray' }}> (Optional)</span></Form.Label>
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
      </Form>
    </div>
  )
}

export default ListItem
