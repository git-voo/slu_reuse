/**
 * Model for user creation and management
 * 
 * @author Victor Onoja
 * https://github.com/git-voo 
 */

import mongoose, { Schema } from "mongoose";
const msg = "Field is required";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, msg],
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
        type: String,
        required: [true, msg]
    },
    emailVerificationCode: {
        type: String,
        required: [true, msg]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
});

// We will include the email sending utility to send verification code everytime email is modified
userSchema.pre('save', function(next) {
    if (this.isModified('emailVerificationCode')) {
        // sendMail() utility to be built later
    }
    next();
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
