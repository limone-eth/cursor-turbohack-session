import "server-only";

import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(path.join(process.cwd(), "package.json"));

// Load CJS + WASM glue from the published package so we do not bundle incomplete vendor/src.
export default require("sweph-wasm") as typeof import("sweph-wasm").default;
