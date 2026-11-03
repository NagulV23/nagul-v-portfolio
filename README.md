# Nagul V — Portfolio

A Signal HUD–style developer portfolio built with React 19, Vite and Tailwind CSS 4, featuring a live 3D three.js centerpiece, GSAP scroll animations and a working contact form.

**Live site:** https://my-portfolio-phi-brown-77.vercel.app

---

## Tech stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build tool | Vite |
| Styling | Tailwind CSS 4 |
| Animations | GSAP + ScrollTrigger |
| Smooth scroll | Lenis |
| 3D scene | three.js |
| Contact form | EmailJS |

---

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (http://localhost:5173)
npm run dev

# 3. Build for production
npm run build
```

---

## Environment variables

Create a `.env.local` file in the project root (this file is git-ignored and will never be committed):

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

If the variables are absent the contact form automatically falls back to a pre-filled `mailto:` link.

---

## Credits

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).
