#!/bin/bash

echo "🔍 HMK-React Deployment Validation"
echo "===================================="
echo ""

# Check S3 bucket
echo "📦 S3 Bucket Status:"
aws s3 ls s3://hmk-troycosentino-com/ --recursive --human-readable --summarize | tail -n 2
echo ""

# Check CloudFront distribution
echo "🌐 CloudFront Distribution:"
CF_STATUS=$(aws cloudfront get-distribution --id E1AQG5SELCGZBP --query 'Distribution.Status' --output text)
CF_DOMAIN=$(aws cloudfront get-distribution --id E1AQG5SELCGZBP --query 'Distribution.DomainName' --output text)
echo "   Status: $CF_STATUS"
echo "   Domain: $CF_DOMAIN"
echo ""

# Check SSL certificate
echo "🔒 SSL Certificate:"
CERT_STATUS=$(aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 \
  --region us-east-1 \
  --query 'Certificate.Status' \
  --output text)
echo "   Status: $CERT_STATUS"

if [ "$CERT_STATUS" = "PENDING_VALIDATION" ]; then
  echo ""
  echo "   ⚠️  Certificate needs DNS validation!"
  echo "   Add this CNAME record to your DNS:"
  echo ""
  aws acm describe-certificate \
    --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 \
    --region us-east-1 \
    --query 'Certificate.DomainValidationOptions[0].ResourceRecord' \
    --output table
elif [ "$CERT_STATUS" = "ISSUED" ]; then
  echo "   ✅ Certificate is validated and ready!"
fi
echo ""

# Test CloudFront URL
echo "🧪 Testing CloudFront URL:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://d26i69ikk7ngyk.cloudfront.net/ 2>&1 || echo "FAILED")
if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ HTTPS working ($HTTP_CODE)"
else
  echo "   ⏳ Not ready yet (HTTP $HTTP_CODE) - distribution may still be deploying"
fi
echo ""

# Test custom domain (if DNS is set up)
echo "🌍 Testing Custom Domain:"
DNS_CHECK=$(dig +short hmk.troycosentino.com 2>&1 || echo "")
if [ -z "$DNS_CHECK" ]; then
  echo "   ⏳ DNS not configured yet"
  echo "   Add CNAME: hmk.troycosentino.com -> d26i69ikk7ngyk.cloudfront.net"
else
  echo "   DNS: $DNS_CHECK"
  CUSTOM_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://hmk.troycosentino.com/ 2>&1 || echo "FAILED")
  if [ "$CUSTOM_CODE" = "200" ]; then
    echo "   ✅ Custom domain working ($CUSTOM_CODE)"
  else
    echo "   ⚠️  DNS configured but HTTPS not working ($CUSTOM_CODE)"
  fi
fi
echo ""

# Summary
echo "📊 Summary:"
if [ "$CF_STATUS" = "Deployed" ] && [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ CloudFront deployment: READY"
else
  echo "   ⏳ CloudFront deployment: IN PROGRESS"
fi

if [ "$CERT_STATUS" = "ISSUED" ]; then
  echo "   ✅ SSL certificate: VALIDATED"
else
  echo "   ⏳ SSL certificate: PENDING (add DNS record)"
fi

if [ -n "$DNS_CHECK" ] && [ "$CUSTOM_CODE" = "200" ]; then
  echo "   ✅ Custom domain: WORKING"
else
  echo "   ⏳ Custom domain: NOT CONFIGURED"
fi
echo ""
echo "🔗 Quick Links:"
echo "   CloudFront: https://d26i69ikk7ngyk.cloudfront.net/"
echo "   Custom:     https://hmk.troycosentino.com/ (when ready)"
echo ""
