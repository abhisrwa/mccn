// build.config.js
const { execSync } = require("child_process");

const platform = process.env.PLATFORM || "azure";
console.log(`🔧 Running TypeScript build for platform: ${platform}`);

const tsconfig = platform === "aws" ? "tsconfig.aws.json" : "tsconfig.azure.json";

execSync(`npx tsc --project ${tsconfig}`, { stdio: "inherit" });
