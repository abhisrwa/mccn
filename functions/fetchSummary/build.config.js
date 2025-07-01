// build.config.js
const { execSync } = require("child_process");

const platform = process.env.PLATFORM || "azure";
console.log(`🔧 Running TypeScript build for platform: ${platform}`);

const tsconfig = platform === "aws" ? "tsconfig.aws.json" : "tsconfig.azure.json";

const path = require("path");
const tscPath = path.resolve("node_modules", ".bin", "tsc");

execSync(`${tscPath} --project ${tsconfig}`, { stdio: "inherit" });

//execSync(`npx tsc --project ${tsconfig}`, { stdio: "inherit" });
