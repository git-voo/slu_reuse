import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { sendMail } from "../utils/mailer/index.mjs"


const register = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { first_name, last_name, email, password, phone, isDonor, isStudent } = req.body;

    // Ensure required environment variables are present
    if (!process.env.JWT_SECRET || !process.env.CLIENT_URL) {
        return res.status(500).json({ msg: 'Server configuration error. Please try again later.' });
    }

    try {
        // Check if user already exists
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Check if the email is an SLU email
        const isSluEmail = email.endsWith('slu.edu');

        user = new UserModel({
            first_name,
            last_name,
            email,
            password: await bcrypt.hash(password, 10), // Hashing the password
            phone,
            isDonor,
            isStudent,
            isSluEmail
        });

        await user.save();

        // Create JWT token with email information and expiration
        const verificationToken = jwt.sign({ email: user.email },
            process.env.JWT_SECRET, { expiresIn: '24h' } // Token expires in 24 hours
        );
        // Generate verification link
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        // send verificaton link email
        const userDetail = {
            name: user.first_name + ' ' + user.last_name,
            email: user.email
        }
        try {
            const emailResponse = await sendMail(userDetail,
                "Verify your email",
                `Please verify your email by clicking the following link: ${verificationLink}`);
            return res.status(200).json({ message: 'Registration successful' });
        } catch (error) {
            console.error('Error during email sending:', error); // Log the error to verify in tests
            return res.status(error.status || 500).json({ msg: "Error sending email", error: error.message });
        }
    } catch (err) {
        console.error(`Error during registration: ${err.message}`);
        return res.status(500).json({ msg: err.message });
    }
};


// Email Verification Handler
const verifyEmail = async(req, res) => {
    const { token } = req.body; // Extract token from request body
    if (!token) {
        return res.status(400).json({ msg: 'Token is required' });
    }
    try {
        // Verify the token using the same secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded; // Extract email from the token

        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid token or user does not exist.' });
        }

        // Check if the email is already verified
        if (user.isEmailVerified) {
            return res.status(400).json({ msg: 'Email is already verified' });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        await user.save();

        return res.status(200).json({ msg: 'Email verified successfully' });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token has expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Invalid token' });
        }

        console.error(`Error during email verification for token: ${token}: ${err.message}`);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await UserModel.findOne({ email });

        // Check if user exists
        if (!user) {
            console.log(`Login attempt failed: User with email ${email} not found.`);
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({ msg: 'Email not verified. Please verify your email before logging in.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`Login attempt failed: Incorrect password for user with email ${email}.`);
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        // Create a JWT token payload
        const payload = { user: { id: user.id } };
        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
        // Return token and success message
        return res.status(200).json({
            token,
            msg: 'Logged in successfully',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                isDonor: user.isDonor,
                isStudent: user.isStudent
            }
        });
    } catch (err) {
        console.error(`Error during login for email: ${email}: ${err.message}`);
        return res.status(500).json({ msg: 'Server error' });
    }
};

const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'User does not exist' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit reset code

        // send reset password email
        const userDetail = {
            name: user.first_name + ' ' + user.last_name,
            email: user.email
        }
        try {
            const emailResponse = await sendMail(userDetail,
                'Password Reset',
                `Your password reset code is: ${resetCode}`);
            user.passwordResetCode = resetCode;
            await user.save();

            return res.status(emailResponse.status).json({ message: emailResponse.message });
        } catch (error) {
            return res.status(error.status || 500).json({ msg: "Error sending email", error: error.message });
        }
    } catch (err) {
        console.error(`Error during forgot password for email: ${email}: ${err.message}`);
        return res.status(500).json({ msg: err.message });
    }
};

const verifyResetCode = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, verificationCode } = req.body;
    try {
        // Find user by email and verification code
        const user = await UserModel.findOne({ email, passwordResetCode: verificationCode });
        if (!user) {
            console.log(`Verification attempt failed: Invalid verification code for email ${email}.`);
            return res.status(401).json({ msg: 'Invalid verification code' });
        }
        // If the code is correct, return success
        return res.status(200).json({ msg: 'Code verified successfully' });
    } catch (err) {
        console.error(`Error during forgot password for email: ${email}: ${err.message}`);
        return res.status(500).json({ msg: 'Server error' });
    }
};

const resetPassword = async(req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log(`Password reset failed: User with email ${email} not found.`);
            return res.status(404).json({ msg: 'User not found' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetCode = '';
        await user.save();
        console.log(`Password reset successful for email: ${email}.`);
        return res.status(200).json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(`Error during password reset: ${err.message}`);
        return res.status(500).json({ msg: 'Server error' });
    }
};

// Get Profile Handler
const getProfile = async(req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json(user); // Return the user object directly
    } catch (err) {
        console.error(`Error fetching user profile: ${err.message}`);
        return res.status(500).json({ msg: 'Server error' });
    }
};

// Update Profile Handler
const updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const updatedData = req.body;
        const allowedUpdates = ['first_name', 'last_name', 'phone'];
        const updates = {};
        for (let key of allowedUpdates) {
            if (updatedData[key] !== undefined) {
                updates[key] = updatedData[key];
            }
        }
        const user = await UserModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        return res.status(200).json(user); // Return the updated user object directly
    } catch (err) {
        console.error(`Error updating user profile: ${err.message}`);
        return res.status(500).json({ msg: 'Server error' });
    }
};


export { register, verifyEmail, login, forgotPassword, verifyResetCode, resetPassword, getProfile, updateProfile };