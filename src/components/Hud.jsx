import { useEffect, useState } from "react";
import { heroContent, navLinks, personalInfo } from "../data/portfolioData";

export default function Hud() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(() =>
    formatTime(personalInfo.timezone)
  );

  // Helper to format time into 24-hour HH:MM:SS with the specified IANA timezone
  function formatTime(timeZone) {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone || "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    } catch {
      return new Date().toLocaleTimeString("en-GB", { hour12: false });
    }
  }

  // Derive up to two uppercase initials from the brand name
  const brandInitials = personalInfo.brandName
    ? personalInfo.brandName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "NV";

  // Handle header background change on scroll (> 40px)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Cycle through HUD status lines every 3.5 seconds
  useEffect(() => {
    if (!heroContent.statusLines || heroContent.statusLines.length === 0) return;

    const statusInterval = setInterval(() => {
      setStatusIndex((prevIndex) => (prevIndex + 1) % heroContent.statusLines.length);
    }, 3500);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  // Update live clock every second
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(formatTime(personalInfo.timezone));
    }, 1000);

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  const isHeaderActive = isScrolled || isMobileMenuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isHeaderActive
          ? "bg-ink/80 backdrop-blur-md border-b border-bone/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto h-16 px-5 md:px-10 flex items-center justify-between">
        {/* Left: Brand / Logo link to #home */}
        <a
          href="#home"
          className="flex items-center gap-3 group focus:outline-none"
          aria-label={`${personalInfo.brandName} - Home`}
        >
          <div className="w-8 h-8 flex items-center justify-center border border-signal text-signal font-mono text-xs font-semibold transition-colors duration-200 group-hover:bg-signal/10">
            {brandInitials}
          </div>
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-[0.2em] text-bone group-hover:text-signal transition-colors duration-200">
            {personalInfo.brandName}
          </span>
        </a>

        {/* Centre (lg+): Rotating HUD status line */}
        {heroContent.statusLines && heroContent.statusLines.length > 0 && (
          <div
            className="hidden lg:flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim"
            aria-live="polite"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse"
              aria-hidden="true"
            />
            <span>{heroContent.statusLines[statusIndex]}</span>
          </div>
        )}

        {/* Right (md+): Navigation links & live clock */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-bone/70 hover:text-signal transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div
            className="font-mono text-xs text-dim tabular-nums tracking-wider border-l border-bone/10 pl-6"
            title={personalInfo.timezone}
            aria-label={`Current time in ${personalInfo.city}: ${currentTime}`}
          >
            {currentTime}
          </div>
        </div>

        {/* Mobile toggle button (below md) */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="font-mono text-xs uppercase tracking-widest text-bone hover:text-signal py-2 px-1 focus:outline-none"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-hud-menu"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-hud-menu"
          className="md:hidden bg-ink/95 backdrop-blur-lg border-b border-bone/10 px-6 py-6 transition-all duration-300"
        >
          <nav className="flex flex-col mb-6" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-semibold text-bone hover:text-signal border-b border-bone/10 py-4 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-between font-mono text-xs text-dim pt-2">
            <span>{personalInfo.city}</span>
            <span className="tabular-nums" title={personalInfo.timezone}>
              {currentTime}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
