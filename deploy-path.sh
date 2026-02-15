#!/bin/bash
set -e

echo "🏗️  Building Retail Shoe Management System..."
npm run build

echo "📤 Uploading to S3 (path-based deployment)..."
# Upload assets with long cache (1 year)
aws s3 sync dist/ s3://troycosentino-website-1770695889/portfolio/retailshoeapp/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Upload index.html with no cache
aws s3 cp dist/index.html \
  s3://troycosentino-website-1770695889/portfolio/retailshoeapp/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id E2S92XY4CW2GOH \
  --paths "/portfolio/retailshoeapp/*" \
  --query 'Invalidation.Id' \
  --output text)

echo "✅ Deployment complete!"
echo "🆔 Invalidation ID: $INVALIDATION_ID"
echo ""
echo "🌐 Live URL:"
echo "   https://troycosentino.com/portfolio/retailshoeapp/"
echo ""
echo "⏳ CloudFront invalidation typically takes 1-5 minutes"
echo "   Track status: aws cloudfront get-invalidation --distribution-id E2S92XY4CW2GOH --id $INVALIDATION_ID"
