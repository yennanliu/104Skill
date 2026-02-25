# GitHub Pages Setup Guide

This guide will help you enable GitHub Pages for your 104Skill repository.

## Automatic Setup via GitHub Actions

The repository now includes a GitHub Actions workflow that automatically deploys your site to GitHub Pages.

## Enable GitHub Pages (One-Time Setup)

### Step 1: Go to Repository Settings

1. Navigate to your repository: https://github.com/yennanliu/104Skill
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar

### Step 2: Configure Pages Source

1. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"

2. Click **Save**

### Step 3: Verify Deployment

1. Go to **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once completed, your site will be live at:
   ```
   https://yennanliu.github.io/104Skill/
   ```

## Alternative Setup (Classic Pages)

If you prefer not to use GitHub Actions:

1. Go to **Settings** → **Pages**
2. Under **Source**:
   - Select "Deploy from a branch"
   - Branch: `main`
   - Folder: `/docs`
3. Click **Save**

## Custom Domain (Optional)

To use a custom domain like `104skill.com`:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**:
   - Enter your domain (e.g., `104skill.com`)
   - Click **Save**
3. Add DNS records at your domain registrar:
   ```
   Type    Name    Value
   CNAME   www     yennanliu.github.io
   A       @       185.199.108.153
   A       @       185.199.109.153
   A       @       185.199.110.153
   A       @       185.199.111.153
   ```

## Troubleshooting

### Issue: 404 Not Found

**Solution 1**: Verify Pages is enabled
- Go to Settings → Pages
- Ensure "GitHub Actions" is selected as source

**Solution 2**: Check workflow status
- Go to Actions tab
- Ensure "Deploy to GitHub Pages" workflow succeeded

**Solution 3**: Verify files exist
- Check that `docs/index.html` exists in your repository
- Ensure `.nojekyll` file is present in `docs/` folder

### Issue: Workflow Fails

**Check permissions**:
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Click **Save**

### Issue: Site Not Updating

**Clear cache**:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Wait a few minutes for GitHub CDN to update

**Force rebuild**:
1. Go to Actions tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"
4. Select branch `main`
5. Click "Run workflow"

## Monitoring

### Check Deployment Status

1. **Actions Tab**: See all workflow runs
2. **Environments**: Settings → Environments → github-pages
3. **Deployments**: Main repository page, right sidebar

### View Logs

1. Go to Actions tab
2. Click on a workflow run
3. Click on "build" or "deploy" job
4. View detailed logs

## Updating the Site

The site automatically updates when you push changes to:
- Any file in `docs/` folder
- `.github/workflows/deploy.yml`

### Manual Update Process

1. Edit files locally:
   ```bash
   cd docs
   # Edit index.html, styles.css, or script.js
   ```

2. Test locally:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

3. Commit and push:
   ```bash
   git add docs/
   git commit -m "Update website content"
   git push origin main
   ```

4. GitHub Actions will automatically deploy (1-2 minutes)

## Performance

### Expected Metrics
- **Load Time**: < 2 seconds
- **Performance Score**: 90+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 90+

### Optimization Tips
- Images are optimized automatically by GitHub
- CSS/JS are minified in production
- CDN caching enabled by default

## Security

### HTTPS
- Automatically enabled for all GitHub Pages sites
- Certificate managed by GitHub
- No configuration needed

### Headers
To add security headers, create `docs/_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Analytics (Optional)

To add Google Analytics:

1. Get your GA4 tracking ID
2. Add to `docs/index.html` before `</head>`:
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

## CI/CD Workflow Details

The workflow (`.github/workflows/deploy.yml`) does the following:

1. **Trigger**: On push to main branch (if docs/ changed)
2. **Build**: Prepares the docs folder
3. **Upload**: Creates deployment artifact
4. **Deploy**: Publishes to GitHub Pages

### Workflow Badge

Add to your README:
```markdown
[![Deploy Status](https://github.com/yennanliu/104Skill/actions/workflows/deploy.yml/badge.svg)](https://github.com/yennanliu/104Skill/actions/workflows/deploy.yml)
```

## Next Steps

1. ✅ Enable GitHub Pages in repository settings
2. ✅ Wait for first deployment to complete
3. ✅ Visit your site at https://yennanliu.github.io/104Skill/
4. ✅ Share the link!
5. 📊 (Optional) Add analytics
6. 🌐 (Optional) Set up custom domain

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

**Need help?** Open an issue or check the [CONTRIBUTING.md](CONTRIBUTING.md) guide.
