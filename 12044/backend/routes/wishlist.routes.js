import express from 'express';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlist.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(authMiddleware, getWishlist).post(authMiddleware, toggleWishlistItem);

export default router;
