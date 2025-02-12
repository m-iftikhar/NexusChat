"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoragePath = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getStoragePath = (file) => {
    const storagePath = path_1.default.join(__dirname, "../", "storage", file?.name);
    const directory = path_1.default.dirname(storagePath);
    // ✅ Corrected condition: Create directory if it does NOT exist
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory, { recursive: true });
    }
    return storagePath; // ✅ Correct variable name
};
exports.getStoragePath = getStoragePath;
