import express from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").get(authMiddleware, getCart).post(authMiddleware, addToCart);
router.route("/:id").delete(authMiddleware, removeFromCart);

export default router;
