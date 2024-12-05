import React, { useEffect, useState } from "react";
import ItemCard from "../../components/card/index";

const ItemListPage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/items");
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="item-list-page">
            {items.map((item) => (
                <ItemCard key={item._id} item={item} />
            ))}
        </div>
    );
};

export default ItemListPage;
