import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import ProductRouter from "./routes/productsRoutes.js";
import CartRouter from "./routes/cartRoutes.js";
import OrderRouter from "./routes/ordersRoutes.js";
import AddressRouter from "./routes/addressRoutes.js";
import WishlistRouter from "./routes/wishlistRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import makeAdmin from "./scripts/makeAdmin.js";
import { clerkWebhook } from "./controllers/webhooks.js";
import { handleStripeWebhook } from "./controllers/paymentController.js";
import paymentRouter from "./routes/paymentRoute.js";
import { seedProducts } from "./scripts/seedProducts.js";

const app = express();

// Connect to MongoDB
await connectDB();

app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// Middleware
app.use(cors());

<<<<<<< HEAD
// Stripe Webhook
process.env.STRIPE_SECRET_KEY && app.post("/api/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
=======
// Stripe Webhook (only if STRIPE_SECRET_KEY is set)
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== '_______stripe_secret_key_______') {
    app.post("/api/stripe", express.raw({ type: "application/json" }), handleStripeWebhook);
}
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66

app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.use("/api/products", ProductRouter);
app.use("/api/cart", CartRouter);
app.use("/api/orders", OrderRouter);
app.use("/api/addresses", AddressRouter);
app.use("/api/wishlist", WishlistRouter);
app.use("/api/admin", AdminRouter);
<<<<<<< HEAD
process.env.STRIPE_SECRET_KEY && app.use("/api/payments", paymentRouter);
=======

if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== '_______stripe_secret_key_______') {
    app.use("/api/payments", paymentRouter);
}
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66

const PORT = process.env.PORT || 3000;

await makeAdmin();

<<<<<<< HEAD
// Seed products if no products are present
await seedProducts(process.env.MONGODB_URI as string);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
=======
// Seed products in background (don't block server startup)
seedProducts(process.env.MONGODB_URI as string).catch(err => {
    console.error("Failed to seed products:", err);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
