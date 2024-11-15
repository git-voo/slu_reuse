import '../../styles/cards/itemCard.css'
import locationIcon from "../../assets/icons/location.png"
import { GoDotFill } from "react-icons/go"
import { PiWechatLogoThin } from "react-icons/pi"
import { useState, useEffect } from 'react'
import profileService from '../../services/profileService.js'

const ItemCard = ({ item, onChatClick }) => {
    const [isDonor, setIsDonor] = useState(false)
    const [isRequester, setIsRequester] = useState(false)
    const [userId, setUserId] = useState(null)

    // Determine if the logged-in user is the donor or requester
    useEffect(() => {
        const getProfile = async () => {
            try {
                const loggedUser = await profileService.getProfile()
                setUserId(loggedUser._id)
                if (loggedUser._id === item.ownerId) {
                    setIsDonor(true)  // User is the donor
                } else {
                    setIsRequester(true)  // User is the requester
                }
            } catch (error) {
                console.error('Error fetching profile:', error)
            }
        }

        getProfile()
    }, [item])

    // Handler when the "Message" button is clicked
    const handleMessageClick = (e) => {
        e.stopPropagation()
        // Pass the correct role to open the conversation for either donor or requester
        onChatClick(item._id, isDonor, isRequester)
    }

    return (
        <div className="item-card">
            <div className="item-card-user">
                <div className="user-avatar">
                    <img src={item.userAvatar} alt={item.userName} />
                </div>
                <h4 className="user-name">{item.userName}</h4>
            </div>

            <div className="item-card-body">
                <p className='available status'> <GoDotFill /> Available</p>
                <div className="item-card-image">
                    <img src={item.images[0]} alt={item.title} />
                </div>

                <h3 className="item-card-title">{item.title}</h3>

                <div className='location'>
                    <div className="icon">
                        <img src={locationIcon} alt="location" />
                    </div>
                    {item.location}
                </div>
                <p> </p>
                <p className="item-card-description">{item.description}</p>
            </div>

            <div className="item-card-footer">
                <button className="item-card-btn">View Details</button>

                {/* Conditionally render the message button based on user role */}
                {isRequester && (
                    <button className="item-card-btn message-btn" onClick={handleMessageClick}>
                        <PiWechatLogoThin className='icon' /> Message {item.userName?.split(" ")[0]}
                    </button>
                )}

                {isDonor && (
                    <button className="item-card-btn message-btn" onClick={handleMessageClick}>
                        <PiWechatLogoThin className='icon' /> Chat with Requester
                    </button>
                )}
            </div>
        </div>
    )
}

export default ItemCard
