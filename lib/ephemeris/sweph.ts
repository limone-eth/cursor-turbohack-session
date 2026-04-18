import "server-only";

import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));

// Resolve the installed tarball explicitly. A `vendor/sweph-wasm` folder with the same
// package name made Turbopack resolve `sweph-wasm` to broken `src/` instead of `node_modules`.
const swephMain = path.join(process.cwd(), "node_modules", "sweph-wasm", "dist", "index.cjs");

export default require(swephMain) as typeof import("sweph-wasm").default;
