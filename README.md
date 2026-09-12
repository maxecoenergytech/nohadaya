# NOHADAYA – The Mind & Motion Studio 🌿
> Official website, landing pages, admissions CRM, and private operations ERP suite for NOHADAYA Studio, Guwahati.

**Live Production Domain**: [https://www.nohadaya.com](https://www.nohadaya.com)  
**Hosting & CDN**: Netlify Edge Global CDN  
**Source Control**: GitHub Repository  

---

## 📁 Repository Structure

```
├── index.html                           # Main Public Landing Page
├── 404.html                             # Custom Branded 404 Error Page
├── _redirects                           # Netlify Routing Rules (/erp clean rewrite)
├── netlify.toml                         # Netlify CDN Caching, Security Headers, Builds
├── robots.txt                           # Search Engine Crawler Directives (Disallows /erp/)
├── sitemap.xml                          # Full Google XML Sitemap
├── site.webmanifest                     # PWA Mobile Web Manifest
├── leads-admin.html                     # Admissions Leads CRM Portal
├── portal-login.html                    # Direct Auth Fallback Page
│
├── erp/                                 # 🔒 Private Operations ERP Suite
│   └── index.html                       # ERP Dashboard (Students, HRMS, Finance, Packages)
│
├── blog/                                # 📰 Studio Blog & Articles Hub
│   └── index.html                       # Educational Articles & Guidance
│
├── abacus-classes-guwahati/             # 🧮 Abacus Course Landing Page
│   └── index.html
├── calligraphy-classes-guwahati/        # ✍️ Calligraphy Course Landing Page
│   └── index.html
├── yoga-classes-guwahati/               # 🧘 Yoga & Wellness Course Landing Page
│   └── index.html
│
├── css/
│   └── chatbot.css                      # AI Assistant & Chatbot Styling
├── js/
│   └── chatbot.js                       # AI Chatbot Dialog & FAQ Engine
│
└── images/                              # 📸 High-Performance WebP & JPG Image Assets
    ├── logo.webp / logo.jpg
    ├── flyer.webp / flyer.jpg
    ├── yoga_class.webp / yoga_class.jpg
    ├── abacus_competition.webp / abacus_competition.jpg
    ├── calligraphy_work.webp / calligraphy_work.jpg
    └── studio_interior.webp / studio_interior.jpg
```

---

## 🚀 Quick Deployment Guide: GitHub to Netlify

### Step 1: Push This Repository to GitHub
1. Create a new repository on [GitHub](https://github.com) named `nohadaya-website`.
2. In this folder, initialize git and push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: NOHADAYA Website & ERP"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nohadaya-website.git
   git push -u origin main
   ```

### Step 2: Deploy on Netlify
1. Log in to [Netlify](https://app.netlify.com).
2. Click **"Add new site"** > **"Import an existing project"** > Choose **GitHub**.
3. Select your `nohadaya-website` repository.
4. **Build settings**:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.`
5. Click **"Deploy site"**. Netlify will deploy the site to global edge nodes within ~15 seconds.

### Step 3: Connect Custom Domain (www.nohadaya.com)
1. Go to **Site configuration** > **Domain management** > **Add custom domain**.
2. Enter: `www.nohadaya.com`
3. Add these 2 DNS records at your domain registrar (GoDaddy, Namecheap, Hostinger, etc.):
   - **CNAME Record**:
     - Name: `www`
     - Value: `<your-site-name>.netlify.app`
   - **A Record**:
     - Name: `@`
     - Value: `75.2.60.5`
4. Netlify will automatically provision free SSL (HTTPS) via Let's Encrypt.

---

## 🔐 Back-Office & ERP Access
- **Private Route**: `https://www.nohadaya.com/erp`
- **Default Studio PIN**: `1088`
- **Master Admin Key**: `nohadaya2026`
- **Modules Included**:
  - Student Directory & Attendance Tracker
  - HRMS & Faculty Payroll Records (with edit & delete options)
  - Financial Income/Expense Ledger & Receipt Generator
  - Course Package CRUD Manager
  - Quick-switch link to Admissions Leads CRM (`leads-admin.html`)

---

## 🛡️ Security & Privacy Features
- Clean URLs via `_redirects` (`/erp` -> `/erp/index.html 200`).
- Private modules are blocked from Google search indexing via `robots.txt` (`Disallow: /erp/`).
- Content Security Policy (CSP), Strict-Transport-Security (HSTS), and X-Frame-Options configured in `netlify.toml`.
- 1-Year immutable browser caching for all WebP images, fonts, and icons.
