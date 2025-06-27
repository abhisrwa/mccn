#!/bin/bash
set -e

BUCKET_NAME="mcloud-code-bucket"
FUNCTIONS=("sentimentAnalyzer" "fetchSummary" "sendNotification")

for func in "${FUNCTIONS[@]}"; do
  cd ../../functions/$func ##
  npm install #--production 
  npm run build
  cd dist
  echo "Zipping $func..." 
  
  zip -r ../../terraform/aws/$func.zip . -x "*.test.js"
  aws s3 cp ../../terraform/aws/$func.zip s3://$BUCKET_NAME/$func.zip
  echo "Done building $func"
  cd - >/dev/null 
done ## End
