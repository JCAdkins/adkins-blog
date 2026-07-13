// env.ts — must be the very first import in server.ts
// Loads the correct .env file based on NODE_ENV before anything else runs.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../");

const env = process.env.NODE_ENV ?? "development";

// Load environment-specific file first (higher priority), then fall back to .env
dotenv.config({ path: path.join(root, `.env.${env}`), override: false });
dotenv.config({ path: path.join(root, ".env"), override: false });
