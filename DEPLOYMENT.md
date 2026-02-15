# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub** (if not already done)
```bash
cd HMK-React
git init
git add .
git commit -m "Initial commit - HMK React retail management system"
git remote add origin https://github.com/tcosentino/HMK-React.git
git push -u origin main
```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select GitHub repository
   - Vercel auto-detects Vite
   - Click "Deploy"
   - Done! Live in ~2 minutes

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## Deploy to AWS (S3 + CloudFront)

### Prerequisites
- AWS account
- AWS CLI configured
- S3 bucket created
- CloudFront distribution

### Steps

1. **Build the project**
```bash
npm run build
```

2. **Upload to S3**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. **Invalidate CloudFront cache** (if using CloudFront)
```bash
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### S3 Bucket Configuration

Bucket policy for public access:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

Static website hosting settings:
- Index document: `index.html`
- Error document: `index.html` (for SPA routing)

## Deploy to Netlify

1. **Push to GitHub**

2. **Deploy via Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy"

Or use Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Environment Variables

No environment variables required for the demo version (uses mock data).

For production with real API:
```env
VITE_API_URL=https://api.yourbackend.com
VITE_IMAGE_SERVER=https://images.yourcdn.com
```

Add to Vercel/Netlify dashboard or create `.env.production`:
```bash
VITE_API_URL=your_api_url
VITE_IMAGE_SERVER=your_image_server
```

## Custom Domain

### Vercel
1. Go to project settings → Domains
2. Add custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

### AWS CloudFront
1. Request SSL certificate in ACM
2. Add domain to CloudFront distribution
3. Update Route 53 (or your DNS) to point to CloudFront

### Integration with troycosentino.com

Option 1: Subdomain
```
retail.troycosentino.com → Vercel/CloudFront
```

Option 2: Path routing
```
troycosentino.com/retail → Vercel/CloudFront
```

## Performance Optimization

Already included in the build:
- ✅ Minification (Vite built-in)
- ✅ Tree-shaking
- ✅ Code splitting (routes)
- ✅ Asset optimization

Additional optimizations:
- Enable gzip/brotli compression on server
- Use CDN for images (or already using Unsplash)
- Enable HTTP/2 (Vercel/Netlify do this automatically)

## Monitoring

### Vercel Analytics
- Enable in project settings
- Track Core Web Vitals
- Monitor performance automatically

### Google Analytics
Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Rollback

### Vercel
- Go to Deployments
- Click on previous successful deployment
- Click "Promote to Production"

### AWS
- Keep previous build in versioned S3 bucket
- Upload previous version if needed

## CI/CD

The project is ready for automated deployment:

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

## Checklist

Before deploying to production:

- [ ] Update README with live demo URL
- [ ] Test all pages and features
- [ ] Check mobile responsiveness
- [ ] Test dark mode
- [ ] Verify all links work
- [ ] Test on different browsers
- [ ] Check console for errors
- [ ] Run Lighthouse audit (aim for 90+)
- [ ] Update any placeholder content
- [ ] Add analytics tracking
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure custom domain (optional)
- [ ] Add to portfolio site

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- AWS: [docs.aws.amazon.com](https://docs.aws.amazon.com)

---

**Recommended:** Vercel for simplicity and zero-config deployment.
**Alternative:** AWS if you need full control and already have infrastructure.
