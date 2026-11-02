import { useRef, useState } from "react";
import ScrambleText from "./ScrambleText";
import {
  contactContent,
  emailjsConfig,
  personalInfo,
  socialLinks,
} from "../data/portfolioData";

export default function Contact() {
  const formRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  // Extract first name in lowercase for terminal banner
  const firstNameLower = (personalInfo.name || "")
    .trim()
    .split(/\s+/)[0]
    .toLowerCase();

  // Filter out empty social links
  const activeSocials = [
    { label: "GitHub", url: socialLinks.github },
    { label: "LinkedIn", url: socialLinks.linkedin },
    { label: "Instagram", url: socialLinks.instagram },
  ].filter((item) => Boolean(item.url && item.url.trim() !== ""));

  // Determine if EmailJS environment variables are configured
  const isConfigured =
    emailjsConfig.serviceId &&
    emailjsConfig.templateId &&
    emailjsConfig.publicKey &&
    emailjsConfig.serviceId !== "YOUR_EMAILJS_SERVICE_ID" &&
    emailjsConfig.templateId !== "YOUR_EMAILJS_TEMPLATE_ID" &&
    emailjsConfig.publicKey !== "YOUR_EMAILJS_PUBLIC_KEY";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setStatus(null);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const userName = formData.get("user_name");
    const userEmail = formData.get("user_email");
    const userMessage = formData.get("message");

    // Fallback: If EmailJS is not configured, open pre-filled mailto in a new tab
    if (!isConfigured) {
      const subject = encodeURIComponent("Portfolio contact");
      const body = encodeURIComponent(
        `Name: ${userName}\nEmail: ${userEmail}\n\nMessage:\n${userMessage}`
      );
      const mailtoUrl = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
      window.open(mailtoUrl, "_blank");

      setStatus("success");
      form.reset();
      setIsSending(false);

      setTimeout(() => {
        setStatus(null);
      }, 4000);
      return;
    }

    // Configured: Send message asynchronously via EmailJS
    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        form,
        emailjsConfig.publicKey
      );

      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("EmailJS message dispatch failed:", err);
      setStatus("error");
    } finally {
      setIsSending(false);
      setTimeout(() => {
        setStatus(null);
      }, 4000);
    }
  };

  return (
    <section id="contact" className="hud-grid px-5 md:px-10 py-28 md:py-40">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
        {/* LEFT COLUMN: Headings, Direct Contact Info & Social Links */}
        <div className="flex flex-col gap-6">
          <ScrambleText
            text={contactContent.label}
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          />

          <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.95] tracking-[-0.04em] text-bone">
            {contactContent.heading}
          </h2>

          <p className="text-lg text-bone/70 max-w-md font-sans leading-relaxed">
            {contactContent.note}
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`mailto:${personalInfo.email}`}
              className="font-mono text-lg md:text-2xl text-bone underline decoration-signal decoration-2 underline-offset-8 hover:text-signal transition-colors duration-200 inline-block w-fit"
            >
              {personalInfo.email}
            </a>

            {personalInfo.phone && (
              <span className="font-mono text-sm text-dim pt-2">
                {personalInfo.phone}
              </span>
            )}
          </div>

          {/* Social Links */}
          {activeSocials.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 pt-6">
              {activeSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-bone/70 hover:text-signal transition-colors duration-200"
                >
                  {social.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Terminal-Style Message Form in HUD Frame */}
        <div className="w-full">
          <div className="hud-frame relative border border-bone/10 bg-ink/70 backdrop-blur p-6 md:p-10 flex flex-col gap-6">
            {/* Terminal Command Header */}
            <div className="font-mono text-xs text-dim flex items-center gap-1.5 pb-2 border-b border-bone/10">
              <span className="text-signal font-bold">$</span>
              <span>new message --to {firstNameLower}</span>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              {/* Field 1: Name */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
                >
                  &gt; name
                </label>
                <input
                  id="contact-name"
                  name="user_name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone font-mono text-sm py-2 px-0 rounded-none focus:outline-none transition-colors duration-200 placeholder:text-dim/50"
                />
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
                >
                  &gt; email
                </label>
                <input
                  id="contact-email"
                  name="user_email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone font-mono text-sm py-2 px-0 rounded-none focus:outline-none transition-colors duration-200 placeholder:text-dim/50"
                />
              </div>

              {/* Field 3: Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold"
                >
                  &gt; message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about the role or project…"
                  className="bg-transparent border-0 border-b border-bone/20 focus:border-signal text-bone font-mono text-sm py-2 px-0 rounded-none focus:outline-none transition-colors duration-200 resize-none placeholder:text-dim/50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-signal text-ink hover:bg-bone transition-colors duration-200 font-mono text-xs font-semibold uppercase tracking-[0.25em] px-6 py-4 flex items-center justify-between disabled:opacity-60 disabled:cursor-not-allowed group focus:outline-none"
              >
                <span>{isSending ? "Sending…" : "Send message"}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>

              {/* Status Message Line */}
              <div className="min-h-[1.25rem]">
                <p role="status" className="font-mono text-xs">
                  {status === "success" && (
                    <span className="text-emerald-400">
                      ✓ Message sent. Talk soon.
                    </span>
                  )}
                  {status === "error" && (
                    <span className="text-red-400">
                      ✕ Something went wrong. Please try again.
                    </span>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
