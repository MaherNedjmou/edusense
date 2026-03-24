"use client";

import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DemoPage() {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    gsap.fromTo(
      videoRef.current,
      {
        scale: 0.6,
        borderRadius: "32px",
      },
      {
        scale: 1,
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: videoRef.current,
          start: "top 80%",
          end: "top 10%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <main className="w-full bg-background text-foreground overflow-hidden pt-24">
      <div className="max-w-6xl mx-auto px-6">
      {/* HERO */}
      <section className="px-6 text-center max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 text-white" />
          </div>
          <span className="uppercase text-sm tracking-wide text-foreground/70">
            Live Demo
          </span>
        </div>

        <h1 className="text-5xl font-semibold">
          See <span className="text-secondary">EduSense</span> in Action
        </h1>

        <p className="text-lg text-foreground max-w-2xl mx-auto">
          Experience how EduSense transforms raw exam papers into structured data,
          evaluates answers with AI, and generates actionable insights instantly.
        </p>
      </section>

      {/* VIDEO SECTION */}
      <section className="relative h-full">

        {/* Sticky container */}
        <div className="sticky top-0 h-screen flex items-center justify-center">

          <div
            ref={videoRef}
            className="w-[80%] h-[70vh] bg-black overflow-hidden shadow-2xl"
          >
            <video
              src="/videos/Rick_Roll.mp4"
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>
      </div>
    </main>
  );
}