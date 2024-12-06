import '../../styles/cards/itemCard.css'
import locationIcon from "../../assets/icons/location.png"
import { GoDotFill } from "react-icons/go"
import { PiWechatLogoThin } from "react-icons/pi"

const ItemCard = ({ userAvatar, userName, itemImage, title, description, location }) => {
    // Debugging: Log the props passed to ItemCard
    console.log("ItemCard Props:", { userAvatar, userName, itemImage, title, description, location });
    
    return (
        <div className="item-card">
            <div className="item-card-user">
                <div className="user-avatar">
                    <img src={userAvatar} alt={userName} />
                </div>
                <h4 className="user-name">{userName}</h4>
            </div>

            <div className="item-card-body">
                <p className='available status'> <GoDotFill /> Available</p>
                <div className="item-card-image">
                     
                        <img
                        src={itemImage || "https://via.placeholder.com/150"}
                        alt={title || "Image not available"}
                        />
            </div>
                
                <h3 className="item-card-title">{title}</h3>

                <div className='location'>
                    <div className="icon">
                        <img src={locationIcon} alt="location" />
                    </div>
                    {location}

                </div>
                <p> </p>
                <p className="item-card-description">{description}</p>
            </div>

            <div className="item-card-footer">
                <button className="item-card-btn">View Details</button>
                <button className="item-card-btn message-btn" onClick={(e)=>{
                    e.stopPropagation()

                }}>
                    <PiWechatLogoThin className='icon' /> Message {userName?.split(" ")[0]}
                </button>
            </div>
        </div>
    )
}

export default ItemCard
