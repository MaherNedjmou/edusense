import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import How from "@/components/landing/How";
import Features from "@/components/landing/Features";
import Why from "@/components/landing/Why";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <section>
      <div id="hero">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="how">
        <How />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="why">
        <Why />
      </div>
      <div id="faq">
        <FAQ />
      </div>
      <div id="cta">
        <CTA />
      </div>
    </section>
  );
}