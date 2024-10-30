import express from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/items', getItems);
router.get('/items/:id', getItemById);
router.post('/items', authMiddleware, createItem); // Protect this route with authMiddleware
router.put('/items/:id', authMiddleware, updateItem); // Protect update if only logged-in users can update
router.delete('/items/:id', authMiddleware, deleteItem); // Protect delete if only logged-in users can delete

export default router;
