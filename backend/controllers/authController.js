import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

const register = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, password, phone, isDonor, isStudent } = req.body;

    try {
        // Check if user already exists
        let user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new UserModel({
            first_name,
            last_name,
            email,
            password: await bcrypt.hash(password, 10), // Hashing the password
            phone,
            isDonor,
            isStudent
        });

        await user.save();

        console.log('I am in');
        // Log environment variables to check
        console.log(`CLIENT_URL: ${process.env.CLIENT_URL}`);
        console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);

        console.log(user);
        // Create JWT token with email information and expiration
        const verificationToken = jwt.sign({ email: user.email },
            process.env.JWT_SECRET, { expiresIn: '24h' } // Token expires in 21 hours
        );

        // Generate verification link
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;


        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            text: `Please verify your email by clicking the following link: ${verificationLink}`
        };

        // Send verification email
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Verification email sent to: ${email}`);
        } catch (emailError) {
            console.error(`Failed to send verification email: ${emailError.message}`);
            return res.status(500).json({ msg: 'Failed to send verification email' });
        }
        // Return success response with token
        res.status(201).json({ verificationToken, msg: 'User registered, verification email sent' });
    } catch (err) {
        console.error(`Error during registration: ${err.message}`);
        res.status(500).json({ msg: err.message });
    }
};


// Email Verification Handler
const verifyEmail = async(req, res) => {
    const { token } = req.query; // Extract token from URL query parameter

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

        res.status(200).json({ msg: 'Email verified successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
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
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({ msg: 'Email not verified. Please verify your email before logging in.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`Login attempt failed: Incorrect password for user with email ${email}.`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create a JWT token payload
        const payload = { user: { id: user.id } };
        // Generate JWT token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
        // Return token and success message
        res.status(200).json({
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
        console.error(`Error during Login: ${err.message}`);
        res.status(500).json({ msg: 'Server error' });
    }
};

const forgotPassword = async(req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000); // 6-digit reset code
        user.passwordResetCode = resetCode;

        await user.save();

        // Send reset code to the user's email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Your password reset code is: ${resetCode}`
        };

        transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'Password reset code sent to email' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
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
            return res.status(400).json({ msg: 'Invalid verification code' });
        }

        // If the code is correct, return success
        return res.status(200).json({ msg: 'Code verified successfully' });

    } catch (err) {
        console.error(`Error during code verification: ${err.message}`);
        return res.status(500).json({ msg: 'Server error' });
    }
};

const resetPassword = async(req, res) => {
    const { email, newPassword, passwordResetCode } = req.body;

    try {
        const user = await UserModel.findOne({ email, passwordResetCode });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid verification code' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetCode = '';

        await user.save();

        res.status(200).json({ msg: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

export { register, verifyEmail, login, forgotPassword, verifyResetCode, resetPassword };