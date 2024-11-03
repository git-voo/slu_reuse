/**
 * Model for user creation and management
 * 
 * @author Victor
 * https://github.com/git-voo 
 */

import mongoose, { Schema } from "mongoose";
const msg = "Field is required";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, msg]
    },
    last_name: {
        type: String,
        required: [true, msg]
    },
    email: {
        type: String,
        required: [true, msg],
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isDonor: {
        type: Boolean,
        default: false,
    },
    isStudent: {
        type: Boolean,
        default: false,
    },
    passwordResetCode: {
        type: String,
        required: false
    }
});

// Prevent model recompilation by checking if it already exists
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
