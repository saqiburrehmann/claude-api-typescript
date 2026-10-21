import path from "node:path";
import dotenv from "dotenv";
import { PROJECT_ROOT } from "./paths.js";

// Always load .env from the project root, whatever folder the script is run from.
dotenv.config({ path: path.join(PROJECT_ROOT, ".env"), quiet: true });
