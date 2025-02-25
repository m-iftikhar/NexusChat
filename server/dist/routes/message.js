"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbclient_1 = __importDefault(require("../config/dbclient"));
const express_1 = __importDefault(require("express"));
const user_1 = require("../middleware/user");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const messageRoute = (0, express_1.default)();
// create message
// Create message with optional image
messageRoute.post("/create", user_1.auth, async (req, res) => {
    try {
        const { receiverId, content, image } = req.body;
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!receiverId || !content) {
            return res.status(400).json({ error: "Receiver ID and content are required" });
        }
        let imageUrl = null;
        // Upload image to Cloudinary if provided
        if (image) {
            const uploadedImage = await cloudinary_1.default.uploader.upload(image, {
                folder: "messages",
                resource_type: "auto", // Handles all file types
            });
            imageUrl = uploadedImage.secure_url;
        }
        // Save message in DB
        const message = await dbclient_1.default.message.create({
            data: {
                content,
                senderId: Number(userId),
                receiverId: Number(receiverId),
                image: imageUrl,
            },
        });
        res.status(200).json(message);
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});
// get message
messageRoute.get("/", user_1.auth, async (req, res) => {
    try {
        console.log("Query Params:", req.query);
        const { senderId } = req.query;
        const userId = req?.user?.id;
        console.log("Sender ID:", senderId, "User ID:", userId);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const messages = await dbclient_1.default.message.findMany({
            where: {
                OR: [
                    { senderId: Number(userId), receiverId: Number(senderId) },
                    { senderId: Number(senderId), receiverId: Number(userId) }
                ]
            },
            include: {
                sender: true, // Relation "SentMessages"
                receiver: true // Relation "ReceivedMessages"
            }
        });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
});
exports.default = messageRoute;
