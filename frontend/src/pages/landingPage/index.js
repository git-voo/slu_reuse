import { useEffect, useState } from "react"
import ItemCard from "../../components/card/index.mjs"
import Footer from "../../components/footer"
import Navbar from "../../components/navigation"
import { itemsList } from "../../data/items"
import "../../styles/landingPage/index.css"
import axios from "axios"

export default function LandingPage() {

    const [items, setItems] = useState([])
    const [allItems, setAllItems] = useState(items)
    const [filters, setFilters] = useState({
        category: "All",
        location: "All Locations",
        sortOption: "newest"
      });
      useEffect(() => {
        fetchItems(); 
      }, []);

    useEffect(() => {
        fetchItems();
        filterItemsByCategory() 
      }, [filters]);
    
      const fetchItems = async () => {
        console.log("refetching items", filters.category)
        try {
          const response = await axios.get('http://localhost:4300/api/items');
          setItems(response.data);
          setAllItems(response.data)  // Set the fetched items
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      };

      const filterItemsByCategory = async ()=>{
        if (filters.category === "All") return setItems(allItems)
        try {
            const response = await axios.get(`http://localhost:4300/api/filter`,  {
                params: {
                  category: filters.category.toLowerCase(),
                //   location: filters.location,
                //   sort: filters.sortOption,
                },
              });
            setItems(response.data);  // Set the fetched items
          } catch (error) {
            console.error("Error fetching items:", error);
          }
      }

      const updateFilters = (newFilters) => {
        setFilters(newFilters); 
      };
    return (
        <div className="landing-page-container">
            <Navbar filters={filters} updateFilters={updateFilters}/>

            <div className="items-list">
                {
                    items.length?items.map((item, index) => {
                        return <ItemCard
                            key={index} userAvatar={item.userAvatar}
                            userName={item.userName} itemImage={item.itemImage}
                            title={item.title} description={item.description}
                            location={item.location} />
                    }): <p>No items found</p>

                } 
            </div>
            <Footer />
        </div>
    )

}