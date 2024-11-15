import UserModel from "../models/userModel.js";
import ItemModel from "../models/ItemModel.js";
import bcrypt from 'bcryptjs';

/**
 * Delete the authenticated user's account
 */
export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body; // Extract password from the request body

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ message: 'Password is required to delete your account.' });
        }

        // Find the user by ID
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        // Delete all items donated by the user
        await ItemModel.deleteMany({ donor: userId });

        // Delete the user account
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Your account has been deleted successfully.' });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
