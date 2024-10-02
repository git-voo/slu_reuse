import '../../styles/cards/itemCard.css'
import locationIcon from "../../assets/icons/location.png"
import { GoDotFill } from "react-icons/go"


const ItemCard = ({ userAvatar, userName, itemImage, title, description, location }) => {
    return (
        <div className="item-card">

            <div className="item-card-user">
                <div className="user-avatar">
                    <img src={userAvatar} alt={userName}  />
                </div>
                <h4 className="user-name">{userName}</h4>
            </div>

            <div className="item-card-body">
                <p className='available status' > <GoDotFill /> Available</p>
                <div className="item-card-image" >
                    <img src={itemImage} alt={title} />
                </div>

                <h3 className="item-card-title">{title}</h3>

                <div className='location'>
                    <div className="icon">
                        <img src={locationIcon} alt="location" />
                    </div>
                    {location}
                </div>

                <p className="item-card-description">{description}
                </p>

            </div>


            <div className="item-card-footer">
                <button className="item-card-btn">View Details</button>
                <button className="item-card-btn message-btn">Message Donor</button>
            </div>
        </div>
    )
}

export default ItemCard
