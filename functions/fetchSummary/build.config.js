// build.config.js
const path = require("path");
const { execSync } = require("child_process");

const platform = process.env.PLATFORM || "azure";
console.log(`🔧 Running TypeScript build for platform: ${platform}`);

const tsconfig = platform === "aws" ? "tsconfig.aws.json" : "tsconfig.azure.json";

// Use Windows-specific .cmd path
const tscPath = path.resolve("node_modules", ".bin", "tsc.cmd");

try {
  console.log(`🛠️ Running ${tscPath} --project ${tsconfig}`);
  execSync(`"${tscPath}" --project ${tsconfig}`, { stdio: "inherit" });
  console.log("✅ TypeScript build successful");
} catch (e) {
  console.error("❌ TypeScript build failed:", e);
  process.exit(1);
}

//execSync(`npx tsc --project ${tsconfig}`, { stdio: "inherit" });
