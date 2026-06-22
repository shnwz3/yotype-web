"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import styles from "./MockupAnimation.module.css";

export default function MockupAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<gsap.core.Timeline | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  useGSAP(() => {
    const q = gsap.utils.selector(containerRef);

    // Typewriter helper
    const tw = (selector: string, text: string, duration: number, showCursor = false) => {
      const obj = { i: 0 };
      return gsap.to(obj, {
        i: text.length,
        duration,
        ease: "none",
        onStart: () => {
          const el = q(selector)[0];
          if (el) el.textContent = "";
        },
        onUpdate: () => {
          const el = q(selector)[0];
          const currentCount = Math.round(obj.i);
          if (el) {
            el.textContent = text.slice(0, currentCount) + (showCursor && currentCount < text.length ? "|" : "");
          }
        },
        onComplete: () => {
          const el = q(selector)[0];
          if (el) el.textContent = text;
        }
      });
    };

    // Helper to build a single sequence step in the GSAP timeline
    const buildSequence = ({
      idx,
      command,
      restText,
      resultPanelSelector,
      populate,
      holdAfter = 2,
      resetTop = "100px",
      activeTop = "80px",
      exitTop = "70px",
    }: {
      idx: number;
      command: string;
      restText: string;
      resultPanelSelector: string;
      populate?: (timeline: gsap.core.Timeline, start: number) => void;
      holdAfter?: number;
      resetTop?: string;
      activeTop?: string;
      exitTop?: string;
    }) => {
      const tl = gsap.timeline();

      tl.call(() => {
        setActiveDot(idx);
        const subject = q("#emailSubject")[0];
        const content = q("#emailContent")[0];
        const beforeText = q("#rewriteBefore")[0];
        const afterText = q("#rewriteAfter")[0];
        const promptText = q("#promptText")[0];
        
        if (subject) subject.textContent = "";
        if (content) content.textContent = "";
        if (beforeText) beforeText.textContent = "";
        if (afterText) afterText.textContent = "";
        if (promptText) promptText.textContent = "";
      })
        // Reset state for this sequence
        .set(q("#emailPanel, #rewritePanel, #promptPanel"), {
          opacity: 0,
          scale: 0.97,
          xPercent: -50,
          yPercent: 0,
          left: "50%",
          top: resetTop,
        })
        .set(q("#floatingInput"), { 
          opacity: 0, 
          y: -20, 
          xPercent: -50,
          left: "50%",
          scale: 0.92 
        })
        .set(q("#inputShimmer"), { opacity: 0 })
        .set(q("#sentBadge"), { opacity: 0 })
        .set(q("#inputCmd"), { textContent: "" })
        .set(q("#inputRest"), { textContent: "" })
        .set(q("#inputCursor"), { opacity: 1 })
        
        // 0s: shortcut hint fades in
        .to(q("#shortcutHint"), { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(q("#shortcutHint"), { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.85)
        
        // 1s: floating input slides down
        .to(q("#floatingInput"), {
          opacity: 1,
          y: 0,
          scale: 1,
          xPercent: -50,
          duration: 0.5,
          ease: "power3.out",
        }, 1);

      // 1.5s -> 3s: typewriter command + rest
      tl.set(q("#inputCursor"), { animation: "none", opacity: 1 }, 1.5);
      tl.add(tw("#inputCmd", command, 0.45), 1.5);
      tl.add(tw("#inputRest", restText, 1.05), 1.95);
      tl.set(q("#inputCursor"), { clearProps: "animation" }, 3.0);

      // 3s -> 3.5s: shimmer loading
      tl.to(q("#inputShimmer"), { opacity: 1, duration: 0.18 }, 3.0)
        .to(q("#inputCursor"), { opacity: 0, duration: 0.2 }, 3.0)
        .to(q("#inputShimmer"), { opacity: 0, duration: 0.25 }, 3.45);

      // 3.5s: input fades / scales out
      tl.to(q("#floatingInput"), {
        opacity: 0,
        scale: 0.92,
        y: -8,
        xPercent: -50,
        duration: 0.35,
        ease: "power2.in",
      }, 3.5);

      // 3.75s: result panel appears
      tl.to(q(resultPanelSelector), {
        opacity: 1,
        scale: 1,
        xPercent: -50,
        yPercent: 0,
        top: activeTop,
        duration: 0.6,
        ease: "back.out(1.2)",
      }, 3.75);

      // Populate custom animations
      if (populate) {
        populate(tl, 3.95);
      }

      // Hold + fade out everything
      const fadeAt = 3.95 + holdAfter + 1.2;
      tl.to(q(resultPanelSelector), {
        opacity: 0,
        scale: 0.96,
        xPercent: -50,
        yPercent: 0,
        top: exitTop,
        duration: 0.5,
        ease: "power2.in",
      }, fadeAt)
      .to({}, { duration: 0.5 }, fadeAt + 0.5); // pause

      return tl;
    };

    // Master Timeline
    const master = gsap.timeline({ repeat: -1, delay: 1.2 });
    masterRef.current = master;

    // SEQUENCE 1 - /coldemail
    master.addLabel("seq0");
    master.add(buildSequence({
      idx: 0,
      command: "/coldemail",
      restText: " shah@gmail.com fullstack role google",
      resultPanelSelector: "#emailPanel",
      holdAfter: 3.8,
      resetTop: "100px",
      activeTop: "80px",
      exitTop: "70px",
      populate: (tl, start) => {
        tl.add(tw("#emailSubject", "Exploring Full Stack Opportunities at Google", 1.2, true), start);
        const emailBody =
          "Hi Shah,\n\n" +
          "I came across the full-stack engineering opening at Google and wanted to reach out directly.\n" +
          "I've spent the last few years shipping production-grade web apps end-to-end — and I'd love to bring that to your team.";
        tl.add(tw("#emailContent", emailBody, 2.2, true), start + 1.35);
        tl.to(q("#sendBtn"), { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 }, start + 3.7);
        tl.to(q("#sentBadge"), { opacity: 1, scale: 1.08, duration: 0.25, ease: "power2.out" }, start + 3.9)
          .to(q("#sentBadge"), { scale: 1, duration: 0.15 }, start + 4.15);
      }
    }));

    // SEQUENCE 2 - /rewrite
    master.addLabel("seq1");
    master.add(buildSequence({
      idx: 1,
      command: "/rewrite",
      restText: " i want job pls help me",
      resultPanelSelector: "#rewritePanel",
      holdAfter: 2.8,
      resetTop: "160px",
      activeTop: "140px",
      exitTop: "130px",
      populate: (tl, start) => {
        tl.add(tw("#rewriteBefore", "i want job pls help me", 0.85, true), start);
        tl.add(tw("#rewriteAfter",
          "I am actively exploring full-stack engineering opportunities and would love to connect.",
          1.8, true), start + 0.95);
        tl.to(q("#rewriteAfterSide"), {
          borderColor: "rgba(40, 200, 100, 0.45)",
          boxShadow: "0 0 15px rgba(40, 200, 100, 0.2)",
          duration: 0.45,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        }, start + 2.75);
      }
    }));

    // SEQUENCE 3 - /prompt
    master.addLabel("seq2");
    master.add(buildSequence({
      idx: 2,
      command: "/prompt",
      restText: " hospital website",
      resultPanelSelector: "#promptPanel",
      holdAfter: 3.2,
      resetTop: "150px",
      activeTop: "130px",
      exitTop: "120px",
      populate: (tl, start) => {
        const promptStr =
          "A clean, modern hospital website homepage with a calming blue and white color palette, featuring a hero section with a doctor image, appointment booking CTA, services grid, and trust badges. Professional, accessible, mobile-first design.";
        tl.add(tw("#promptText", promptStr, 3.0, true), start);
        tl.to(q("#promptCard"), {
          borderColor: "var(--color-brand-glow)",
          boxShadow: "0 0 15px var(--color-brand-glow-subtle)",
          duration: 0.45,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        }, start + 3.05);
      }
    }));

    // Entry animation for mockup container itself
    gsap.set(containerRef.current, { opacity: 0, scale: 0.95 });
    gsap.to(containerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: "power2.out",
      delay: 0.3,
    });

  }, { scope: containerRef });

  const handleDotClick = (idx: number) => {
    if (masterRef.current) {
      masterRef.current.play(`seq${idx}`);
    }
  };

  return (
    <div className={styles.mockup} id="mockup" ref={containerRef} data-testid="hero-mockup">
      <div className={styles.mockupBar}>
        <div className={`${styles.mockupDot} ${styles.red}`}></div>
        <div className={`${styles.mockupDot} ${styles.yellow}`}></div>
        <div className={`${styles.mockupDot} ${styles.green}`}></div>
        <div className={styles.mockupTitle}>YoType — Desktop</div>
      </div>
      <div className={styles.mockupBody}>
        {/* Shortcut hint */}
        <div className={styles.shortcutHint} id="shortcutHint">
          <span>Press</span>
          <span className={styles.key}>Ctrl</span>
          <span>+</span>
          <span className={styles.key}>Space</span>
        </div>

        {/* Floating command input */}
        <div className={styles.floatingInput} id="floatingInput">
          <span className={styles.inputPrefix} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </span>
          <div className={styles.inputText}>
            <span className={styles.inputCmd} id="inputCmd"></span>
            <span className={styles.inputRest} id="inputRest"></span>
            <span className={styles.inputCursor} id="inputCursor"></span>
          </div>
          <div className={styles.inputShimmer} id="inputShimmer"></div>
        </div>

        {/* SEQUENCE 1: Gmail Panel */}
        <div className={styles.resultPanel} id="emailPanel">
          <div className={styles.emailPanel}>
            <div className={styles.emailHeader}>
              <div className={styles.gmailLogo}>M</div>
              <div className={styles.emailTab}>New Message</div>
            </div>
            <div className={styles.emailBody}>
              <div className={styles.emailMeta}><span>To:</span><strong>shah@google.com</strong></div>
              <div className={styles.emailSubject} id="emailSubject"></div>
              <div className={styles.emailContent} id="emailContent"></div>
            </div>
            <div className={styles.emailActions}>
              <div className={styles.sendBtn} id="sendBtn">Send</div>
              <div className={styles.sentBadge} id="sentBadge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Sent
              </div>
            </div>
          </div>
        </div>

        {/* SEQUENCE 2: Before / After */}
        <div className={styles.resultPanel} id="rewritePanel">
          <div className={styles.rewriteCard}>
            <div className={`${styles.rewriteSide} ${styles.before}`} id="rewriteBeforeSide">
              <div className={styles.rewriteLabel}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Before
              </div>
              <div className={styles.rewriteText} id="rewriteBefore"></div>
            </div>
            <div className={`${styles.rewriteSide} ${styles.after}`} id="rewriteAfterSide">
              <div className={styles.rewriteLabel}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                After
              </div>
              <div className={styles.rewriteText} id="rewriteAfter"></div>
            </div>
          </div>
        </div>

        {/* SEQUENCE 3: Prompt Card */}
        <div className={styles.resultPanel} id="promptPanel">
          <div className={styles.promptCard} id="promptCard">
            <div className={styles.promptCardHeader}>
              <div className={styles.promptCardTitle}>Generated Prompt</div>
            </div>
            <div className={styles.promptText} id="promptText"></div>
          </div>
        </div>

        {/* Sequence indicator dots */}
        <div className={styles.seqDots} data-testid="seq-dots">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              className={`${styles.seqDot} ${activeDot === idx ? styles.active : ""}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
