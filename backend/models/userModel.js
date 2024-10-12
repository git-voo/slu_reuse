/**
 * Model for user creation and management
 * 
 * @author Victor Onoja
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

// We will include the email sending utility to send verification code everytime email is modified
userSchema.pre('save', function(next) {
    // sendMail() utility to be built later
    next();
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;