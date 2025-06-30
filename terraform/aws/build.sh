#!/bin/bash
set -e

BUCKET_NAME="mcloud-code-bucket"
FUNCTIONS=("sentimentAnalyzer" "fetchSummary" "sendNotification")

# Cleanup old zip files
echo "🧹 Removing old zip files in $(pwd)..."
rm -f ./*.zip

for func in "${FUNCTIONS[@]}"; do
  FUNC_DIR=../../functions/$func

  echo "📦 Building $func..."

  cd $FUNC_DIR

  # Ensure PLATFORM is set for build context
  export PLATFORM=aws

  # Remove Azure-specific packages if they exist
  echo "🧼 Pruning Azure dependencies (if any)..."
  npm uninstall @azure/cosmos || true

  # Install only production dependencies

  npm install --silent
  # Run build, allow failures to continue
  npm run build
  npm prune --omit=dev

  #npm run build || echo "$func build failed — continuing..."

  # Package the dist folder only
  cd dist
  ZIP_PATH=../../../terraform/aws/$func.zip
  echo "📁 Zipping dist/ to $ZIP_PATH..."
  zip -r $ZIP_PATH . -x "*.test.js"

  # Upload to S3
  echo "☁️ Uploading $func.zip to s3://$BUCKET_NAME/$func.zip..."
  aws s3 cp $ZIP_PATH s3://$BUCKET_NAME/$func.zip

  # Go back to the main directory
  cd - >/dev/null
done

echo "✅ All functions built and uploaded."

