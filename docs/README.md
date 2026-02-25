# 104 Auto-Apply GitHub Pages

This directory contains the source files for the GitHub Pages site.

## Files

- `index.html` - Main landing page
- `styles.css` - Modern CSS styling (blue/green/teal theme)
- `script.js` - Interactive JavaScript features

## Local Development

To view the site locally:

1. Open `index.html` in your browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

### Workflow

See `.github/workflows/deploy.yml` for the CI/CD configuration.

### Manual Deployment

You can also trigger a manual deployment:
1. Go to GitHub Actions
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

## Design

- **Color Scheme**: Blue/Green/Teal (NO PURPLE)
- **Primary**: #0EA5E9 (Sky Blue)
- **Secondary**: #10B981 (Green)
- **Accent**: #06B6D4 (Cyan)
- **Typography**: Inter font family
- **Style**: Modern, clean, with glassmorphism effects

## Features

- Responsive design
- Smooth scroll animations
- Interactive FAQ accordions
- Animated terminal code display
- Copy-to-clipboard for code blocks
- Gradient backgrounds with animated orbs
- Intersection Observer for fade-in effects

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive)
