# FitWell Education

A simple, static website for exercise and nutritional fitness education — built with plain HTML, CSS, and minimal JavaScript. Designed for hosting on **GitHub Pages**.

## Site Sections

| Page | URL | Description |
|------|-----|-------------|
| Home | `/index.html` | Overview and quick links to all sections |
| Training | `/training.html` | Workout routines for different levels |
| Nutrition | `/nutrition.html` | Nutritional goals and practical tips |
| Lifestyle | `/lifestyle.html` | Guidance tailored to different backgrounds |
| Lectures | `/lectures.html` | Free educational video embeds |
| Health Info | `/health-info.html` | Summaries of health and fitness topics |
| Blog | `/blog.html` | Articles and updates |
| **Admin** | `/admin.html` | Password-protected content editor |

## Admin Panel

Visit **`/admin.html`** on your site to edit all content through a simple form interface.

- **Default password:** `fitwell2024`
- To change the password, edit `ADMIN_PASSWORD` in `js/content-loader.js`

### Updating content for all visitors

Because GitHub Pages is static hosting, edits work in two steps:

1. **Save Locally** — saves changes to your browser's localStorage (great for previewing)
2. **Export JSON** — downloads the updated `content.json` file

To publish changes for everyone:

1. Replace `data/content.json` in this repo with the exported file
2. Commit and push to GitHub

Alternatively, you can edit `data/content.json` directly in GitHub's web editor.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `fitness-education`)
2. Push this folder to the repo:

   ```bash
   cd ~/Desktop/fitness-education
   git add .
   git commit -m "Initial FitWell Education site"
   git remote add origin https://github.com/YOUR_USERNAME/fitness-education.git
   git push -u origin main
   ```

3. In your GitHub repo, go to **Settings → Pages**
4. Under **Source**, select **Deploy from a branch**
5. Choose branch `main` and folder `/ (root)`, then click **Save**
6. Your site will be live at `https://YOUR_USERNAME.github.io/fitness-education/`

## Local Preview

Serve the folder with any static file server:

```bash
cd ~/Desktop/fitness-education
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

> **Note:** Opening HTML files directly (`file://`) won't load content.json due to browser security. Use a local server.

## Project Structure

```
fitness-education/
├── index.html          # Home page
├── training.html       # Training routines
├── nutrition.html      # Nutritional goals
├── lifestyle.html      # Lifestyle management
├── lectures.html       # Free lecture videos
├── health-info.html    # Health information summaries
├── blog.html           # Blog
├── admin.html          # Admin content editor
├── css/
│   └── styles.css      # All site styles
├── js/
│   ├── content-loader.js  # Loads & renders content
│   └── admin.js           # Admin panel logic
└── data/
    └── content.json    # All editable site content
```

## Disclaimer

This site is for educational purposes only and is not medical advice. Consult a qualified healthcare provider before changing your exercise or nutrition routine.
