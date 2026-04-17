import express from 'express';
import { getDashboardStats, getAllUsers, updateOrderStatus, getAllOrders, updateUserRole, deleteUser } from '../controllers/admin.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.put('/order/:id', authMiddleware, adminMiddleware, updateOrderStatus);
router.patch('/user/:id', authMiddleware, adminMiddleware, updateUserRole);
router.delete('/user/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
