## Portfolio Redesign (2025)

Static, accessible, performance‑first portfolio for Data Science / Quant profile.

### Key Features
- Hero positioning line, experience timeline (SG ATS, GAEA21, HCP)
- Featured projects with metric badges (FarmVision 92% accuracy, Trading +10% CAGR)
- Skills grouped chips, certifications, languages
- EN/FR minimal i18n (no build step) + theme (dark/light) persistence via localStorage
- PWA manifest + offline caching (service worker)
- SEO: meta, OpenGraph, JSON‑LD Person, sitemap, robots

### Update i18n Text
Edit `script.js` dictionaries (dict.en / dict.fr). Only keys used with `data-i18n` need entries. Add a new key in both objects and place `data-i18n="your.key"` on the HTML element.

### Add a New Project Card
Duplicate a `<article class="project-card">` block in `index.html` within `#projects` grid. Keep structure:
```
<article class="project-card">
	<header>
		<h3 class="project-title">Name</h3>
		<div class="metric-badges"><span class="metric">Metric</span></div>
	</header>
	<p class="project-problem"><strong>Problem:</strong> ...</p>
	<p class="project-approach"><strong>Approach:</strong> ...</p>
	<p class="project-impact"><strong>Impact:</strong> ...</p>
	<div class="stack-row"><span>Tech1</span></div>
	<div class="project-links">...</div>
 </article>
```

### Change Theme Defaults
Modify `themeToggle` logic in `script.js` or Tailwind extension in `<head>`.

### Performance Tips
- Replace large images in `assets/images` with optimized (≤150KB) versions.
- Add `fetchpriority="high"` to critical hero image if needed.

### Deploy
Push to `main` on GitHub Pages repository (`username.github.io`). All assets are static.