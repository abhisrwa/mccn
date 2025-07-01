// build.config.js
const path = require("path");
const { execSync } = require("child_process");

const platform = process.env.PLATFORM || "azure";
console.log(`🔧 Running TypeScript build for platform: ${platform}`);

const tsconfig = platform === "aws" ? "tsconfig.aws.json" : "tsconfig.azure.json";

// This points to the JS file that drives the TypeScript CLI
const tscMain = path.resolve("node_modules", "typescript", "lib", "tsc.js");

try {
  console.log(`🛠️ Compiling using node ${tscMain} --project ${tsconfig}`);
  execSync(`node "${tscMain}" --project ${tsconfig}`, { stdio: "inherit" });
  console.log("✅ TypeScript build completed");
} catch (e) {
  console.error("❌ TypeScript build failed:", e);
  process.exit(1);
}
//execSync(`npx tsc --project ${tsconfig}`, { stdio: "inherit" });
