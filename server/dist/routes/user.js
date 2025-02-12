"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbclient_1 = __importDefault(require("../config/dbclient"));
const express_1 = __importDefault(require("express"));
const user_1 = require("../middleware/user");
const userRoute = (0, express_1.default)();
userRoute.get("/", user_1.auth, async (req, res) => {
    try {
        const users = await dbclient_1.default.user.findMany({
            where: {
                id: {
                    not: req?.user?.id
                }
            }
        });
        // Send the retrieved users as a response
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
}); // toke  chnge krna to check this agar login dubaar krna h 
userRoute.get("/user", user_1.auth, async (req, res) => {
    try {
        const users = await dbclient_1.default.user.findUnique({
            where: {
                id: req?.user?.id
            }
        });
        // Send the retrieved users as a response
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error?.message });
    }
});
exports.default = userRoute;
