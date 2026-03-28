import Stripe from "stripe";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { Request, Response } from "express";

<<<<<<< HEAD
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
=======
// Initialize Stripe only if secret key exists
let stripe: Stripe | null = null;

try {
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== '_______stripe_secret_key_______') {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        console.log("Stripe initialized successfully");
    } else {
        console.log("Stripe not configured - payment features disabled");
    }
} catch (error) {
    console.error("Failed to initialize Stripe:", error);
}
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66

// Create Checkout Session
// POST /api/payment/checkout
export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
<<<<<<< HEAD
        const { items, shipping, success_url, cancel_url, orderId } = req.body;

=======
        if (!stripe) {
            return res.status(503).json({ 
                success: false, 
                message: "Payment service is not configured" 
            });
        }

        const { items, shipping, success_url, cancel_url, orderId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "No items provided" 
            });
        }

>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                    images: item.product.images ? [item.product.images[0]] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

<<<<<<< HEAD
        if (shipping > 0) {
=======
        if (shipping && shipping > 0) {
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
            lineItems.push({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: Math.round(shipping * 100),
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: success_url || "https://success.com",
            cancel_url: cancel_url || "https://cancel.com",
            payment_intent_data: {
                metadata: {
<<<<<<< HEAD
                    orderId: orderId,
=======
                    orderId: orderId || "",
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
                    appId: "forever-app",
                },
            },
        });

<<<<<<< HEAD
        res.json({ id: session.id, url: session.url });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
=======
        res.json({ success: true, id: session.id, url: session.url });
    } catch (error: any) {
        console.error("Checkout session error:", error);
        res.status(500).json({ success: false, error: error.message });
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
    }
};

// Handle Stripe Webhook
// POST /api/stripe
export const handleStripeWebhook = async (req: Request, res: Response) => {
<<<<<<< HEAD
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret as string);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const { orderId, appId } = (event.data.object as any).metadata;

    if (appId !== "forever-app") {
        return res.status(400).send("Invalid app id");
    }

    // Handle the event
    try {
=======
    try {
        if (!stripe) {
            return res.status(503).json({ 
                success: false, 
                message: "Payment service is not configured" 
            });
        }

        const sig = req.headers["stripe-signature"];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!sig || !endpointSecret || endpointSecret === '_______stripe_webhook_secret_______') {
            return res.status(400).send("Webhook not configured");
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret as string);
        } catch (err: any) {
            console.error(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        const { orderId, appId } = (event.data.object as any).metadata || {};

        if (appId !== "forever-app") {
            return res.status(400).send("Invalid app id");
        }

        // Handle the event
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
        switch (event.type) {
            case "payment_intent.succeeded":
                let order;

                if (orderId) {
                    order = await Order.findById(orderId);
                } else {
                    order = await Order.findOne({ paymentIntentId: event.data.object.id });
                }

                if (order) {
                    order.paymentStatus = "paid";
                    order.paymentMethod = "stripe";
                    if (!order.paymentIntentId) {
                        order.paymentIntentId = event.data.object.id;
                    }
                    await order.save();

                    // Clear User Cart
                    const cart = await Cart.findOne({ user: order.user });
                    if (cart) {
                        cart.items = [];
                        cart.totalAmount = 0;
                        await cart.save();
                    }
<<<<<<< HEAD
=======
                    console.log(`Order ${order._id} payment succeeded`);
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
                } else {
                    console.warn(`Order not found for PaymentIntent ${event.data.object.id}`);
                }
                break;

            case "payment_intent.canceled":
<<<<<<< HEAD
                await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed", orderStatus: "cancelled" });
                break;

            case "payment_intent.payment_failed":
                await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed", orderStatus: "cancelled" });
=======
                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed", orderStatus: "cancelled" });
                }
                break;

            case "payment_intent.payment_failed":
                if (orderId) {
                    await Order.findByIdAndUpdate(orderId, { paymentStatus: "failed", orderStatus: "cancelled" });
                }
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.send({ success: true });
    } catch (err: any) {
        console.error(`Webhook Processing Error: ${err.message}`);
        res.status(500).send(`Webhook Processing Error: ${err.message}`);
    }
<<<<<<< HEAD
};
=======
};
>>>>>>> 4e17078e8fbb711134b7cf77799c6269f6346d66
