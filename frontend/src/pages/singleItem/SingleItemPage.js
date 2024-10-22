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
            alert(error.toString())
            console.log(error)
        }
    }
    
    return (
        <div>
            {
                item ? <ItemDetails item={item} /> : "Loading..."
            }
        </div>
    )
}

export default SingleItemPage
