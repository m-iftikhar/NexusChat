import jwt from "jsonwebtoken";
import { promisify } from "util";

import "dotenv/config";
const verifyToken = promisify(jwt.verify);

export const auth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // ✅ Correct token split

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: unknown) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });

        req.user = user; // ✅ Set user in request
        next(); // ✅ Call next() only if verification succeeds

    } catch (error: any) {
        res.status(403).json({ message: error?.message });
    }
};
