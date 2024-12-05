import React, { useEffect, useState } from 'react';
import ItemCard from '../../components/card/index.js';
import axiosInstance from '../../services/AxiosInstance'; // Import the AxiosInstance

const ItemListPage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Use axiosInstance for making the API call
                const response = await axiosInstance.get('/items'); 
                setItems(response.data); // Set the items in the state
            } catch (error) {
                console.error('Error fetching items:', error.message);
            }
        };

        fetchItems(); // Call the fetch function on component load
    }, []);

    return (
        <div>
            {items.map((item) => (
                <ItemCard key={item._id} item={item} /> // Pass each item to the ItemCard component
            ))}
        </div>
    );
};

export default ItemListPage;
