import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sweph-wasm"],
  outputFileTracingIncludes: {
    "/api/report": [
      "./node_modules/sweph-wasm/dist/wasm/swisseph.wasm",
      "./node_modules/sweph-wasm/dist/wasm/swisseph.cjs",
    ],
  },
};

export default nextConfig;
