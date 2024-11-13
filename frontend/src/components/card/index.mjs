import '../../styles/cards/itemCard.css'
import locationIcon from "../../assets/icons/location.png"
import { GoDotFill } from "react-icons/go"
import { PiWechatLogoThin } from "react-icons/pi"
import { useState } from 'react'
import Conversations from '../conversations/index.js'

const ItemCard = ({ item, userId, onChatClick  }) => {

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
                <button className="item-card-btn message-btn" onClick={(e) => {
                    e.stopPropagation()
                    onChatClick()

                }}>
                    <PiWechatLogoThin className='icon' /> Message {item.userName?.split(" ")[0]}
                </button>
            </div>

        
        </div>
    )
}

export default ItemCard
