#!/bin/bash
set -e

FUNCTIONS=("sentimentAnalyzer" "fetchSummary" "sendNotification")

# Start from terraform/azure
echo "Running build.sh from $(pwd)"

# Cleanup old zip files
echo "Removing old zip files in $(pwd)..."
rm -f ./*.zip

for func in "${FUNCTIONS[@]}"; do
  FUNC_PATH="../../functions/$func"
  ZIP_OUTPUT_PATH="./$func.zip"

  echo "Building $func from $FUNC_PATH"

  # Navigate to function directory or fail with message
  cd "$FUNC_PATH" || { echo "❌ Directory $FUNC_PATH not found"; exit 1; }

  # Install and build
  echo "Installing dependencies..."
  npm install --silent
  echo "Building TypeScript..."
  npm run build

  # Create zip file
  echo "Zipping $func into $ZIP_OUTPUT_PATH..."
  zip -r "$ZIP_OUTPUT_PATH" dist node_modules host.json package.json .funcignore >/dev/null

  echo "✅ Done building $func"

  # Return to terraform/azure directory
  cd - >/dev/null

  # Move zip to terraform/azure
  mv "$FUNC_PATH/$(basename $ZIP_OUTPUT_PATH)" .
done

# Show contents
echo "📦 Final zip files in terraform/azure:"
ls -lh *.zip
