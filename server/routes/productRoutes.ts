import express from "express";
import { getProduct, getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import upload from "../middleware/upload.js";
import { authorize, protect } from "../middleware/auth.js";

const ProductRouter = express.Router()

// Get all products
ProductRouter.get('/', getProducts)

// Get single product
ProductRouter.get('/:id', getProduct)

// Create product
ProductRouter.post('/', upload.array('images', 5), protect,authorize ('admin'), createProduct)

// Update product
ProductRouter.put('/:id', upload.array('images', 5), protect,authorize ('admin'), updateProduct)

// Delete product
ProductRouter.delete('/:id', protect,authorize ('admin'), deleteProduct)

export default ProductRouter;