import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create order
router.post("/", authMiddleware, createOrder);

// Get logged in user orders
router.get("/myorders", authMiddleware, getUserOrders);

// Get order by ID
router.get("/:id", authMiddleware, getOrderById);

export default router;