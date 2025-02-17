"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbclient_1 = __importDefault(require("../config/dbclient"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const storage_1 = require("../config/storage");
require("dotenv/config");
const user_1 = require("../middleware/user");
const authRoute = (0, express_1.Router)();
const imagePath = process.env.IMAGES_PATH;
authRoute.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req?.body, req.files, "data");
        const existingUser = await dbclient_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        let file;
        if (req?.files?.profileImage) {
            file = req.files.profileImage;
            let storagePath = (0, storage_1.getStoragePath)(file);
            console.log(storagePath, "storagepath");
            await file.mv(storagePath);
        }
        const hashPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await dbclient_1.default.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                profileImage: file ? imagePath + file.name : undefined, // Changed `null` to `undefined`
            },
        });
        return res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        res.status(400).json({ message: error?.message });
    }
});
authRoute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await dbclient_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(404).json({ message: "email or password is wrong" });
        }
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(404).json({ message: "invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
});
authRoute.get("/users", user_1.auth, async (req, res) => {
    try {
        const users = await dbclient_1.default.user.findMany({
            where: {
                id: {
                    not: req?.user?.id
                }
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
});
exports.default = authRoute;
