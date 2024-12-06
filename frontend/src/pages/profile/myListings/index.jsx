import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/AxiosInstance';
import ItemCard from '../../../components/card';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './myListings.css';

const MyListings = () => {
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyItems();
    }, []);

    const fetchMyItems = async () => {
        try {
            const response = await axiosInstance.get('/my-items');
            console.log('Fetched items:', response.data); // Log the fetched data
            setMyItems(response.data);
        } catch (error) {
            console.error('Error fetching my items:', error);
            alert('Failed to load your listings.');
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (itemId) => {
        navigate(`/item/${itemId}`);
    };

    const handleEdit = (itemId) => {
        navigate(`/edit-item/${itemId}`); 
    };

    const handleDelete = async (itemId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axiosInstance.delete(`/items/${itemId}`);
                setMyItems(prevItems => prevItems.filter(item => item._id !== itemId));
                alert("Item deleted successfully.");
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete the item.");
            }
        }
    };

    if (loading) {
        return (
            <div className="my-listings-loading">
                <Spinner animation="border" variant="primary" />
                <span> Loading your listings...</span>
            </div>
        );
    }

    return (
        <div className="my-listings-container">
            <h2>My Listings</h2>
            {myItems.length > 0 ? (
                <div className="my-items-list">
                    {myItems.map(item => {
                        console.log("Item Data in MyListings:", item); // Added log here
                        return (
                            <div key={item._id} className="my-item-card">
                                <div onClick={() => handleItemClick(item._id)} className="item-card-clickable">
                                    <ItemCard
                                        itemImage={item.images[0]?.replace(/^"|"$/g, '')} // Remove extra quotes if present
                                        title={item.name}
                                        description={item.description}
                                        location={item.pickupLocation}
                                    />   
                                </div>
                                <div className="my-item-actions">
                                    <Button variant="warning" onClick={() => handleEdit(item._id)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>You have not listed any items yet.</p>
            )}
        </div>
    );
};

export default MyListings;
