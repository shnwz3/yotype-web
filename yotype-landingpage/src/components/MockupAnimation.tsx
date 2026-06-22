"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import styles from "./MockupAnimation.module.css";

export default function MockupAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const masterRef = useRef<gsap.core.Timeline | null>(null);
  
  const hintRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const cmdRef = useRef<HTMLSpanElement>(null);
  const restRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  
  const emailPanelRef = useRef<HTMLDivElement>(null);
  const emailSubjectRef = useRef<HTMLDivElement>(null);
  const emailContentRef = useRef<HTMLDivElement>(null);
  const sentBadgeRef = useRef<HTMLDivElement>(null);
  const sendBtnRef = useRef<HTMLDivElement>(null);
  
  const rewritePanelRef = useRef<HTMLDivElement>(null);
  const rewriteBeforeRef = useRef<HTMLDivElement>(null);
  const rewriteAfterRef = useRef<HTMLDivElement>(null);
  
  const promptPanelRef = useRef<HTMLDivElement>(null);
  const promptTextRef = useRef<HTMLDivElement>(null);
  
  const [activeDot, setActiveDot] = useState(0);

  useGSAP(() => {
    // Typewriter helper
    const tw = (el: HTMLElement | null, text: string, duration: number, showCursor = false) => {
      if (!el) return gsap.timeline();
      el.textContent = "";
      const obj = { i: 0 };
      return gsap.to(obj, {
        i: text.length,
        duration,
        ease: "none",
        onUpdate: () => {
          const currentCount = Math.round(obj.i);
          el.textContent = text.slice(0, currentCount) + (showCursor && currentCount < text.length ? "|" : "");
        },
        onComplete: () => {
          el.textContent = text;
        }
      });
    };

    // Helper to build a single sequence step in the GSAP timeline
    const buildSequence = ({
      idx,
      command,
      restText,
      resultPanel,
      populate,
      holdAfter = 2,
      resetTop = "100px",
      activeTop = "80px",
      exitTop = "70px",
    }: {
      idx: number;
      command: string;
      restText: string;
      resultPanel: HTMLElement | null;
      populate?: (timeline: gsap.core.Timeline, start: number) => void;
      holdAfter?: number;
      resetTop?: string;
      activeTop?: string;
      exitTop?: string;
    }) => {
      const tl = gsap.timeline();

      tl.call(() => {
        setActiveDot(idx);
        if (emailSubjectRef.current) emailSubjectRef.current.textContent = "";
        if (emailContentRef.current) emailContentRef.current.textContent = "";
        if (rewriteBeforeRef.current) rewriteBeforeRef.current.textContent = "";
        if (rewriteAfterRef.current) rewriteAfterRef.current.textContent = "";
        if (promptTextRef.current) promptTextRef.current.textContent = "";
      })
        // Reset state for this sequence
        .set([emailPanelRef.current, rewritePanelRef.current, promptPanelRef.current], {
          opacity: 0,
          scale: 0.97,
          xPercent: -50,
          yPercent: 0,
          left: "50%",
          top: resetTop,
        })
        .set(inputRef.current, { 
          opacity: 0, 
          y: -20, 
          xPercent: -50,
          left: "50%",
          scale: 0.92 
        })
        .set(shimmerRef.current, { opacity: 0 })
        .set(sentBadgeRef.current, { opacity: 0 })
        .set(cmdRef.current, { textContent: "" })
        .set(restRef.current, { textContent: "" })
        .set(cursorRef.current, { opacity: 1 })
        
        // 0s: shortcut hint fades in
        .to(hintRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(hintRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, 0.85)
        
        // 1s: floating input slides down
        .to(inputRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          xPercent: -50,
          duration: 0.5,
          ease: "power3.out",
        }, 1);

      // 1.5s -> 3s: typewriter command + rest
      tl.set(cursorRef.current, { animation: "none", opacity: 1 }, 1.5);
      tl.add(tw(cmdRef.current, command, 0.45), 1.5);
      tl.add(tw(restRef.current, restText, 1.05), 1.95);
      tl.set(cursorRef.current, { clearProps: "animation" }, 3.0);

      // 3s -> 3.5s: shimmer loading
      tl.to(shimmerRef.current, { opacity: 1, duration: 0.18 }, 3.0)
        .to(cursorRef.current, { opacity: 0, duration: 0.2 }, 3.0)
        .to(shimmerRef.current, { opacity: 0, duration: 0.25 }, 3.45);

      // 3.5s: input fades / scales out
      tl.to(inputRef.current, {
        opacity: 0,
        scale: 0.92,
        y: -8,
        xPercent: -50,
        duration: 0.35,
        ease: "power2.in",
      }, 3.5);

      // 3.75s: result panel appears
      tl.to(resultPanel, {
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
      tl.to(resultPanel, {
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
      resultPanel: emailPanelRef.current,
      holdAfter: 3.8,
      resetTop: "100px",
      activeTop: "80px",
      exitTop: "70px",
      populate: (tl, start) => {
        tl.add(tw(emailSubjectRef.current, "Exploring Full Stack Opportunities at Google", 1.2, true), start);
        const emailBody =
          "Hi Shah,\n\n" +
          "I came across the full-stack engineering opening at Google and wanted to reach out directly.\n" +
          "I've spent the last few years shipping production-grade web apps end-to-end — and I'd love to bring that to your team.";
        tl.add(tw(emailContentRef.current, emailBody, 2.2, true), start + 1.35);
        tl.to(sendBtnRef.current, { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 }, start + 3.7);
        tl.to(sentBadgeRef.current, { opacity: 1, scale: 1.08, duration: 0.25, ease: "power2.out" }, start + 3.9)
          .to(sentBadgeRef.current, { scale: 1, duration: 0.15 }, start + 4.15);
      }
    }));

    // SEQUENCE 2 - /rewrite
    master.addLabel("seq1");
    master.add(buildSequence({
      idx: 1,
      command: "/rewrite",
      restText: " i want job pls help me",
      resultPanel: rewritePanelRef.current,
      holdAfter: 2.8,
      resetTop: "160px",
      activeTop: "140px",
      exitTop: "130px",
      populate: (tl, start) => {
        tl.add(tw(rewriteBeforeRef.current, "i want job pls help me", 0.85, true), start);
        tl.add(tw(rewriteAfterRef.current,
          "I am actively exploring full-stack engineering opportunities and would love to connect.",
          1.8, true), start + 0.95);
        tl.to(rewritePanelRef.current?.querySelector(`.${styles.after}`) || null, {
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
      resultPanel: promptPanelRef.current,
      holdAfter: 3.2,
      resetTop: "150px",
      activeTop: "130px",
      exitTop: "120px",
      populate: (tl, start) => {
        const promptStr =
          "A clean, modern hospital website homepage with a calming blue and white color palette, featuring a hero section with a doctor image, appointment booking CTA, services grid, and trust badges. Professional, accessible, mobile-first design.";
        tl.add(tw(promptTextRef.current, promptStr, 3.0, true), start);
        tl.to(promptPanelRef.current?.querySelector(`.${styles.promptCard}`) || null, {
          borderColor: "rgba(108, 71, 255, 0.5)",
          boxShadow: "0 0 15px rgba(108, 71, 255, 0.18)",
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
        <div className={styles.mockupTitle}>Intento — Desktop</div>
      </div>
      <div className={styles.mockupBody}>
        {/* Shortcut hint */}
        <div className={styles.shortcutHint} id="shortcutHint" ref={hintRef}>
          <span>Press</span>
          <span className={styles.key}>Ctrl</span>
          <span>+</span>
          <span className={styles.key}>Space</span>
        </div>

        {/* Floating command input */}
        <div className={styles.floatingInput} id="floatingInput" ref={inputRef}>
          <span className={styles.inputPrefix} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </span>
          <div className={styles.inputText}>
            <span className={styles.inputCmd} id="inputCmd" ref={cmdRef}></span>
            <span className={styles.inputRest} id="inputRest" ref={restRef}></span>
            <span className={styles.inputCursor} id="inputCursor" ref={cursorRef}></span>
          </div>
          <div className={styles.inputShimmer} id="inputShimmer" ref={shimmerRef}></div>
        </div>

        {/* SEQUENCE 1: Gmail Panel */}
        <div className={styles.resultPanel} id="emailPanel" ref={emailPanelRef}>
          <div className={styles.emailPanel}>
            <div className={styles.emailHeader}>
              <div className={styles.gmailLogo}>M</div>
              <div className={styles.emailTab}>New Message</div>
            </div>
            <div className={styles.emailBody}>
              <div className={styles.emailMeta}><span>To:</span><strong>shah@gmail.com</strong></div>
              <div className={styles.emailMeta}><span>From:</span><strong>you@workmail.com</strong></div>
              <div className={styles.emailSubject} id="emailSubject" ref={emailSubjectRef}></div>
              <div className={styles.emailContent} id="emailContent" ref={emailContentRef}></div>
            </div>
            <div className={styles.emailActions}>
              <div className={styles.sendBtn} ref={sendBtnRef}>Send</div>
              <div className={styles.sentBadge} id="sentBadge" ref={sentBadgeRef}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Sent
              </div>
            </div>
          </div>
        </div>

        {/* SEQUENCE 2: Before / After */}
        <div className={styles.resultPanel} id="rewritePanel" ref={rewritePanelRef}>
          <div className={styles.rewriteCard}>
            <div className={`${styles.rewriteSide} ${styles.before}`}>
              <div className={styles.rewriteLabel}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Before
              </div>
              <div className={styles.rewriteText} id="rewriteBefore" ref={rewriteBeforeRef}></div>
            </div>
            <div className={`${styles.rewriteSide} ${styles.after}`}>
              <div className={styles.rewriteLabel}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                After
              </div>
              <div className={styles.rewriteText} id="rewriteAfter" ref={rewriteAfterRef}></div>
            </div>
          </div>
        </div>

        {/* SEQUENCE 3: Prompt Card */}
        <div className={styles.resultPanel} id="promptPanel" ref={promptPanelRef}>
          <div className={styles.promptCard}>
            <div className={styles.promptCardHeader}>
              <div className={styles.promptCardTitle}>Generated Prompt</div>
            </div>
            <div className={styles.promptText} id="promptText" ref={promptTextRef}></div>
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
