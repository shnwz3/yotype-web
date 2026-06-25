"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ─── Command Data ─── */
const COMMANDS = [
  {
    id: "rewrite",
    cmd: "/rewrite",
    desc: "Rewrite anything, better",
    input: "/rewrite i want job pls help me out",
    label: "REWRITTEN",
    type: "rewrite",
    output:
      "I am actively exploring full-stack engineering opportunities and would welcome the chance to connect with your team.",
    before: "i want job pls help me out",
    after: "Rewritten ✓",
  },
  {
    id: "reply",
    cmd: "/reply",
    desc: "Generate smart replies instantly",
    input: "/reply thanks for applying we will get back",
    label: "SMART REPLY",
    type: "text",
    output:
      "Thank you for the update. I look forward to hearing from you and am happy to provide any additional information you may need in the meantime.",
  },
  {
    id: "coldemail",
    cmd: "/coldemail",
    desc: "Write cold emails in seconds",
    input: "/coldemail shah@gmail.com fullstack role google",
    label: "COLD EMAIL",
    type: "email",
    subject: "Subject: Exploring Full Stack Engineering Opportunities at Google",
    body: `Hi [Hiring Manager],

I came across Google's engineering roles and wanted to reach out directly. I am a full-stack developer specializing in AI-integrated applications, having built products like Yotype  a system-wide AI typing assistant built with Electron, React, and FastAPI.

I would love to explore how I can contribute to your team.

Best regards,
Shah`,
  },
  {
    id: "summarize",
    cmd: "/summarize",
    desc: "Summarize long text fast",
    input: "/summarize [long text pasted]",
    label: "SUMMARY",
    type: "text",
    output:
      "Yotype is a desktop AI typing assistant that works across all apps using slash commands. Key features include inline AI execution, custom workflows, multi-LLM support, and system-wide text transformation without switching apps.",
  },
  {
    id: "prompt",
    cmd: "/prompt",
    desc: "Turn one word into a full AI prompt",
    input: "/prompt hospital website",
    label: "AI PROMPT GENERATED",
    type: "mono",
    output:
      "A clean, modern hospital website homepage with a calming blue and white color palette. Features a hero section with a doctor consultation image, prominent appointment booking CTA, services grid with icons, patient testimonials, and trust badges. Mobile-first, accessible, professional design with smooth scroll animations.",
  },
  {
    id: "commit",
    cmd: "/commit",
    desc: "Write git commit messages",
    input: "/commit added login auth and fixed navbar",
    label: "GIT COMMIT MESSAGE",
    type: "commit",
    output: `feat(auth): implement user login authentication

- Add JWT-based login flow with session persistence
- Fix navbar rendering issue on mobile viewports
- Refactor auth middleware for cleaner token validation`,
  },
];

/* ─── Animation Phases ─── */
const PHASE = {
  IDLE: "idle",
  TYPING_INPUT: "typing_input",
  THINKING: "thinking",
  TYPING_OUTPUT: "typing_output",
  DONE: "done",
} as const;

type Phase = (typeof PHASE)[keyof typeof PHASE];

/* ─── Component ─── */
export default function LiveCommandDemo() {
  const [activeId, setActiveId] = useState("rewrite");
  const [phase, setPhase] = useState<Phase>(PHASE.IDLE);
  const [typedInput, setTypedInput] = useState("");
  const [typedOutput, setTypedOutput] = useState("");
  const [progress, setProgress] = useState(0);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStartedRef = useRef(false);

  const active = COMMANDS.find((c) => c.id === activeId);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const addTimer = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const getOutputString = (c: (typeof COMMANDS)[number]) => {
    if (!c) return "";
    if (c.type === "email") return (c as typeof COMMANDS[2]).body ?? "";
    return c.output || "";
  };

  const runSequence = useCallback(
    (command: (typeof COMMANDS)[number]) => {
      if (!command) return;
      clearAllTimers();
      setTypedInput("");
      setTypedOutput("");
      setProgress(0);
      setPhase(PHASE.TYPING_INPUT);

      const inputText = command.input;

      // 1) Typewriter input: 40ms per char
      for (let i = 1; i <= inputText.length; i++) {
        addTimer(() => {
          setTypedInput(inputText.slice(0, i));
        }, i * 40);
      }

      const afterInputDelay = inputText.length * 40 + 250;

      // 2) Progress bar 0→100 over 1200ms
      addTimer(() => {
        setPhase(PHASE.THINKING);
        const steps = 30;
        const dur = 1200;
        for (let s = 1; s <= steps; s++) {
          addTimer(
            () => setProgress((s / steps) * 100),
            (s / steps) * dur
          );
        }
      }, afterInputDelay);

      // 3) After progress finishes, type output word-by-word
      const outputStart = afterInputDelay + 1200 + 200;
      addTimer(() => {
        setPhase(PHASE.TYPING_OUTPUT);
        const outStr = getOutputString(command);
        const words = outStr.split(/(\s+)/); // keep whitespace tokens
        let acc = "";
        let i = 0;
        let elapsed = 0;
        words.forEach((w) => {
          const isWs = /^\s+$/.test(w);
          const delay = isWs ? 0 : 20;
          elapsed += delay;
          addTimer(() => {
            acc += w;
            setTypedOutput(acc);
            i++;
            if (i === words.length) {
              setPhase(PHASE.DONE);
            }
          }, elapsed);
        });
        if (words.length === 0) setPhase(PHASE.DONE);
      }, outputStart);
    },
    []
  );

  // Auto-run /rewrite 1s after mount
  useEffect(() => {
    if (hasStartedRef.current) return;
    const t = setTimeout(() => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      runSequence(COMMANDS[0]);
    }, 1000);
    return () => clearTimeout(t);
  }, [runSequence]);

  const handleTabClick = (id: string) => {
    const c = COMMANDS.find((x) => x.id === id);
    if (!c) return;
    setActiveId(id);
    runSequence(c);
  };

  useEffect(() => () => clearAllTimers(), []);

  const showProgress = phase === PHASE.THINKING;
  const showOutput = phase === PHASE.TYPING_OUTPUT || phase === PHASE.DONE;

  /* ─── Output Renderer ─── */
  const renderOutput = () => {
    if (!active) return null;

    if (active.type === "email") {
      const emailCmd = active as typeof COMMANDS[2];
      return (
        <>
          <div className="live-demo-email-subject" data-testid="demo-email-subject">
            {emailCmd.subject}
          </div>
          <pre className="live-demo-email-body" data-testid="demo-output-text">
            {typedOutput}
            {phase === PHASE.TYPING_OUTPUT && <span className="live-demo-caret">▍</span>}
          </pre>
        </>
      );
    }

    if (active.type === "commit") {
      return (
        <pre className="live-demo-output-commit" data-testid="demo-output-text">
          {typedOutput}
          {phase === PHASE.TYPING_OUTPUT && <span className="live-demo-caret">▍</span>}
        </pre>
      );
    }

    if (active.type === "mono") {
      return (
        <p className="live-demo-output-mono" data-testid="demo-output-text">
          {typedOutput}
          {phase === PHASE.TYPING_OUTPUT && <span className="live-demo-caret">▍</span>}
        </p>
      );
    }

    // rewrite or text
    return (
      <>
        <p className="live-demo-output-text" data-testid="demo-output-text">
          {typedOutput}
          {phase === PHASE.TYPING_OUTPUT && <span className="live-demo-caret">▍</span>}
        </p>
        {active.type === "rewrite" && phase === PHASE.DONE && (
          <div className="live-demo-pills" data-testid="demo-rewrite-pills">
            <span className="live-demo-pill live-demo-pill-before">{active.before}</span>
            <span className="live-demo-pill live-demo-pill-after">{active.after}</span>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="live-demo-section" id="live-demo" data-testid="live-command-demo-section">
      <div className="live-demo-container">
        {/* Headline */}
        <div className="live-demo-headline">
          <p className="live-demo-eyebrow">SEE IT IN ACTION</p>
          <h2 className="live-demo-title">Click a command. Watch it work.</h2>
          <p className="live-demo-sub">
            Every command runs instantly. No setup. No switching. Just results.
          </p>
        </div>

        {/* Demo Grid */}
        <div className="live-demo-grid">
          {/* Left: Tabs */}
          <div className="live-demo-tabs" data-testid="demo-tabs">
            {COMMANDS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleTabClick(c.id)}
                className={`live-demo-tab ${activeId === c.id ? "live-demo-tab-active" : ""}`}
                data-testid={`demo-tab-${c.id}`}
                aria-pressed={activeId === c.id}
              >
                <span className="live-demo-tab-cmd">{c.cmd}</span>
                <span className="live-demo-tab-desc">{c.desc}</span>
              </button>
            ))}
          </div>

          {/* Right: Demo Window */}
          <div className="live-demo-window" data-testid="demo-window">
            {/* Input */}
            <div className="live-demo-input" data-testid="demo-input-box">
              <span className="live-demo-input-prefix">›</span>
              <span className="live-demo-input-text">
                {typedInput}
                {phase === PHASE.TYPING_INPUT && (
                  <span className="live-demo-caret">▍</span>
                )}
              </span>
            </div>

            {/* Progress */}
            <div
              className={`live-demo-progress-wrap ${showProgress ? "is-visible" : ""}`}
              data-testid="demo-progress"
            >
              <div className="live-demo-progress-track">
                <div
                  className="live-demo-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="live-demo-progress-text">Yotype is thinking...</p>
            </div>

            {/* Output */}
            <div
              className={`live-demo-output-zone ${showOutput ? "is-visible" : ""}`}
              data-testid="demo-output-zone"
            >
              <p className="live-demo-output-label">{active?.label}</p>
              {renderOutput()}
            </div>
          </div>
        </div>

        {/* Custom Commands Showcase */}
        <div className="custom-cmd-showcase" id="custom-commands" data-testid="custom-commands-section">
          <div className="custom-cmd-header">
            <span className="custom-cmd-eyebrow">CUSTOM COMMANDS</span>
            <h3 className="custom-cmd-title">Create once. Use everywhere. Forever.</h3>
            <p className="custom-cmd-sub">
              Those were the defaults. The real power is building your own library. Write a prompt once, save it as a
              <span className="custom-cmd-highlight"> /command</span>, and reuse it in any app.
            </p>
          </div>

          <div className="custom-cmd-flow">
            {/* Step 1: Create */}
            <div className="custom-cmd-step">
              <div className="custom-cmd-step-badge">1</div>
              <div className="custom-cmd-step-content">
                <h4 className="custom-cmd-step-title">Write your prompt once, add placeholders for what changes</h4>
                <div className="custom-cmd-code-block">
                  <div className="custom-cmd-code-header">
                    <span className="custom-cmd-code-dot" style={{ background: "#ff5f57" }}></span>
                    <span className="custom-cmd-code-dot" style={{ background: "#febc2e" }}></span>
                    <span className="custom-cmd-code-dot" style={{ background: "#28c840" }}></span>
                    <span className="custom-cmd-code-label">Create Command</span>
                  </div>
                  <div className="custom-cmd-code-body">
                    <p><span className="custom-cmd-code-key">Name:</span> <span className="custom-cmd-code-val">/outreach</span></p>
                    <p><span className="custom-cmd-code-key">Prompt:</span> <span className="custom-cmd-code-val">&quot;Write a personalized cold outreach email for &#123;&#123;company&#125;&#125;, &#123;&#123;role&#125;&#125;, &#123;&#123;person&#125;&#125;. Keep it under 80 words, direct and human.&quot;</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="custom-cmd-connector" aria-hidden="true">
              <div className="custom-cmd-connector-line"></div>
              <div className="custom-cmd-connector-arrow">↓</div>
            </div>

            {/* Step 2: Use */}
            <div className="custom-cmd-step">
              <div className="custom-cmd-step-badge">2</div>
              <div className="custom-cmd-step-content">
                <h4 className="custom-cmd-step-title">Use it anywhere  Gmail, LinkedIn, Slack, Whatsapp, ChatGPT, any text field</h4>
                <div className="custom-cmd-usage-demo">
                  <div className="custom-cmd-usage-input">
                    <span className="custom-cmd-usage-prefix">›</span>
                    <span className="custom-cmd-usage-text">
                      <span className="custom-cmd-usage-cmd">/outreach</span>{" "}
                      Stripe, frontend engineer, Sarah
                    </span>
                  </div>
                  <div className="custom-cmd-usage-output">
                    <span className="custom-cmd-usage-tag">OUTPUT</span>
                    <p>Hi Sarah, I came across Stripe&apos;s frontend engineering team and wanted to reach out directly. I&apos;m a frontend engineer with deep experience in React and TypeScript. I&apos;d love to chat about how I could contribute  happy to share my portfolio if useful!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="custom-cmd-benefits">
            <div className="custom-cmd-benefit">
              <span className="custom-cmd-benefit-icon">⚡</span>
              <span>Create once, reuse forever</span>
            </div>
            <div className="custom-cmd-benefit">
              <span className="custom-cmd-benefit-icon">🔁</span>
              <span>No repetitive copy-pasting prompts</span>
            </div>
            <div className="custom-cmd-benefit">
              <span className="custom-cmd-benefit-icon">🌐</span>
              <span>Works in every app on your desktop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="live-demo-divider" data-testid="live-demo-divider"></div>
    </section>
  );
}
