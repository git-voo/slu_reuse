import ItemDetails from '../../components/items/singleItem/ItemDetails'
 import "../../styles/items/singleItemPage.css"

const App = () => {
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
            <ItemDetails item={sampleItem} />
        </div>
    )
}

export default App
