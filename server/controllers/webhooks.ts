import { Request, Response } from "express";
import User from "../models/User.js";

export const clerkWebhook = async (req: Request, res: Response) => {
    try {
        const evt = req.body;
        console.log("Webhook received:", evt.type);

        if (evt.type === "user.created" || evt.type === "user.updated") {
            const userData = {
                clerkId: evt.data.id,
                email: evt.data.email_addresses?.[0]?.email_address,
                name: (evt.data.first_name || '') + ' ' + (evt.data.last_name || ''),
                image: evt.data.image_url,
                role: "user"
            };

            await User.findOneAndUpdate(
                { clerkId: evt.data.id },
                userData,
                { upsert: true, new: true }
            );
            
            console.log("User saved:", userData.clerkId);
        }

        return res.json({ success: true, message: "Webhook received" });
    } catch (err) {
        console.error("Error processing webhook:", err);
        return res.status(400).json({ success: false, message: "Error processing webhook" });
    }
};