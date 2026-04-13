# Khawaja MR — Portfolio Website

A dark, modern React portfolio for **Khawaja Mutti-ur-Rehman** — Media Producer & Digital Content Specialist.

## Stack
- **React 18** + **Vite**
- **Pure CSS** (no Tailwind dependency — zero config needed)
- **Poppins** font via Google Fonts
- **Color:** `#e5481d` (brand accent)

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## Project Structure

```
src/
├── data/
│   └── portfolio.js      ← ALL client content lives here
├── App.jsx               ← All components (Hero, About, Skills, Experience, Projects, Education, Contact)
├── index.css             ← Complete dark theme CSS
└── main.jsx              ← Entry point
```

## Customization

### Update Content
All text, skills, projects, experience — edit `src/data/portfolio.js` only.

### Update Colors
Change `--primary: #e5481d` in `src/index.css` `:root` to update the entire theme.

### Add Profile Photo
In `App.jsx`, replace the `about__avatar` div with:
```jsx
<img src="/photo.jpg" alt="Khawaja MR" className="about__avatar" style={{ objectFit: 'cover' }} />
```
Place the photo in the `public/` folder.

## Sections
1. **Hero** — Full screen with typewriter animation
2. **Stats** — Animated count-up numbers
3. **About** — Bio, software skills, contact details
4. **Skills** — Animated skill bars (scroll-triggered)
5. **Experience** — Timeline (Riphah FM 102.2)
6. **Projects** — Filterable grid by type
7. **Education & Certifications**
8. **Contact** — Form that opens email client

## Deployment
Push to GitHub → deploy on **Vercel** or **Netlify** in one click.
