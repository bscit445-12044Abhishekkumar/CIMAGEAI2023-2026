import express from "express";
import {
  createCheckoutSession,
  processPayment,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create Stripe checkout session
router.post(
  "/create-checkout-session",
  authMiddleware,
  createCheckoutSession
);

// Optional custom process route
router.post("/process", authMiddleware, processPayment);

// Verify Stripe payment after success redirect
router.get("/verify", authMiddleware, verifyPayment);

export default router;