import express from 'express';
import { deleteUserAccount } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// DELETE /api/user/delete
router.delete('/delete', authMiddleware, deleteUserAccount);

export default router;