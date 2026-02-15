# HMK-React AWS Deployment Guide

## 🚀 Deployment Summary

**Status:** ✅ Successfully Deployed  
**Deployment Date:** February 15, 2026  
**Deployed By:** Peggy (OpenClaw AI Assistant)

## 📋 AWS Resources Created

### S3 Bucket
- **Bucket Name:** `hmk-troycosentino-com`
- **Region:** us-west-2
- **Purpose:** Static website hosting
- **Website Endpoint:** http://hmk-troycosentino-com.s3-website-us-west-2.amazonaws.com
- **Public Access:** Enabled (read-only)

### CloudFront Distribution
- **Distribution ID:** E1AQG5SELCGZBP
- **CloudFront Domain:** d26i69ikk7ngyk.cloudfront.net
- **Status:** Active
- **HTTPS:** Enabled (CloudFront default certificate)
- **HTTP Version:** HTTP/2
- **Compression:** Enabled
- **Price Class:** All Edge Locations

### SSL Certificate (ACM)
- **Certificate ARN:** arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4
- **Domain:** hmk.troycosentino.com
- **Status:** ⏳ Pending Validation
- **Region:** us-east-1 (required for CloudFront)
- **Validation Method:** DNS

## 🌐 Access URLs

### Current (Temporary)
- **CloudFront URL:** https://d26i69ikk7ngyk.cloudfront.net/

### Future (After DNS Setup)
- **Custom Domain:** https://hmk.troycosentino.com/

## 🔧 DNS Configuration Required

**⚠️ MANUAL ACTION NEEDED**

Since Route53 is not managing troycosentino.com, you need to add these DNS records in your domain registrar (Namecheap, GoDaddy, etc.):

### 1. Certificate Validation Record
**Required to validate SSL certificate:**

```
Type: CNAME
Name: _e115d5ad72af83a1f40af62025b87685.hmk.troycosentino.com
Value: _2a96e365e9e0858b4a138c7679e07d94.jkddzztszm.acm-validations.aws.
TTL: 300 (or auto)
```

### 2. Subdomain CNAME (Add after certificate validates)
**Points hmk.troycosentino.com to CloudFront:**

```
Type: CNAME
Name: hmk
Value: d26i69ikk7ngyk.cloudfront.net
TTL: 300 (or 3600 for longer caching)
```

### DNS Setup Steps:

1. **Add Validation Record First**
   - Log into your domain registrar's DNS management
   - Add the CNAME record for certificate validation (above)
   - Wait 5-30 minutes for propagation

2. **Verify Certificate**
   - Run: `aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 --region us-east-1 --query 'Certificate.Status'`
   - Status should show "ISSUED"

3. **Update CloudFront Distribution**
   - Once cert is validated, run the update script (see below)

4. **Add Subdomain CNAME**
   - Add the CNAME record pointing hmk to CloudFront
   - Wait 5-15 minutes for DNS propagation

5. **Test**
   - Visit https://hmk.troycosentino.com/
   - Verify no SSL warnings
   - Test all pages and routing

## 🔄 Update CloudFront with Custom Domain

**Run after SSL certificate is validated:**

```bash
# Get current distribution config
aws cloudfront get-distribution-config --id E1AQG5SELCGZBP > cf-config.json

# Extract the config and ETag
cat cf-config.json | jq '.DistributionConfig' > cf-dist-config.json
ETAG=$(cat cf-config.json | jq -r '.ETag')

# Update the config to add alias and certificate
jq '.Aliases.Quantity = 1 | .Aliases.Items = ["hmk.troycosentino.com"] | .ViewerCertificate = {
  "ACMCertificateArn": "arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4",
  "SSLSupportMethod": "sni-only",
  "MinimumProtocolVersion": "TLSv1.2_2021",
  "Certificate": "arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4",
  "CertificateSource": "acm"
}' cf-dist-config.json > cf-dist-config-updated.json

# Apply the update
aws cloudfront update-distribution \
  --id E1AQG5SELCGZBP \
  --if-match "$ETAG" \
  --distribution-config file://cf-dist-config-updated.json
```

## 📦 Deploying Updates

### Quick Deploy (Production)

```bash
cd /Users/penny/.openclaw/workspace/HMK-React

# 1. Build
npm run build

# 2. Upload to S3 with proper cache headers
# Upload assets with long cache (1 year)
aws s3 sync dist/ s3://hmk-troycosentino-com/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Upload index.html with no cache
aws s3 cp dist/index.html s3://hmk-troycosentino-com/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1AQG5SELCGZBP \
  --paths "/*"
```

### Deploy Script

Create `deploy.sh` for easy updates:

```bash
#!/bin/bash
set -e

echo "🏗️  Building..."
npm run build

echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://hmk-troycosentino-com/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://hmk-troycosentino-com/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id E1AQG5SELCGZBP \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text

echo "✅ Deployment complete!"
echo "🌐 CloudFront: https://d26i69ikk7ngyk.cloudfront.net/"
echo "🌐 Custom: https://hmk.troycosentino.com/ (after DNS setup)"
```

Make executable:
```bash
chmod +x deploy.sh
```

## 💰 Cost Estimate

### Monthly Costs (Low Traffic ~1,000 visitors/month)

- **S3 Storage:** ~$0.02/month (297 KB)
- **S3 Requests:** ~$0.01/month
- **CloudFront (first 12 months):** FREE (AWS Free Tier)
  - 1 TB data transfer out
  - 10 million HTTP/HTTPS requests
- **CloudFront (after 12 months):** ~$1-2/month
  - $0.085 per GB (first 10 TB)
  - $0.0075 per 10,000 HTTPS requests
- **ACM Certificate:** FREE

**Total: < $0.05/month (first 12 months), ~$2-3/month after**

### Cost Optimization
- Cache headers set for optimal CloudFront caching
- Compression enabled
- Assets have long cache times (1 year)
- index.html has no cache (always fresh)

## ✅ Validation Checklist

- [x] Build completes successfully
- [x] Files uploaded to S3
- [x] S3 bucket configured for static hosting
- [x] Public read access enabled
- [x] CloudFront distribution created
- [x] CloudFront default HTTPS works
- [x] SPA routing configured (404/403 → index.html)
- [x] Compression enabled
- [x] Proper cache headers set
- [ ] SSL certificate validated (pending DNS)
- [ ] Custom domain configured (pending certificate)
- [ ] HTTPS works on custom domain (pending DNS)
- [ ] All pages load correctly (pending DNS)
- [ ] Assets load (CSS, JS) (pending DNS)
- [ ] Routing works (refresh doesn't 404) (pending DNS)
- [ ] Dark mode toggle works (pending DNS)
- [ ] Login flow works (pending DNS)
- [ ] Mobile responsive (pending DNS)

## 🧪 Testing

### Test CloudFront URL (Available Now)
```bash
# Test main page
curl -I https://d26i69ikk7ngyk.cloudfront.net/

# Test SPA routing (should return 200, not 404)
curl -I https://d26i69ikk7ngyk.cloudfront.net/products

# Test in browser
open https://d26i69ikk7ngyk.cloudfront.net/
```

### Test Custom Domain (After DNS Setup)
```bash
# Verify DNS propagation
dig hmk.troycosentino.com
nslookup hmk.troycosentino.com

# Test HTTPS
curl -I https://hmk.troycosentino.com/

# Open in browser
open https://hmk.troycosentino.com/
```

## 🔍 Troubleshooting

### CloudFront Returns 403
- Check S3 bucket policy allows public read
- Verify files uploaded correctly: `aws s3 ls s3://hmk-troycosentino-com/`

### SSL Certificate Won't Validate
- Verify DNS CNAME record is added correctly
- Check status: `aws acm describe-certificate --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 --region us-east-1`
- DNS can take up to 30 minutes to propagate

### Custom Domain Not Working
- Ensure certificate is validated first
- Verify CloudFront distribution updated with alias
- Check DNS CNAME points to CloudFront domain
- Wait 5-15 minutes for DNS propagation

### SPA Routes Return 404
- Verify CloudFront custom error pages configured
- Both 403 and 404 should redirect to /index.html with 200 response
- Check CloudFront distribution config

### Changes Not Appearing
- Files cached in CloudFront (up to 24 hours)
- Create cache invalidation: `aws cloudfront create-invalidation --distribution-id E1AQG5SELCGZBP --paths "/*"`
- Check browser cache (Cmd+Shift+R for hard refresh)

## 🗑️ Teardown Instructions

**If you need to delete everything:**

```bash
# 1. Disable CloudFront distribution
aws cloudfront get-distribution-config --id E1AQG5SELCGZBP > cf-config.json
ETAG=$(cat cf-config.json | jq -r '.ETag')
jq '.DistributionConfig.Enabled = false' cf-config.json > cf-config-disabled.json
aws cloudfront update-distribution \
  --id E1AQG5SELCGZBP \
  --if-match "$ETAG" \
  --distribution-config file://cf-config-disabled.json

# 2. Wait for distribution to disable (5-15 minutes)
aws cloudfront wait distribution-deployed --id E1AQG5SELCGZBP

# 3. Delete CloudFront distribution
ETAG=$(aws cloudfront get-distribution-config --id E1AQG5SELCGZBP | jq -r '.ETag')
aws cloudfront delete-distribution --id E1AQG5SELCGZBP --if-match "$ETAG"

# 4. Delete S3 bucket
aws s3 rm s3://hmk-troycosentino-com/ --recursive
aws s3 rb s3://hmk-troycosentino-com

# 5. Delete ACM certificate
aws acm delete-certificate \
  --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 \
  --region us-east-1

# 6. Remove DNS records from domain registrar
```

## 📊 Monitoring

### CloudFront Metrics
```bash
# View CloudFront metrics (requests, errors, bytes)
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=E1AQG5SELCGZBP \
  --start-time $(date -u -v-1d +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 3600 \
  --statistics Sum
```

### S3 Bucket Size
```bash
aws s3 ls s3://hmk-troycosentino-com/ --recursive --human-readable --summarize
```

### Cost Monitoring
- View in AWS Cost Explorer
- Set up budget alerts (recommended: $5/month)

## 📝 Architecture

```
User Browser
     ↓
     ↓ HTTPS (TLS 1.2+)
     ↓
CloudFront CDN (Global Edge Locations)
E1AQG5SELCGZBP
d26i69ikk7ngyk.cloudfront.net
     ↓
     ↓ HTTP (origin fetch)
     ↓
S3 Static Website
hmk-troycosentino-com.s3-website-us-west-2.amazonaws.com
     ↓
     └─ index.html (no cache)
     └─ /assets/*.css (1 year cache)
     └─ /assets/*.js (1 year cache)
```

### Cache Strategy
- **index.html:** `max-age=0` - Always fresh, enables instant updates
- **Assets (CSS/JS):** `max-age=31536000` - 1 year cache, content-addressed (hash in filename)
- **CloudFront:** Caches for 24 hours by default, can be invalidated manually

### SPA Routing
- All 404/403 errors redirect to `/index.html` with 200 status
- React Router handles client-side routing
- Direct links to any route work correctly

## 🎯 Next Steps

1. **Immediate:**
   - [x] Test CloudFront URL
   - [ ] Add DNS validation record for certificate
   - [ ] Wait for certificate validation

2. **After Certificate Validates:**
   - [ ] Update CloudFront distribution with custom domain
   - [ ] Add CNAME record for hmk.troycosentino.com
   - [ ] Test custom domain

3. **Optional Enhancements:**
   - [ ] Add link from troycosentino.com to HMK demo
   - [ ] Set up GitHub Actions for automatic deployments
   - [ ] Add CloudWatch alarms for errors
   - [ ] Configure WAF for security
   - [ ] Add performance monitoring

## 📚 Resources

- **S3 Bucket:** https://s3.console.aws.amazon.com/s3/buckets/hmk-troycosentino-com
- **CloudFront Distribution:** https://console.aws.amazon.com/cloudfront/v3/home#/distributions/E1AQG5SELCGZBP
- **ACM Certificate:** https://console.aws.amazon.com/acm/home?region=us-east-1#/certificates/9214db68-a5e2-4a75-8197-f2c6c64f5ad4
- **AWS Region:** us-west-2
- **CloudFront Region:** Global (certificate in us-east-1)

---

**Deployed with ❤️ by Peggy**  
*OpenClaw AI Assistant - Making deployment easy*
