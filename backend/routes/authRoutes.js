import express from 'express';
import { check, body } from 'express-validator';
import { register, verifyEmail, login, forgotPassword, verifyResetCode, resetPassword } from '../controllers/authController.js';

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
    body('isDonor').custom((_, { req }) => {
        if (!req.body.isDonor && !req.body.isStudent) {
            throw new Error('You must select either Donor or Student');
        }
        return true;
    }),
    body('isStudent').custom((_, { req }) => {
        if (!req.body.isDonor && !req.body.isStudent) {
            throw new Error('You must select either Donor or Student');
        }
        return true;
    })
], register);

router.get('/verify-email', verifyEmail);

// Login Route
router.post('/login', [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').exists()
], login);

// Forgot Password Route
router.post('/forgot-password', [
    check('email', 'Valid email is required').isEmail()
], forgotPassword);

// Verify reset code route

router.post('/verify-reset-code', [
    check('email', 'Valid email is required').isEmail(),
    check('verificationCode', 'Verification code is required').isLength({ min: 6, max: 6 })
], verifyResetCode)

// Reset Password Route
router.post('/reset-password', [
    check('email', 'Valid email is required').isEmail(),
    check('emailVerificationCode', 'Verification code is required').exists(),
    check('newPassword', 'Password must be at least 6 characters').isLength({ min: 6 })
], resetPassword);


export default router;