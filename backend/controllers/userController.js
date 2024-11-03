import UserModel from "../models/UserModel.js";
import ItemModel from "../models/ItemModel.js";

/**
 * Delete the authenticated user's account
 */
export const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete all items donated by the user
        await ItemModel.deleteMany({ donor: userId });

        // Delete the user
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error("Error deleting user account:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};