"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import about_pic from '@/public/images/about_pic.png';
import how_top from '@/public/images/how_top.png';
import how_row1 from '@/public/images/how_row1.png';
import how_row2 from '@/public/images/how_row2.png';
import how_row3 from '@/public/images/how_row3.png';
import how_row4 from '@/public/images/how_row4.png';
import how_bottom from '@/public/images/how_bottom.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from "lenis";
import { Settings } from 'lucide-react';
import CardSVG from '@/components/UI/CardSVG';

gsap.registerPlugin(ScrollTrigger);

// "large" = above 1280px (xl), "small" = 1280px and below (laptops included)
const LG_BREAKPOINT = 1280;

const How = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // ── Card entrance animations (bottom → top + scale up) ─────────
    const cards = gsap.utils.toArray<HTMLElement>(".card-wrapper");
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // ── Responsive SVG path animation ──────────────────────────────
    let pathScrollTrigger: ScrollTrigger | null = null;

    const initActivePath = () => {
      if (pathScrollTrigger) {
        pathScrollTrigger.kill();
        pathScrollTrigger = null;
      }

      const isLarge = window.innerWidth > LG_BREAKPOINT;
      const activeId   = isLarge ? "stroke-path-lg" : "stroke-path-sm";
      const inactiveId = isLarge ? "stroke-path-sm" : "stroke-path-lg";
      const activeSvgId   = isLarge ? "svg-lg" : "svg-sm";
      const inactiveSvgId = isLarge ? "svg-sm" : "svg-lg";

      // Show / hide the SVG containers
      const activeSvg   = document.getElementById(activeSvgId);
      const inactiveSvg = document.getElementById(inactiveSvgId);
      if (activeSvg)   activeSvg.style.display   = "block";
      if (inactiveSvg) inactiveSvg.style.display  = "none";

      // Reset inactive path styles
      const inactivePath = document.getElementById(inactiveId) as SVGPathElement | null;
      if (inactivePath) {
        inactivePath.style.strokeDasharray  = "none";
        inactivePath.style.strokeDashoffset = "0";
      }

      // Animate active path
      const path = document.getElementById(activeId) as SVGPathElement | null;
      if (!path) return;

      const pathLength = path.getTotalLength();
      path.style.strokeDasharray  = String(pathLength);
      path.style.strokeDashoffset = String(pathLength);

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".spotlight-section",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onRefresh: (self) => { pathScrollTrigger = self; },
        },
      });
    };

    initActivePath();

    const mq = window.matchMedia(`(max-width: ${LG_BREAKPOINT}px)`);
    mq.addEventListener("change", () => {
      ScrollTrigger.refresh();
      initActivePath();
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(tickerFn);
      mq.removeEventListener("change", initActivePath);
    };
  }, []);

  return (
    <>
      {/* Badge */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <span className="text-foreground/70 font-medium tracking-wide uppercase text-sm">
          How It Works
        </span>
      </div>

      {/* Title */}
      <h2 className="text-5xl font-semibold leading-tight text-foreground text-center">
        How EduSense <br />
        <span className="text-secondary">Works</span>
      </h2>

      <section
        ref={sectionRef}
        className="spotlight-section relative w-full h-full p-8 flex flex-col gap-40 overflow-hidden lg:gap-40 md:gap-20"
      >

        {/* Top centered hero image */}
        <div className="hero-image-wrapper flex justify-center gap-8">
          <div className="w-1/2 max-md:w-full">
            <Image src={how_top} alt="Why Pic" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Step 1 — card left, image right */}
        <div className="step-row flex gap-8 max-md:flex-col">
          <div className="card-wrapper flex-1 flex items-center">
            <CardSVG className="card">
              <span className="text-secondary text-sm font-semibold">STEP 01</span>
              <h2 className="text-2xl font-bold text-foreground">Upload & Detect Structure</h2>
              <p className="text-foreground/70">Upload scanned exam papers. EduSense detects layout elements such as questions, tables, and answer regions before processing.</p>
            </CardSVG>
          </div>
          <div className="img-wrapper flex-1">
            <Image src={how_row1} alt="Layout detection" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        {/* Step 2 — image left, card right */}
        <div className="step-row flex gap-8 max-md:flex-col">
          <div className="img-wrapper flex-1">
            <Image src={how_row2} alt="OCR extraction" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <div className="card-wrapper flex-1 flex items-center">
            <CardSVG className="card">
              <span className="text-secondary text-sm font-semibold">STEP 02</span>
              <h2 className="text-2xl font-bold text-foreground">Extract & Structure Data</h2>
              <p className="text-foreground/70">OCR converts handwritten and printed content into structured formats, transforming raw exam sheets into machine-readable data.</p>
            </CardSVG>
          </div>
        </div>

        {/* Step 3 — card left, image right */}
        <div className="step-row flex gap-8 max-md:flex-col">
          <div className="card-wrapper flex-1 flex items-center">
            <CardSVG className="card">
              <span className="text-secondary text-sm font-semibold">STEP 03</span>
              <h2 className="text-2xl font-bold text-foreground">AI Evaluation</h2>
              <p className="text-foreground/70">Student answers are compared to structured model solutions using AI, enabling concept-level grading instead of simple keyword matching.</p>
            </CardSVG>
          </div>
          <div className="img-wrapper flex-1">
            <Image src={how_row3} alt="AI evaluation" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        {/* Step 4 — image left, card right */}
        <div className="step-row flex gap-8 max-md:flex-col">
          <div className="img-wrapper flex-1">
            <Image src={how_row4} alt="Insights dashboard" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <div className="card-wrapper flex-1 flex items-center">
            <CardSVG className="card">
              <span className="text-secondary text-sm font-semibold">STEP 04</span>
              <h2 className="text-2xl font-bold text-foreground">Insights & Feedback</h2>
              <p className="text-foreground/70">Generate detailed feedback, highlight strengths and weaknesses, and provide actionable insights for better learning outcomes.</p>
            </CardSVG>
          </div>
        </div>

        {/* Bottom centered hero image */}
        <div className="hero-image-wrapper flex justify-center gap-8">
          <div className="w-1/2 max-md:w-full">
            <Image src={how_bottom} alt="Why Pic" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* SVG wrapper — both start hidden, JS shows the correct one */}
        <div className="absolute top-[25svh] left-1/2 -translate-x-1/2 w-[90%] h-full -z-10">

          {/* Small / laptop SVG (≤ 1280px) — hidden by default, JS reveals it */}
          <svg
            id="svg-sm"
            style={{ display: "none" }}
            width="1153"
            height="3798"
            viewBox="0 0 1153 3798"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="stroke-path-sm"
              d="M599.49 75.0175C599.49 75.0175 170.575 278.688 88.445 492.962C-60.1905 880.747 1072.41 796.394 1077.07 1209.16C1081.69 1617.54 125.138 1502.97 122.413 1911.37C119.672 2322.22 1008.43 3346.83 1060 2622.02C1111.58 1897.2 115.295 2883.76 159.999 3247.02C186.954 3466.04 563.999 3722.52 563.999 3722.52"
              stroke="#10B981"
              strokeWidth="150"
              strokeLinecap="round"
            />
          </svg>

          {/* Large screen SVG (> 1280px) — hidden by default, JS reveals it */}
          <svg
            id="svg-lg"
            style={{ display: "none" }}
            width="1273"
            height="4869"
            viewBox="0 0 1273 4869"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0"
          >
            <path
              id="stroke-path-lg"
              d="M687.503 75.0006C687.503 75.0006 73.0603 753.11 75.0434 1088.61C77.5123 1506.32 1202.84 1741.02 1197.99 2158.72C1193.18 2572.46 67.085 2625.11 75.0434 3038.81C82.4972 3426.29 1144.44 3385.1 1181.29 3771.39C1209.44 4066.53 590.893 4794 590.893 4794"
              stroke="#10B981"
              strokeWidth="150"
              strokeLinecap="round"
            />
          </svg>

        </div>

      </section>
    </>
  );
};

export default How;