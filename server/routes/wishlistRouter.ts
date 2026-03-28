// routes/wishlistRouter.ts
import express from "express";
import { protect } from "../middleware/auth.js";
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from "../controllers/wishlistController.js";

const WishlistRouter = express.Router();

WishlistRouter.get('/', protect, getWishlist);
WishlistRouter.post('/add', protect, addToWishlist);
WishlistRouter.delete('/:productId', protect, removeFromWishlist);
WishlistRouter.get('/check/:productId', protect, checkWishlist);

export default WishlistRouter;