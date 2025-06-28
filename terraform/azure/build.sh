#!/bin/bash
set -e

FUNCTIONS=("sentimentAnalyzer" "fetchSummary" "sendNotification")

for func in "${FUNCTIONS[@]}"; do
  cd ../../functions/$func ##
  npm install #--production 
  npm run build
  echo "Zipping $func..."
  zip -r ../$func.zip dist node_modules host.json package.json .funcignore
  echo "Done building $func"
  cd - >/dev/null 
done ## End
