/**
 * Model for item creation and management
 * 
 * @author Victor Onoja
 * https://github.com/git-voo 
 */
import mongoose, { Schema } from "mongoose";
 
const msg = "Field is required";

const itemSchema = new Schema({
    name: {
        type: String,
        required: [true, msg]
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    description: {
        type: String,
        required: [true, msg]
    },
    category: {
        type: String,
        required: [true, msg]
    },
    quantity: {
        type: Number,
        default: 1
    },
    pickupLocation: {
        type: String,
        required: [true, msg]
    },
    tags: {
        type: [String],
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, msg]
    },
    status: {
        type: String,
        required: [true, msg],
        default: "available",
        enum: ["available", "pending", "unavailable"]
    },
    listedOn: {
        type: Date,
        required: [true, msg],
        default: Date.now
    }
});

const ItemModel = mongoose.model("Item", itemSchema);
export default ItemModel;
