import React, { useEffect, useState } from 'react';  
import ItemCard from '../../components/card/index.mjs';


const ItemListPage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await fetch('/api/items');
            const data = await response.json();
            setItems(data);
        };

        fetchItems();
    }, []);

    return (
        <div>
            {items.map((item) => (
                <ItemCard key={item._id} item={item} />
            ))}
        </div>
     
    );
};

export default ItemListPage;
