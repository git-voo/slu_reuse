import { useEffect, useState } from 'react'
import ItemDetails from '../../components/items/singleItem/ItemDetails'
import "../../styles/items/singleItemPage.css"
import axiosInstance from '../../services/AxiosInstance'
import { useParams } from 'react-router-dom'
import profileService from '../../services/profileService';

const SingleItemPage = () => {
    const [item, setItem] = useState()
    const [user, setUser] = useState(null)
    const { itemID } = useParams()

    useEffect(() => {
        getItem()
        getUserProfile() // Fetch user profile if the user is logged in
    }, [])


    async function getItem() {
        if (!itemID) return alert("No Item selected")
        try {
            const item = await axiosInstance.get(`/items/${itemID}`)
            setItem(item.data)
        } catch (error) {
            alert(error.toString())
            console.log(error)
        }
    }
    
    async function getUserProfile() {
        const userToken = localStorage.getItem("token");
        if (userToken) {
            try {
                const profile = await profileService.getProfile();
                setUser(profile); // Set user profile data if logged in
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }
    }

    return (
        <div>
            {
                item ? <ItemDetails item={item} user={user}/> : "Loading..."
            }
        </div>
    )
}

export default SingleItemPage
