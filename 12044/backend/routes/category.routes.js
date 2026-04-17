import express from 'express';
import { getCategories, createCategory } from '../controllers/category.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(getCategories).post(authMiddleware, adminMiddleware, createCategory);

export default router;
