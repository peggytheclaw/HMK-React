#!/bin/bash
set -e

echo "🗑️  Cleaning up old subdomain-based deployment resources..."
echo ""
echo "This script will remove:"
echo "  - CloudFront distribution E1AQG5SELCGZBP (d26i69ikk7ngyk.cloudfront.net)"
echo "  - S3 bucket: hmk-troycosentino-com"
echo "  - ACM certificate for hmk.troycosentino.com"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Check CloudFront distribution status
echo "📊 Checking CloudFront distribution status..."
CF_STATUS=$(aws cloudfront get-distribution --id E1AQG5SELCGZBP --query 'Distribution.Status' --output text 2>/dev/null || echo "NOT_FOUND")

if [ "$CF_STATUS" = "NOT_FOUND" ]; then
    echo "   ✅ CloudFront distribution already deleted"
elif [ "$CF_STATUS" = "Deployed" ]; then
    echo "   ⏳ Distribution is enabled. Disabling first..."
    ETAG=$(aws cloudfront get-distribution-config --id E1AQG5SELCGZBP | jq -r '.ETag')
    aws cloudfront get-distribution-config --id E1AQG5SELCGZBP | \
      jq '.DistributionConfig.Enabled = false | .DistributionConfig' | \
      aws cloudfront update-distribution --id E1AQG5SELCGZBP --if-match "$ETAG" --distribution-config /dev/stdin > /dev/null
    
    echo "   ⏳ Waiting for distribution to disable (this takes 5-15 minutes)..."
    aws cloudfront wait distribution-deployed --id E1AQG5SELCGZBP
    echo "   ✅ Distribution disabled"
    
    echo "   🗑️  Deleting CloudFront distribution..."
    ETAG=$(aws cloudfront get-distribution-config --id E1AQG5SELCGZBP | jq -r '.ETag')
    aws cloudfront delete-distribution --id E1AQG5SELCGZBP --if-match "$ETAG"
    echo "   ✅ CloudFront distribution deleted"
elif [ "$CF_STATUS" = "InProgress" ]; then
    echo "   ⏳ Distribution is being disabled. Waiting..."
    aws cloudfront wait distribution-deployed --id E1AQG5SELCGZBP
    
    echo "   🗑️  Deleting CloudFront distribution..."
    ETAG=$(aws cloudfront get-distribution-config --id E1AQG5SELCGZBP | jq -r '.ETag')
    aws cloudfront delete-distribution --id E1AQG5SELCGZBP --if-match "$ETAG"
    echo "   ✅ CloudFront distribution deleted"
fi

# Delete S3 bucket
echo ""
echo "🗑️  Deleting S3 bucket..."
BUCKET_EXISTS=$(aws s3 ls s3://hmk-troycosentino-com 2>/dev/null || echo "NOT_FOUND")
if [ "$BUCKET_EXISTS" = "NOT_FOUND" ]; then
    echo "   ✅ S3 bucket already deleted"
else
    aws s3 rm s3://hmk-troycosentino-com/ --recursive
    aws s3 rb s3://hmk-troycosentino-com
    echo "   ✅ S3 bucket deleted"
fi

# Delete ACM certificate
echo ""
echo "🗑️  Deleting ACM certificate..."
CERT_STATUS=$(aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 \
  --region us-east-1 \
  --query 'Certificate.Status' \
  --output text 2>/dev/null || echo "NOT_FOUND")

if [ "$CERT_STATUS" = "NOT_FOUND" ]; then
    echo "   ✅ Certificate already deleted"
else
    aws acm delete-certificate \
      --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 \
      --region us-east-1
    echo "   ✅ Certificate deleted"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Removed resources:"
echo "  - CloudFront distribution E1AQG5SELCGZBP"
echo "  - S3 bucket hmk-troycosentino-com"
echo "  - ACM certificate for hmk.troycosentino.com"
echo ""
echo "Active deployment:"
echo "  🌐 https://troycosentino.com/portfolio/retailshoeapp/"
