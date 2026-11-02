import {
  academy,
  footerContent,
  navLinks,
  personalInfo,
  socialLinks,
} from "../data/portfolioData";

// Module-level constant ensures pure render
const currentYear = new Date().getFullYear();

export default function Footer() {
  // Filter active social profiles (skips empty entries)
  const activeSocials = [
    { label: "GitHub", url: socialLinks.github },
    { label: "LinkedIn", url: socialLinks.linkedin },
    { label: "Instagram", url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url && item.url.trim() !== ""));

  return (
    <footer className="w-full overflow-hidden border-t border-bone/10 px-5 md:px-10 pt-16 pb-8 bg-ink">
      <div className="max-w-[1440px] mx-auto">
        {/* Three Columns on Desktop (Stacked on Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {/* Column 1: Navigate */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-1">
              Navigate
            </span>
            <nav className="flex flex-col gap-2" aria-label="Footer Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-bone/75 hover:text-signal transition-colors duration-200 font-sans w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: Elsewhere (Social Links) */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-1">
              Elsewhere
            </span>
            <div className="flex flex-col gap-2">
              {activeSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone/75 hover:text-signal transition-colors duration-200 font-sans w-fit"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Say Hello */}
          <div className="flex flex-col gap-2 md:items-end md:text-right">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold mb-1">
              Say hello
            </span>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-sm md:text-base text-bone/75 hover:text-signal transition-colors duration-200 font-sans"
            >
              {personalInfo.email}
            </a>
            <span className="font-mono text-xs text-dim pt-1">
              {personalInfo.city}
            </span>
          </div>
        </div>

        {/* Brand Name Watermark */}
        <div
          aria-hidden="true"
          className="text-center uppercase whitespace-nowrap text-[13.5vw] font-bold leading-none tracking-[-0.05em] text-bone/[0.07] select-none my-6 overflow-hidden pointer-events-none"
        >
          {personalInfo.brandName}
        </div>

        {/* Bottom Metadata & Credits Row */}
        <div className="border-t border-bone/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-dim text-center md:text-left">
          <div>
            © {currentYear} {personalInfo.name} · {footerContent.tagline}
          </div>
          <div>
            Trained at{" "}
            <a
              href={academy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-signal transition-colors duration-200"
            >
              {academy.name}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
