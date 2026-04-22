"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    void v.play();
  };

  return (
    <section id="demo" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            See it in motion
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
            One prompt.{" "}
            <span className="font-serif italic text-ember">One real task.</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-[20px] border border-line-strong bg-card card-shadow-strong"
        >
          <video
            ref={videoRef}
            src="/demo.mp4"
            className="block w-full"
            controls
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {!playing && (
            <button
              type="button"
              onClick={play}
              aria-label="Play demo"
              className="absolute inset-0 flex items-center justify-center bg-ink/30 backdrop-blur-[2px] transition-opacity hover:bg-ink/40"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-ember text-white shadow-[0_14px_40px_-10px_rgba(99,102,241,0.7)] transition-transform hover:scale-105">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </motion.div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Dot /> No edits. No speed-up. Real browser.
          </span>
          <span className="flex items-center gap-1.5">
            <Dot /> Works the same on any site.
          </span>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />;
}
