import express from 'express';
import { createCoupon, applyCoupon } from '../controllers/coupon.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').post(authMiddleware, adminMiddleware, createCoupon);
router.route('/apply').post(authMiddleware, applyCoupon);

export default router;
