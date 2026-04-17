import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/profile').get(authMiddleware, getUserProfile).put(authMiddleware, updateUserProfile);

export default router;
