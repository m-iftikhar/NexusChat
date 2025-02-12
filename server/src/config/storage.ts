import fs from "fs";
import path from "path";

export const getStoragePath = (file: any): string => {
    const storagePath = path.join(__dirname, "../", "storage", file?.name);
    const directory = path.dirname(storagePath);

    // ✅ Corrected condition: Create directory if it does NOT exist
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    return storagePath; // ✅ Correct variable name
};
