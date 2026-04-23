# Hicham Alaoui — Applied Data Scientist Portfolio

Static portfolio focused on applied machine learning, AI systems, quantitative finance, risk analytics, and decision workflows.

The portfolio presents selected professional and personal case studies, including:
- EVT-based pre-trade limits recalibration on 12M+ trades
- Index rebalancing production-control platform
- AI pricing and promotion decision engine
- Agricultural CO2 emissions modeling
- Fraud detection under class imbalance

## Stack

Pure static site — HTML, React (CDN), Babel standalone, CSS custom properties. No build step. Deploys directly to GitHub Pages.

## Structure

```
index.html              — Main single-page app (React)
data/profile.json       — All content: hero, experience, projects, skills
data/certifications.json
projects/               — Case study detail pages
assets/                 — Images, icons, CV
styles.css              — Theme variables and animations
```

## Updating Content

All content lives in `data/profile.json`. Edit the JSON to update experience, projects, skills, or hero copy. No rebuild required.

To add a new case study: create `projects/your-project.html` (use existing pages as template), then set `detailUrl` and `links.case` in the project entry in `profile.json`.

## Deploy

Push to `main` on the GitHub Pages repository. All assets are static — no CI step needed.
