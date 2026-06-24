"use client";

import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      iconText: " + space",
      title: "Press Your Shortcut",
      desc: "Hit Ctrl + Space from anywhere on your desktop. Yotype's floating input box appears instantly on top of any app you are using.",
      iconStyles: {
        width: "52px",
        height: "52px",
        borderRadius: "10px",
        background: "var(--color-brand-light-more)",
        border: "1px solid var(--color-brand-glow-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      textStyles: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "14px",
        color: "var(--color-brand)",
        fontWeight: 500,
      },
      hasConnector: true,
    },
    {
      number: "02",
      iconText: "/",
      title: "Type a Command",
      desc: "Type /rewrite, /reply, /coldemail or any custom command you have created. Add context if needed and hit Enter.",
      iconStyles: {
        width: "52px",
        height: "52px",
        borderRadius: "10px",
        background: "var(--color-brand-light-more)",
        border: "1px solid var(--color-brand-glow-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      textStyles: {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "28px",
        fontWeight: 700,
        color: "var(--color-brand)",
        lineHeight: 1,
      },
      hasConnector: true,
      isPulse: true,
    },
    {
      number: "03",
      iconText: "✓",
      title: "AI Acts Instantly",
      desc: "Yotype writes directly into your text field. Gmail, LinkedIn, WhatsApp, Notion, VS Code, forms, documents. Anywhere you type.",
      iconStyles: {
        width: "52px",
        height: "52px",
        borderRadius: "10px",
        background: "var(--color-brand-light-more)",
        border: "1px solid var(--color-brand-glow-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      textStyles: {
        fontSize: "28px",
        color: "var(--color-accent)",
        lineHeight: 1,
      },
      hasConnector: false,
    },
  ];

  const platforms = [
    "Gmail",
    "LinkedIn",
    "WhatsApp Web",
    "Notion",
    "VS Code",
    "Google Docs",
    "Slack",
    "Twitter",
    "Outlook",
    "Discord",
    "Figma",
    "Any App",
  ];

  // Duplicate for seamless infinite loop scroll marquee
  const marqueePlatforms = [...platforms, ...platforms];

  return (
    <section className="how-it-works-section" id="how-it-works" data-testid="how-it-works-section">
      <div className="how-it-works-container">
        {/* Headline */}
        <div className="how-it-works-headline" data-testid="how-it-works-headline">
          <span className="how-it-works-eyebrow" data-testid="how-it-works-eyebrow">
            HOW IT WORKS
          </span>
          <h2 className="how-it-works-title" data-testid="how-it-works-title">
            Three keystrokes. That's all it takes.
          </h2>
          <p className="how-it-works-sub" data-testid="how-it-works-subheadline">
            No new app to open. No tab switching. Yotype lives inside your desktop,
            ready whenever you type.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="how-it-works-grid" data-testid="how-it-works-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="how-it-works-card-wrapper" data-testid={`how-it-works-card-wrapper-${idx + 1}`}>
              <article className="how-it-works-card" data-testid={`how-it-works-card-${idx + 1}`}>
                <span className="how-it-works-step-number" data-testid={`how-it-works-step-number-${idx + 1}`}>
                  {step.number}
                </span>
                
                <div
                  className={step.isPulse ? "how-it-works-pulse-icon" : ""}
                  style={step.iconStyles}
                  data-testid={`how-it-works-icon-${idx === 0 ? "shortcut" : idx === 1 ? "command" : "check"}`}
                >
                  <span style={step.textStyles}>{step.iconText}</span>
                </div>
                
                <h3 className="how-it-works-card-title" data-testid={`how-it-works-card-title-${idx + 1}`}>
                  {step.title}
                </h3>
                
                <p className="how-it-works-card-desc" data-testid={`how-it-works-card-desc-${idx + 1}`}>
                  {step.desc}
                </p>
              </article>
              
              {step.hasConnector && (
                <div
                  className="how-it-works-connector"
                  data-testid={`how-it-works-connector-${idx + 1}`}
                  aria-hidden="true"
                >
                  <div className="how-it-works-connector-line"></div>
                  <div
                    className="how-it-works-connector-dot"
                    style={{ left: "76.3%" }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Platforms Marquee */}
        <div className="how-it-works-platforms" data-testid="how-it-works-platforms">
          <div className="how-it-works-platforms-label" data-testid="how-it-works-platforms-label">
            Works seamlessly inside →
          </div>
          
          <div className="how-it-works-marquee">
            <div className="how-it-works-marquee-track">
              {marqueePlatforms.map((platform, index) => (
                <span
                  key={index}
                  className="how-it-works-platform-pill"
                  data-testid={`how-it-works-platform-pill-${index}`}
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="how-it-works-divider" data-testid="how-it-works-divider"></div>
      </div>
    </section>
  );
}
