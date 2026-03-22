"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import why_pic from '@/public/images/why_pic.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from "lenis";
import { Settings } from 'lucide-react';
import CardSVG from '@/components/UI/CardSVG';

gsap.registerPlugin(ScrollTrigger);

const How = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // ── SVG path draw-on animation ──────────────────────────────────
    const path = document.getElementById("stroke-path") as unknown as SVGPathElement;
    if (path) {
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = String(pathLength);
      path.style.strokeDashoffset = String(pathLength);

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".spotlight-section",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }

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

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(tickerFn);
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
            <Image src={why_pic} alt="Why Pic" className="w-full h-full object-cover" />
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
            <Image src={why_pic} alt="Layout detection" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        {/* Step 2 — image left, card right */}
        <div className="step-row flex gap-8 max-md:flex-col">
          <div className="img-wrapper flex-1">
            <Image src={why_pic} alt="OCR extraction" className="w-full h-full object-cover rounded-2xl" />
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
            <Image src={why_pic} alt="AI evaluation" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>

        {/* Step 4 — image left, card right */}
        <div className="step-row flex gap-8 max-md:flex-col">
          <div className="img-wrapper flex-1">
            <Image src={why_pic} alt="Insights dashboard" className="w-full h-full object-cover rounded-2xl" />
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
            <Image src={why_pic} alt="Why Pic" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* SVG path */}
        <div className="absolute top-[25svh] left-1/2 -translate-x-1/2 w-[90%] h-full -z-10">
          <svg width="1264" height="3529" viewBox="0 0 1264 3529" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              preserveAspectRatio="xMidYMid meet"
              id="stroke-path"
              d="M671.527 75.0171C671.527 75.0171 199.648 187.936 81.6076 550.093C-29.4865 1176.9 1304.03 2066.4 1180.02 831.394C830.864 -54.9091 -659.097 3128.27 643.534 2421.47C1946.17 1714.67 -437.594 2004.54 643.534 3453.02"
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