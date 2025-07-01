#!/bin/bash
set -e

# Run from terraform/azure directory
echo "Running Azure source zip build from $(pwd)"

# List of Azure Functions
FUNCTIONS=("sentimentAnalyzer" "fetchSummary" "sendNotification")

# Define source and destination base paths
FUNCTIONS_BASE_DIR="../../functions"
ZIP_OUTPUT_DIR="./"

# Cleanup old zip files
echo "🧹 Removing old zip files..."
rm -f "$ZIP_OUTPUT_DIR"/*.zip

for func in "${FUNCTIONS[@]}"; do
  FUNC_SRC="$FUNCTIONS_BASE_DIR/$func"
  ZIP_NAME="$func.zip"

  echo "📦 Zipping $func from $FUNC_SRC..."
  
  # Ensure function source exists
  if [ ! -d "$FUNC_SRC" ]; then
    echo "❌ Directory $FUNC_SRC not found. Skipping..."
    continue
  fi

  # Change into the function directory and zip
  (
    cd "$FUNC_SRC"
    zip -r "$ZIP_NAME" . -x "node_modules/*" "dist/*" "tsconfig.aws.json" > /dev/null
  )

  # Move the zip to terraform/azure
  mv "$FUNC_SRC/$ZIP_NAME" "$ZIP_OUTPUT_DIR"

  echo "✅ Created $ZIP_OUTPUT_DIR/$ZIP_NAME"
done

# Show final zip files
echo "📂 Final zip files in $ZIP_OUTPUT_DIR:"
ls -lh "$ZIP_OUTPUT_DIR"/*.zip
