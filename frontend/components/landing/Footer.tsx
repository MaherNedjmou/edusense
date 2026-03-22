"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import logo_icon from "@/public/images/logo_icon.png";

export default function Footer() {
  const date = new Date();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 50;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="w-full relative">

      {/* Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20 md:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#FCFCFB" // soft green (secondary tone)
            d="M0,256L34.3,245.3C68.6,235,137,213,206,213.3C274.3,213,343,235,411,250.7C480,267,549,277,617,240C685.7,203,754,117,823,106.7C891.4,96,960,160,1029,170.7C1097.1,181,1166,139,1234,112C1302.9,85,1371,75,1406,69.3L1440,64L1440,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Content */}
      <div className="bg-primary pt-20">
        <div className="container mx-auto px-6 py-16">

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* <Image src={logo_icon} alt="EduSense Logo" className="w-12 h-12" /> */}
                <h3 className="text-3xl font-semibold text-white">EduSense</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                EduSense automates exam grading using AI, delivering accurate results,
                personalized feedback, and actionable insights for educators and institutions.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { label: "Home", id: "hero" },
                  { label: "Features", id: "features" },
                  { label: "Why EduSense", id: "why" },
                  { label: "FAQ", id: "faq" },
                ].map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-white/70 hover:text-secondary transition text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/70 text-sm">
                  <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>contact@edusense.ai</span>
                </li>
                <li className="flex items-start gap-3 text-white/70 text-sm">
                  <Phone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>+213 XX XX XX XX</span>
                </li>
                <li className="flex items-start gap-3 text-white/70 text-sm">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>Algeria</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/50 text-sm">
              © {date.getFullYear()} EduSense. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}