import express from 'express';
import { filterItems } from '../controllers/filtersController.js';
const router = express.Router();
 // Route to filter items
router.get('/filter', filterItems);

export default router;
