"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dbclient_1 = __importDefault(require("./config/dbclient"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const message_1 = __importDefault(require("./routes/message"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./sockets/socket");
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "1gb" }));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true, // Enables temporary file storage
    tempFileDir: "/tmp/", // Temp directory for uploaded files
    limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/api/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/message", message_1.default);
app.use("/api/files", express_1.default.static(path_1.default.join("dist/storage")));
app.get("/", (req, res) => {
    res.send("Welcome to the server");
});
const startServer = async () => {
    try {
        await dbclient_1.default.$connect();
        console.log("prisma connected to database");
        const server = app.listen(PORT, () => {
            console.log(`server is ruuning on ${PORT}`);
        });
        const socketIo = new socket_io_1.Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: ["http://localhost:3000"],
                methods: ["GET", "POST"]
            }
        });
        socketIo.on("connection", (socket) => {
            (0, socket_1.appMessages)(socket, socketIo);
        });
    }
    catch (error) {
        console.error("❌ failed to connect:", error);
        process.exit(1);
    }
};
startServer();
