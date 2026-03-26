import { Request, Response } from "express";
import Wishlist from "../models/Wishlist.js";

// Get wishlist
// GET /api/wishlist
export const getWishlist = async (req: Request, res: Response) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products', 'name price images stock');
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }
        
        res.json({ success: true, data: wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Add to wishlist
// POST /api/wishlist/add
export const addToWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.body;
        
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }
        
        // Check if product already in wishlist
        const exists = wishlist.products.some((id: any) => id.toString() === productId);
        
        if (!exists) {
            wishlist.products.push(productId);
            await wishlist.save();
        }
        
        await wishlist.populate('products', 'name price images stock');
        res.json({ success: true, data: wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Remove from wishlist
// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            return res.status(404).json({ success: false, message: "Wishlist not found" });
        }
        
        wishlist.products = wishlist.products.filter(
            (id: any) => id.toString() !== productId
        );
        
        await wishlist.save();
        await wishlist.populate('products', 'name price images stock');
        
        res.json({ success: true, data: wishlist });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Check if product in wishlist
// GET /api/wishlist/check/:productId
export const checkWishlist = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        let isInWishlist = false;
        if (wishlist) {
            isInWishlist = wishlist.products.some((id: any) => id.toString() === productId);
        }
        
        res.json({ success: true, data: { isInWishlist } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}