import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/db";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks";
import makeAdmin from "./scripts/makeAdmin";
import ProductRouter from "./routes/productRoutes";
import CartRouter from "./routes/cartRoutes";
import OrderRouter from "./routes/ordersRoutes";
import AddressRouter from "./routes/addressRoutes";
import AdminRouter from "./routes/adminRoutes";
import WishlistRouter from "./routes/wishlistRouter";

const app = express();

// Connect to mongo db
const startServer = async () => {
    try {
        await connectDB();
        await makeAdmin();
        
        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(clerkMiddleware());

        // Webhook route - must be before express.json()
        app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

        const port = process.env.PORT || 3000;

        app.get('/', (req: Request, res: Response) => {
            res.send('Server is Live!');
        });
         app.use("/api/products", ProductRouter)
         app.use("/api/cart", CartRouter)
         app.use("/api/orders", OrderRouter)
         app.use("/api/addresses", AddressRouter)
         app.use("/api/admin", AdminRouter)
         app.use("/api/wishlist", WishlistRouter)

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();