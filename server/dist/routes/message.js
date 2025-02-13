"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbclient_1 = __importDefault(require("../config/dbclient"));
const express_1 = __importDefault(require("express"));
const user_1 = require("../middleware/user");
const messageRoute = (0, express_1.default)();
// create message
messageRoute.post("/create", user_1.auth, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "unauthorized" });
        }
        if (!receiverId || !content) {
            return res.status(401).json({ error: "receiver id and conetnt are required" });
        }
        const message = await dbclient_1.default.message.create({
            data: {
                content: content,
                senderId: userId,
                receiverId: receiverId
            }
        });
        res.status(200).json(message);
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
});
// get message
messageRoute.get("/", user_1.auth, async (req, res) => {
    try {
        const { senderId } = req.query;
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const message = await dbclient_1.default.message.findMany({
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
        res.json(message);
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
});
exports.default = messageRoute;
