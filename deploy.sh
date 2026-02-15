#!/bin/bash
set -e

echo "🏗️  Building HMK-React..."
npm run build

echo "📤 Uploading to S3..."
# Upload assets with long cache (1 year)
aws s3 sync dist/ s3://hmk-troycosentino-com/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Upload index.html with no cache
aws s3 cp dist/index.html s3://hmk-troycosentino-com/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id E1AQG5SELCGZBP \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "✅ Deployment complete!"
echo "🆔 Invalidation ID: $INVALIDATION_ID"
echo ""
echo "🌐 Access URLs:"
echo "   CloudFront: https://d26i69ikk7ngyk.cloudfront.net/"
echo "   Custom:     https://hmk.troycosentino.com/ (after DNS setup)"
echo ""
echo "⏳ CloudFront invalidation typically takes 1-5 minutes"
echo "   Track status: aws cloudfront get-invalidation --distribution-id E1AQG5SELCGZBP --id $INVALIDATION_ID"
