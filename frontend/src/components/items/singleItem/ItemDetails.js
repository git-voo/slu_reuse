import { useState } from 'react'
import "../../../styles/items/singleItemPage.css"

const ItemDetails = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(0)

    const nextImage = () => {
        setCurrentImage((prevIndex) =>
            prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
        )
    }

    const prevImage = () => {
        setCurrentImage((prevIndex) =>
            prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
        )
    }

    return (
        <div className="single-item-container">
            {/* Images Carousel */}
            <div className="item-carousel">
                <img
                    src={item.images[currentImage]}
                    alt={item.title}
                    className="item-image"
                />
                {item.images.length > 1 && (
                    <div className="carousel-controls">
                        <button onClick={prevImage}>&lt;</button>
                        <button onClick={nextImage}>&gt;</button>
                    </div>
                )}
            </div>

            {/* Item Details */}
            <div className="item-details">
                <h2 className="item-title">{item.title}</h2>
                <div className="item-donor">
                    <img src={item.donorAvatar} alt={item.donorName} className="donor-avatar" />
                    <span>{item.donorName}</span>
                </div>
                <p className={`item-status ${item.status.toLowerCase()}`}>
                    {item.status}
                </p>
                <p className="item-description">{item.description}</p>
                <p className="item-location">
                    <strong>Location:</strong> {item.location}
                </p>
                <p className="item-date">
                    <strong>Listed on:</strong> {item.listedDate}
                </p>
                {item.additionalNotes && (
                    <p className="item-notes">
                        <strong>Additional Notes:</strong> {item.additionalNotes}
                    </p>
                )}
            </div>

            {/* Chat and Other Actions */}
            <div className="item-actions">
                <button className="chat-button">Chat with Donor</button>
                <button className="contact-button">Contact Donor</button>
            </div>
        </div>
    )
}

export default ItemDetails