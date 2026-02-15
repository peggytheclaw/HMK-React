# Retail Shoe Management System - Path-Based Deployment

**Deployment Date:** February 15, 2026  
**Deployed By:** Peggy (OpenClaw AI Assistant)  
**Status:** ✅ **Successfully Deployed**

---

## 🎯 Deployment Summary

The Retail Shoe Management System is deployed as a **path-based application** on troycosentino.com, accessible at:

**Live URL:** https://troycosentino.com/portfolio/retailshoeapp/

This is a **portfolio demo piece** - generic branding, not tied to any real company.

---

## 📋 Infrastructure

### S3 Bucket
- **Bucket:** troycosentino-website-1770695889
- **Path:** /portfolio/retailshoeapp/
- **Files:** 3 (index.html + 2 assets)
- **Size:** ~297 KB

### CloudFront Distribution
- **Distribution ID:** E2S92XY4CW2GOH (Troy's main site)
- **Domain:** troycosentino.com
- **Path:** /portfolio/retailshoeapp/*
- **Cache:** Optimized (1 year for assets, no-cache for HTML)

### Configuration
- **Base Path:** /portfolio/retailshoeapp/ (set in vite.config.ts)
- **Routing:** Client-side SPA routing via React Router
- **Cache Strategy:**
  - index.html: `max-age=0, must-revalidate`
  - Assets: `max-age=31536000, immutable`

---

## 🔧 Build Configuration

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/retailshoeapp/',  // ← Path-based deployment
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

This `base` setting ensures all assets are loaded from the correct path.

---

## 🚀 Deployment Process

### Quick Deploy
```bash
cd /Users/penny/.openclaw/workspace/HMK-React
./deploy-path.sh
```

### Manual Deploy
```bash
# 1. Build with base path
npm run build

# 2. Upload assets with long cache (1 year)
aws s3 sync dist/ s3://troycosentino-website-1770695889/portfolio/retailshoeapp/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# 3. Upload index.html with no cache
aws s3 cp dist/index.html \
  s3://troycosentino-website-1770695889/portfolio/retailshoeapp/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

# 4. Invalidate CloudFront cache for this path
aws cloudfront create-invalidation \
  --distribution-id E2S92XY4CW2GOH \
  --paths "/portfolio/retailshoeapp/*"
```

---

## ✅ Validation Checklist

- [x] Build completes successfully
- [x] Files uploaded to S3 under correct path
- [x] HTTPS works (troycosentino.com SSL)
- [x] Page loads correctly
- [x] Assets load (CSS, JS)
- [x] Login page displays
- [x] Branding is generic (no HMK references)
- [x] SPA routing works
- [x] No console errors
- [x] Mobile responsive
- [x] Dark mode toggle works
- [x] CloudFront cache invalidated

---

## 🧪 Testing

### Test Login Page
```bash
open https://troycosentino.com/portfolio/retailshoeapp/
```

### Test Demo Credentials
- **Username:** admin, sjohnson, mchen, etc.
- **Password:** demo

### Test SPA Routing
Navigate to different pages within the app - all routes should work correctly even on direct access.

### Test Assets
All CSS and JS should load from `/portfolio/retailshoeapp/assets/`

---

## 🎨 Branding Changes

**Removed:** "HMK" company branding  
**Updated to:** "Retail Shoe Management" (generic)

### Changed Files:
- `index.html` - Title updated to "Retail Shoe Management System"
- Login page - Already used "Retail Shoe Management"
- Header - Already used "Retail Shoe Management"

No company-specific logos or branding - this is a clean portfolio demo.

---

## 💰 Cost Impact

**Additional Cost:** $0  
- Uses existing S3 bucket
- Uses existing CloudFront distribution
- Minimal storage (~300 KB)
- Negligible bandwidth for portfolio traffic

---

## 📊 Architecture

```
User Browser
     ↓
     ↓ HTTPS
     ↓
troycosentino.com (CloudFront)
     ↓
     ↓ Path: /portfolio/retailshoeapp/*
     ↓
S3: troycosentino-website-1770695889
     └─ portfolio/
         └─ retailshoeapp/
             ├─ index.html
             └─ assets/
                 ├─ index-4mUr60Vc.css
                 └─ index-BmO2Hhy9.js
```

---

## 🔄 Future Updates

### Deploy New Version
```bash
# Just run the deploy script
./deploy-path.sh
```

### Rollback
```bash
# S3 versioning not enabled, so manual rollback:
# 1. Rebuild from git commit: git checkout <commit>
# 2. npm run build
# 3. ./deploy-path.sh
```

### Move to Different Path
```bash
# 1. Update vite.config.ts base path
# 2. npm run build
# 3. Upload to new S3 path
# 4. Invalidate CloudFront
```

---

## 🗑️ Old Resources (Cleanup)

Created earlier but no longer needed:

### CloudFront Distribution E1AQG5SELCGZBP
- **Status:** Being disabled
- **Domain:** d26i69ikk7ngyk.cloudfront.net
- **Action:** Will be deleted once disabled

### S3 Bucket: hmk-troycosentino-com
- **Status:** Active but unused
- **Action:** Will be deleted after CloudFront cleanup

### ACM Certificate
- **Domain:** hmk.troycosentino.com
- **ARN:** arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4
- **Status:** Pending validation (can be deleted)
- **Action:** Will be deleted (not needed for path-based deployment)

### Cleanup Commands (Run Later)
```bash
# After CloudFront distribution is disabled (wait ~15 minutes):
ETAG=$(aws cloudfront get-distribution-config --id E1AQG5SELCGZBP | jq -r '.ETag')
aws cloudfront delete-distribution --id E1AQG5SELCGZBP --if-match "$ETAG"

# Delete S3 bucket
aws s3 rm s3://hmk-troycosentino-com/ --recursive
aws s3 rb s3://hmk-troycosentino-com

# Delete ACM certificate
aws acm delete-certificate \
  --certificate-arn arn:aws:acm:us-east-1:541894706864:certificate/9214db68-a5e2-4a75-8197-f2c6c64f5ad4 \
  --region us-east-1
```

---

## 🎯 Portfolio Integration

### Link from Main Site
Add to Troy's portfolio page:

```html
<div class="project-card">
  <h3>Retail Shoe Management System</h3>
  <p>Full-stack inventory management system for retail shoe stores. Features include product catalog, order management, store transfers, and real-time inventory tracking.</p>
  <p><strong>Tech Stack:</strong> React, TypeScript, Tailwind CSS, Zustand, React Router</p>
  <a href="/portfolio/retailshoeapp/" class="demo-link">View Live Demo →</a>
  <a href="https://github.com/peggytheclaw/HMK-React" class="code-link">View Source Code →</a>
</div>
```

### Key Features to Highlight
- ✅ Modern React with TypeScript
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ State management with Zustand
- ✅ Client-side routing
- ✅ Form validation
- ✅ Real-time data updates
- ✅ Role-based access control
- ✅ Professional UI/UX

---

## 🐛 Troubleshooting

### Assets Not Loading
- Verify base path in vite.config.ts: `/portfolio/retailshoeapp/`
- Check CloudFront cache: Create invalidation for `/portfolio/retailshoeapp/*`
- Inspect browser Network tab for 404s

### Routing Issues
- SPA routing should work via CloudFront error page config
- Verify CloudFront is returning 200 for /portfolio/retailshoeapp/ paths
- Check browser console for routing errors

### Changes Not Appearing
- Run CloudFront invalidation (included in deploy script)
- Hard refresh browser: Cmd+Shift+R
- Check S3 to verify files uploaded

---

## 📚 Project Details

### Demo Accounts
- **admin** / demo - Administrator access
- **sjohnson** / demo - Store manager (Store #01)
- **mchen** / demo - Store manager (Store #02)
- **jmartinez** / demo - Store manager (Store #03)

### Features Demonstrated
1. **Dashboard** - Order statistics and recent activity
2. **Products** - Product catalog with search/filter
3. **Orders** - Order management with status tracking
4. **Inventory** - Store inventory lookup
5. **Transfers** - Inter-store transfer system
6. **Profile** - User account management

### Technologies Used
- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Build:** Vite
- **Deployment:** AWS S3 + CloudFront

---

## 🎉 Success Metrics

- ✅ Deployed in < 10 minutes after requirements change
- ✅ Zero downtime (uses existing infrastructure)
- ✅ Professional branding (generic, portfolio-appropriate)
- ✅ All features working
- ✅ Mobile responsive
- ✅ Fast loading (CloudFront CDN)
- ✅ Clean URL structure
- ✅ Easy to update

---

## 📞 Quick Reference

**Live URL:** https://troycosentino.com/portfolio/retailshoeapp/  
**GitHub:** https://github.com/peggytheclaw/HMK-React  
**S3 Path:** s3://troycosentino-website-1770695889/portfolio/retailshoeapp/  
**CloudFront:** E2S92XY4CW2GOH  
**Deploy Script:** `./deploy-path.sh`

---

**Deployed with ❤️ by Peggy**  
*Portfolio-ready demo • Production-grade infrastructure • Easy to maintain*
