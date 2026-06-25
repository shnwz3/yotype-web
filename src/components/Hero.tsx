"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import MockupAnimation from "./MockupAnimation";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial setup for animation
    gsap.set('[data-anim="left"]', { opacity: 0, y: 18 });

    // Entry animation timeline
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to('[data-anim="left"]', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    });
  }, { scope: containerRef });

  const pills = [
    "/rewrite", "/coldemail", "/prompt", "/commit", "/rephrase",
    "/explain", "/tone", "/formfill", "/translate", "/reply",
    "/summarize", "/linkedin", "/soften", "/ticket", "/dictate"
  ];

  // Duplicate for seamless infinite loop scroll
  const duplicatedPills = [...pills, ...pills];

  return (
    <main className="hero" ref={containerRef} data-testid="hero-section">
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>

      <div className="hero-container">
        {/* LEFT COLUMN */}
        <div className="hero-left" data-testid="hero-left">
          <div className="hero-eyebrow" data-anim="left">
            <span className="eyebrow-tag">Universal Typing Layer</span>
            <span>Triggered from any text field on your desktop</span>
          </div>
          
          <h1 className="headline" data-anim="left" data-testid="hero-headline">
            Create once.<br />
            Use your <span className="accent">/commands</span><br />
            everywhere you type.
          </h1>
          
          <p className="subhead" data-anim="left" data-testid="hero-subhead">
            YoType brings AI into any text field on your desktop. One{" "}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--color-brand-tint)" }}>
              /commands
            </span>{" "}
            and it writes, rewrites, fills, and sends. No switching apps. No copy-pasting. Ever again.
          </p>
          
          <div className="cta-row" data-anim="left">
            <a href="#download-windows" id="download-windows" className="btn btn-primary" data-testid="cta-download-windows">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"></path>
              </svg>
              Download for Windows
            </a>
            <a href="#live-demo" className="btn btn-secondary" data-testid="cta-watch-demo">
              See it in action →
            </a>
          </div>
          
          {/* <div className="social-proof" data-anim="left" data-testid="social-proof">
            <span>⬇ 2,400+ downloads</span>
            <span>★ 4.8 rating</span>
            <span>🖥 Windows &amp; Mac</span>
          </div> */}
          
          <div className="pills-wrapper" data-anim="left" data-testid="pills-strip">
            <div className="pills-track" id="pillsTrack">
              {duplicatedPills.map((pill, index) => (
                <div key={index} className="pill">
                  {pill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hero-right">
          <MockupAnimation />
        </div>
      </div>
    </main>
  );
}
