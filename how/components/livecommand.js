import React, { useEffect, useRef, useState, useCallback } from "react";

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
    subject:
      "Subject: Exploring Full Stack Engineering Opportunities at Google",
    body: `Hi [Hiring Manager],

I came across Google's engineering roles and wanted to reach out directly. I am a full-stack developer specializing in AI-integrated applications, having built products like Yotype — a system-wide AI typing assistant built with Electron, React, and FastAPI.

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

const PHASE = {
  IDLE: "idle",
  TYPING_INPUT: "typing_input",
  THINKING: "thinking",
  TYPING_OUTPUT: "typing_output",
  DONE: "done",
};

export default function LiveCommandDemo() {
  const [activeId, setActiveId] = useState("rewrite");
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [typedInput, setTypedInput] = useState("");
  const [typedOutput, setTypedOutput] = useState("");
  const [progress, setProgress] = useState(0);

  const timersRef = useRef([]);

  const active = COMMANDS.find((c) => c.id === activeId);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  // Get the full output string for word-by-word typing
  const getOutputString = (c) => {
    if (!c) return "";
    if (c.type === "email") return c.body;
    return c.output || "";
  };

  const runSequence = useCallback((command) => {
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

    // 2) Progress bar 0->100 over 1200ms
    addTimer(() => {
      setPhase(PHASE.THINKING);
      const steps = 30;
      const dur = 1200;
      for (let s = 1; s <= steps; s++) {
        addTimer(() => setProgress((s / steps) * 100), (s / steps) * dur);
      }
    }, afterInputDelay);

    // 3) After progress finishes, fade in output and type word-by-word
    const outputStart = afterInputDelay + 1200 + 200;
    addTimer(() => {
      setPhase(PHASE.TYPING_OUTPUT);
      const outStr = getOutputString(command);
      const words = outStr.split(/(\s+)/); // keep whitespace
      let acc = "";
      let i = 0;
      // 20ms per word (treat whitespace tokens as instant)
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
  }, []);

  // Run /rewrite automatically 1s after mount (StrictMode-safe).
  // Set the flag INSIDE the timer callback so the cleanup of the first effect
  // run does not block the remount run from scheduling its own timer.
  useEffect(() => {
    if (typeof window !== "undefined" && window.__yt_demo_started__) return;
    const t = setTimeout(() => {
      if (typeof window !== "undefined") {
        if (window.__yt_demo_started__) return;
        window.__yt_demo_started__ = true;
      }
      runSequence(COMMANDS[0]);
    }, 1000);
    return () => clearTimeout(t);
  }, [runSequence]);

  // When active command changes (user click), run sequence
  const handleTabClick = (id) => {
    const c = COMMANDS.find((x) => x.id === id);
    if (!c) return;
    setActiveId(id);
    runSequence(c);
  };

  useEffect(() => () => clearAllTimers(), []);

  const showProgress = phase === PHASE.THINKING;
  const showOutput =
    phase === PHASE.TYPING_OUTPUT || phase === PHASE.DONE;

  // Determine what to render in output area
  const renderOutput = () => {
    if (!active) return null;
    if (active.type === "email") {
      // Subject is fixed (not typed), body is what gets typed
      return (
        <>
          <div className="yt-email-subject" data-testid="demo-email-subject">
            {active.subject}
          </div>
          <pre className="yt-email-body" data-testid="demo-output-text">
            {typedOutput}
            {phase === PHASE.TYPING_OUTPUT && <span className="yt-caret">▍</span>}
          </pre>
        </>
      );
    }
    if (active.type === "commit") {
      return (
        <pre className="yt-output-commit" data-testid="demo-output-text">
          {typedOutput}
          {phase === PHASE.TYPING_OUTPUT && <span className="yt-caret">▍</span>}
        </pre>
      );
    }
    if (active.type === "mono") {
      return (
        <p className="yt-output-mono" data-testid="demo-output-text">
          {typedOutput}
          {phase === PHASE.TYPING_OUTPUT && <span className="yt-caret">▍</span>}
        </p>
      );
    }
    // rewrite or text
    return (
      <>
        <p className="yt-output-text" data-testid="demo-output-text">
          {typedOutput}
          {phase === PHASE.TYPING_OUTPUT && <span className="yt-caret">▍</span>}
        </p>
        {active.type === "rewrite" && phase === PHASE.DONE && (
          <div className="yt-pills" data-testid="demo-rewrite-pills">
            <span className="yt-pill yt-pill-before">{active.before}</span>
            <span className="yt-pill yt-pill-after">{active.after}</span>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="yt-section yt-livedemo" data-testid="live-command-demo-section">
      <div className="yt-container">
        <div className="yt-headline-block">
          <p className="yt-eyebrow">SEE IT IN ACTION</p>
          <h2 className="yt-headline">Click a command. Watch it work.</h2>
          <p className="yt-subhead">
            Every command runs instantly. No setup. No switching. Just results.
          </p>
        </div>

        <div className="yt-demo-grid">
          {/* Left: tabs */}
          <div className="yt-tabs" data-testid="demo-tabs">
            {COMMANDS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleTabClick(c.id)}
                className={`yt-tab ${activeId === c.id ? "yt-tab-active" : ""}`}
                data-testid={`demo-tab-${c.id}`}
                aria-pressed={activeId === c.id}
              >
                <span className="yt-tab-cmd">{c.cmd}</span>
                <span className="yt-tab-desc">{c.desc}</span>
              </button>
            ))}
          </div>

          {/* Right: demo window */}
          <div className="yt-demo-window" data-testid="demo-window">
            {/* Zone 1: floating input simulation */}
            <div className="yt-demo-input" data-testid="demo-input-box">
              <span className="yt-demo-input-prefix">›</span>
              <span className="yt-demo-input-text">
                {typedInput}
                {phase === PHASE.TYPING_INPUT && (
                  <span className="yt-caret">▍</span>
                )}
              </span>
            </div>

            {/* Zone 2: progress */}
            <div
              className={`yt-progress-wrap ${showProgress ? "is-visible" : ""}`}
              data-testid="demo-progress"
            >
              <div className="yt-progress-track">
                <div
                  className="yt-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="yt-progress-text">Yotype is thinking...</p>
            </div>

            {/* Zone 3: output */}
            <div
              className={`yt-output-zone ${showOutput ? "is-visible" : ""}`}
              data-testid="demo-output-zone"
            >
              <p className="yt-output-label">{active?.label}</p>
              {renderOutput()}
            </div>
          </div>
        </div>

        {/* Custom command teaser */}
        <div className="yt-teaser" data-testid="custom-command-teaser">
          <p className="yt-teaser-label">COMING UP NEXT</p>
          <p className="yt-teaser-title">These are just the defaults.</p>
          <p className="yt-teaser-sub">
            Yotype lets you build your own commands. Your workflow, your rules, your personal AI agent.
          </p>
          <a href="#custom-commands" className="yt-teaser-link" data-testid="custom-commands-link">
            See how custom commands work →
          </a>
        </div>
      </div>

      <div className="yt-divider" />
    </section>
  );
}
