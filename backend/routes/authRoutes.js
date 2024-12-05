// routes/authRoutes.js
import express from 'express';
import { check } from 'express-validator';
import {
    register,
    verifyEmail,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    getProfile,
    updateProfile,
    resendVerificationEmail,
    changeEmail
} from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registration Route
router.post('/register', [
    check('first_name', 'First Name is required').not().isEmpty(),
    check('last_name', 'Last Name is required').not().isEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),

    // Validate phone number
    check('phone', 'A valid phone number is required').matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),

    // Check that at least one of isDonor or isStudent is selected (boolean true/false)
    check('isDonor').isBoolean().withMessage('isDonor must be a boolean'),
    check('isStudent').isBoolean().withMessage('isStudent must be a boolean'),
    check('isDonor').custom((value, { req }) => {
        if (!value && !req.body.isStudent) {
            throw new Error('You must select either Donor or Student');
        }
        return true;
    }),
    check('isStudent').custom((value, { req }) => {
        if (!value && !req.body.isDonor) {
            throw new Error('You must select either Donor or Student');
        }
        return true;
    })
], register);

// Verify Email Route
router.post('/verify-email', verifyEmail);

// Resend Verification Email Route
router.post('/resend-verification-email', authMiddleware, resendVerificationEmail);

// Change Email Route
router.post('/change-email', authMiddleware, [
    check('newEmail', 'Valid new email is required').isEmail()
], changeEmail);

// Login Route
router.post('/login', [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').exists()
], login);

// Forgot Password Route
router.post('/forgot-password', [
    check('email', 'Valid email is required').isEmail()
], forgotPassword);

// Verify Reset Code Route
router.post('/verify-reset-code', [
    check('email', 'Valid email is required').isEmail(),
    check('verificationCode', 'Verification code must be 6 digits').isLength({ min: 6, max: 6 }).isNumeric()
], verifyResetCode);

// Reset Password Route
router.post('/reset-password', [
    check('email', 'Valid email is required').isEmail(),
    check('newPassword', 'Password must be at least 6 characters').isLength({ min: 6 })
], resetPassword);

// Get Profile Route
router.get('/profile', authMiddleware, getProfile);

// Update Profile Route
router.put('/profile', authMiddleware, [
    check('first_name', 'First Name is required').optional().not().isEmpty(),
    check('last_name', 'Last Name is required').optional().not().isEmpty(),
    check('phone', 'A valid phone number is required').optional().matches(/^\d{10}$/)
], updateProfile);

export default router;
