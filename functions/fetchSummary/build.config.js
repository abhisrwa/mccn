// build.config.js
const { execSync } = require("child_process");

const platform = process.env.PLATFORM || "azure";
console.log(`🔧 Running platform-specific build using npm scripts: ${platform}`);

if (platform === "aws") {
  console.log("⏭️ Skipping Azure build script for AWS (handled by build.sh)");
  process.exit(0);
}

// For Azure: run the regular build-ts script
try {
  console.log("🛠️ Running: npm run build-ts");
  execSync("npm run build-ts", { stdio: "inherit" });
} catch (err) {
  console.error("❌ TypeScript build failed:", err.message);
  process.exit(1);
}
//execSync(`npx tsc --project ${tsconfig}`, { stdio: "inherit" });
