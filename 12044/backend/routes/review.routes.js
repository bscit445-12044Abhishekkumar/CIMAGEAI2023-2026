import express from "express";
import { addReview, getProductReviews } from "../controllers/review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/:productId").get(getProductReviews).post(authMiddleware, addReview);

export default router;
