"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbclient_1 = __importDefault(require("./config/dbclient"));
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
const startServer = async () => {
    try {
        await dbclient_1.default.$connect();
        console.log("prisma connected to database");
        const server = app.listen(PORT, () => {
            console.log(`server is ruuning on ${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Error connecting to Prisma:", error);
    }
};
startServer();
