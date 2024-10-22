import { useEffect, useState } from 'react'
import ItemDetails from '../../components/items/singleItem/ItemDetails'
import "../../styles/items/singleItemPage.css"
import axiosInstance from '../../services/AxiosInstance'
import { useParams } from 'react-router-dom'

const SingleItemPage = () => {
    const [item, setItem] = useState()
    const { itemID } = useParams()

    useEffect(() => {
        getItem()
    }, [])


    async function getItem() { 
        if (!itemID) return alert("No Item selected")
        try {
            const item = await axiosInstance.get(`/items/${itemID}`)
            setItem(item.data)
        } catch (error) {
            console.log(error)

        }
    }
console.log(item)
    const sampleItem = {
        id: 1,
        title: "Sofa",
        donorAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
        donorName: "John Doe",
        status: "available", // Can be 'Pending' or 'Unavailable'
        description: "A comfortable, lightly-used 3-seater sofa, perfect for a living room.",
        location: "New York, NY",
        images: [
            "https://via.placeholder.com/800x400?text=Sofa+Image+1",
            "https://via.placeholder.com/800x400?text=Sofa+Image+2",
            "https://via.placeholder.com/800x400?text=Sofa+Image+3"
        ]
    }

    return (
        <div>
            <ItemDetails item={item} />
        </div>
    )
}

export default SingleItemPage
