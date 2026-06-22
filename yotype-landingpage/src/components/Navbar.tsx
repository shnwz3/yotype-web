"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";

const USE_CASES = [
  { icon: "💻", role: "Developers", desc: "Git commits, code reviews, docs" },
  { icon: "📧", role: "Sales & Outreach", desc: "Cold emails, follow-ups, LinkedIn" },
  { icon: "✍️", role: "Content Writers", desc: "Rewrite, summarize, rephrase" },
  { icon: "🎓", role: "Students", desc: "Essays, emails to professors, notes" },
  { icon: "📋", role: "Product Managers", desc: "PRDs, tickets, stakeholder updates" },
  { icon: "🎨", role: "Designers", desc: "AI prompts, client briefs, copy" },
  { icon: "📊", role: "Marketers", desc: "Ad copy, social posts, campaigns" },
  { icon: "⚖️", role: "Freelancers", desc: "Proposals, invoices, client comms" },
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    if (target === "#" || !target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <nav className="nav" data-testid="nav-bar">
      <a
        href="#"
        className="nav-brand"
        data-testid="nav-brand"
        onClick={(e) => scrollTo(e, "#")}
      >
        <img src="/logo.png" alt="YoType Logo" className="brand-logo" />
        <span>YoType</span>
      </a>

      <div className="nav-links" data-testid="nav-links">
        <a href="#" data-testid="nav-link-features" onClick={(e) => scrollTo(e, "#")}>Features</a>
        <a href="#how-it-works" data-testid="nav-link-how-it-works" onClick={(e) => scrollTo(e, "#how-it-works")}>How It Works</a>

        {/* Use Cases Dropdown */}
        <div className="nav-dropdown-wrapper" ref={dropdownRef}>
          <button
            className={`nav-dropdown-trigger ${dropdownOpen ? "is-open" : ""}`}
            onClick={() => setDropdownOpen((prev) => !prev)}
            data-testid="nav-link-use-cases"
            aria-expanded={dropdownOpen}
          >
            Use Cases
            <svg
              className="nav-dropdown-chevron"
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="nav-dropdown" data-testid="use-cases-dropdown">
              <div className="nav-dropdown-header">Who uses Yotype?</div>
              <div className="nav-dropdown-grid">
                {USE_CASES.map((uc) => (
                  <button
                    key={uc.role}
                    className="nav-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                    data-testid={`use-case-${uc.role.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="nav-dropdown-item-icon">{uc.icon}</span>
                    <div>
                      <span className="nav-dropdown-item-role">{uc.role}</span>
                      <span className="nav-dropdown-item-desc">{uc.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <a href="#live-demo" data-testid="nav-link-commands" onClick={(e) => scrollTo(e, "#live-demo")}>Commands</a>
        <a href="#" data-testid="nav-link-pricing" onClick={(e) => scrollTo(e, "#")}>Pricing</a>
      </div>

      <a href="#download" className="nav-cta" data-testid="nav-download-btn" onClick={(e) => scrollTo(e, "#")}>
        Download
      </a>
    </nav>
  );
}
