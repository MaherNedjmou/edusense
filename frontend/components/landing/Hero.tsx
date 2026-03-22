"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../UI/Button";
import { useEffect, useRef } from "react";

const GRID = 28;       // spacing between dots (px)
const DOT_R = 1.5;     // base dot radius
const ATTRACT_R = 120; // cursor influence radius
const STRENGTH = 0.28; // how strongly dots move (0–1)
const RETURN = 0.08;   // spring-back speed

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // ── dot grid ──────────────────────────────────────────────────────────
    type Dot = { ox: number; oy: number; x: number; y: number };
    let dots: Dot[] = [];

    function buildGrid() {
      const W = canvas!.width;
      const H = canvas!.height;
      dots = [];
      const cols = Math.ceil(W / GRID) + 1;
      const rows = Math.ceil(H / GRID) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * GRID;
          const oy = r * GRID;
          dots.push({ ox, oy, x: ox, y: oy });
        }
      }
    }

    function resize() {
      const section = canvas!.parentElement!;
      canvas!.width = section.offsetWidth;
      canvas!.height = section.offsetHeight;
      buildGrid();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // ── animation loop ────────────────────────────────────────────────────
    function draw() {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#334155"; // dot color

      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (const d of dots) {
        const dx = mx - d.ox;
        const dy = my - d.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ATTRACT_R) {
          const factor = (1 - dist / ATTRACT_R) * STRENGTH;
          const tx = d.ox + dx * factor;
          const ty = d.oy + dy * factor;
          d.x += (tx - d.x) * 0.2;
          d.y += (ty - d.y) * 0.2;
        } else {
          // spring back to origin
          d.x += (d.ox - d.x) * RETURN;
          d.y += (d.oy - d.y) * RETURN;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    // ── mouse tracking ────────────────────────────────────────────────────
    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onLeave() {
      mouse.current = { x: -9999, y: -9999 };
    }

    canvas.parentElement!.addEventListener("mousemove", onMove);
    canvas.parentElement!.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="w-full py-24 overflow-hidden relative">

      {/* Canvas dot grid — replaces CSS backgroundImage */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Soft vignette overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }} />

      <div className="container mx-auto px-6 flex flex-col items-center text-center gap-10 relative" style={{ zIndex: 2 }}>

        {/* BADGE */}
        <span className="text-primary font-medium tracking-wide uppercase text-sm bg-white px-3 py-1 rounded-lg">
          BUILT FOR THE MODERN EDUCATOR
        </span>

        {/* HEADING */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighttext-foreground max-w-2xl bg-white px-4 py-2 rounded-lg">
            Make sense of your{" "} <br />
          <span className="bg-linear-to-r from-primary to-secondary text-secondary bg-clip-text">
            entire curriculum
          </span>
        </h1>

        {/* SUB-COPY */}
        <p className="text-xl text-foreground/80 max-w-xl bg-white px-4 py-2 rounded-lg">
          Turn articles into insights and exams into understanding.
          EduSense decodes complex documents to help you <strong>extract concepts </strong> 
          and <strong>automate feedback</strong> in seconds.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex gap-4 pt-2">
          <Button>
            <Link href="/signup" className="flex items-center gap-2 text-lg">
              Get Started
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}