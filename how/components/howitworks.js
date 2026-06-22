import React from "react";
import { Sparkles, Cpu, Wand2 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Sparkles,
    title: "Trigger anywhere",
    desc: "Hit your shortcut in any app — browser, editor, mail client. The Yotype floating input appears instantly.",
  },
  {
    n: "02",
    icon: Cpu,
    title: "Type a slash command",
    desc: "Use /rewrite, /reply, /summarize or your own custom commands. Yotype routes it to the right model.",
  },
  {
    n: "03",
    icon: Wand2,
    title: "Get inline output",
    desc: "The result is dropped where your cursor is. No copy-paste, no switching tabs, no broken flow.",
  },
];

export default function HowItWorks() {
  return (
    <section className="yt-section yt-howitworks" data-testid="how-it-works-section">
      <div className="yt-container">
        <div className="yt-headline-block">
          <p className="yt-eyebrow">HOW IT WORKS</p>
          <h2 className="yt-headline">Three steps. Zero friction.</h2>
          <p className="yt-subhead">
            Yotype lives one keystroke away. It runs locally on your machine and stays out of your
            way until you summon it.
          </p>
        </div>

        <div className="yt-steps">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="yt-step-card"
                data-testid={`how-it-works-step-${i + 1}`}
              >
                <div className="yt-step-top">
                  <span className="yt-step-n">{s.n}</span>
                  <Icon size={18} strokeWidth={1.6} className="yt-step-icon" />
                </div>
                <h3 className="yt-step-title">{s.title}</h3>
                <p className="yt-step-desc">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="yt-divider" />
    </section>
  );
}
