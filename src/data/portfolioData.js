// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Nagul V",
  brandName: "Nagul V",
  role: "Data Analyst / Java Full Stack Developer",
  city: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "nagulv11@gmail.com",
  phone: "+918610806607",
  availability: "Open to Full-Time Roles",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/NagulV23",
  linkedin: "https://www.linkedin.com/in/nagul-v23",
  instagram: "",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro:
    "Aspiring Data Analyst skilled in Python, SQL, Excel, and Power BI, passionate about transforming raw data into meaningful insights and data-driven solutions.",
  statusLines: [
    "Analyzing data with Python",
    "Building Power BI dashboards",
    "Engineering Java systems",
  ],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Data-driven insights for smarter business decisions.",
  paragraph:
    "With a strong foundation in Artificial Intelligence and Data Science, I specialize in transforming raw datasets into clean, actionable visual stories using Python, SQL, and Power BI. I honed my practical analytics and problem-solving skills through the placement training program at TAP Academy.",
  stats: [
    { value: 2, suffix: "", label: "Internships completed" },
    { value: 2, suffix: "", label: "Projects developed" },
    { value: 1, suffix: "", label: "Professional certification" },
  ],
};

export const skillGroups = [
  {
    title: "Programming & Data Analysis",
    items: ["Python", "Pandas", "NumPy", "Data Manipulation"],
  },
  {
    title: "Database Management",
    items: ["SQL", "MySQL", "Joins", "Subqueries"],
  },
  {
    title: "Data Visualization",
    items: ["Power BI", "Dashboards", "KPI Reporting", "Data Visualization"],
  },
  {
    title: "Excel & Analytics",
    items: ["Advanced Excel", "Pivot Tables", "VLOOKUP", "XLOOKUP"],
  },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "ML-Driven Financial Fraud Detection with Real-Time Alert System",
    description:
      "Developed a machine learning-based system using XGBoost to identify potentially fraudulent financial transactions and generate real-time alerts through a Flask application.",
    tags: ["Python", "XGBoost", "Flask"],
    year: "2026",
    liveUrl: "https://fraud-detection-demo.example.com",
    githubUrl: "https://github.com/NagulV23/Financial-Fraud-Detection",
  },
  {
    id: "project-2",
    number: "02",
    title: "Food Delivery Application",
    description:
      "Developed a Java-based food delivery web application that allows users to explore restaurants, browse menus, manage shopping carts, and place food orders through an interactive interface.",
    tags: ["Java 17", "Servlets & JSP", "MySQL"],
    year: "2026",
    liveUrl: "https://food-delivery-demo.example.com",
    githubUrl: "https://github.com/NagulV23/FoodDeliveryApp",
  },
];

export const experience = [
  {
    period: "2026 — Present",
    role: "Placement Training",
    org: "TAP Academy",
    description:
      "Developing job-ready skills in Data Analytics, SQL, Python, Excel, and Power BI while preparing for placement opportunities.",
  },
  {
    period: "2026",
    role: "Java Full Stack Development",
    org: "TAP Academy",
    description:
      "Gained hands-on experience in Core Java, Advanced Java, HTML, CSS, JavaScript, SQL, JDBC, Servlets, JSP, and web application development.",
  },
  {
    period: "2022 — 2026",
    role: "B.Tech in Artificial Intelligence & Data Science",
    org: "Dhanalakshmi Srinivasan College",
    description:
      "Completed undergraduate studies with a focus on programming, data science, machine learning, and analytical problem-solving.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's build something.",
  note: "Have a role, a project or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
