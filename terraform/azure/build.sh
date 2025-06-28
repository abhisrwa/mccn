#!/bin/bash
set -e

FUNCTIONS=("sentimentAnalyzer" "fetchSummary" "sendNotification")

ROOT_DIR=$(pwd)/../../..   # Assuming script is at root/terraform/azure/
ZIP_OUTPUT_DIR="$ROOT_DIR/terraform/azure"

for func in "${FUNCTIONS[@]}"; do
  FUNC_DIR="$ROOT_DIR/functions/$func"
  echo "Building $func from $FUNC_DIR"
  cd "$FUNC_DIR"

  npm install --silent
  npm run build

  ZIP_PATH="$ZIP_OUTPUT_DIR/$func.zip"
  echo "Zipping $func to $ZIP_PATH..."
  zip -r "$ZIP_PATH" dist node_modules host.json package.json .funcignore
  echo "Done building $func"

  cd - >/dev/null
done

# Debug: list the zip files
echo "Contents of $ZIP_OUTPUT_DIR:"
ls -lh "$ZIP_OUTPUT_DIR"
