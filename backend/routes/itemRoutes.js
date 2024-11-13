import express from 'express';
import { getItems, getItemById, getMyItems, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect routes with authMiddleware
router.get('/items', getItems);
router.get('/items/:id', getItemById);
router.get('/my-items', authMiddleware, getMyItems);
router.post('/items', authMiddleware, createItem);
router.put('/items/:id', authMiddleware, updateItem);
router.delete('/items/:id', authMiddleware, deleteItem);

export default router;
