"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = require("util");
require("dotenv/config");
const verifyToken = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
const auth = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // ✅ Correct token split
    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }
    try {
        const user = await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
        req.user = user; // ✅ Set user in request
        next(); // ✅ Call next() only if verification succeeds
    }
    catch (error) {
        res.status(403).json({ message: error?.message });
    }
};
exports.auth = auth;
