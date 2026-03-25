"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../UI/Button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);


  return (
    <div className="w-full flex justify-center">
      <nav
        className={`
          fixed z-50 flex items-center justify-between 
          px-4 py-2 rounded-3xl transition-all duration-500 
          ${scrolled
            ? "w-11/12 md:w-9/12 mt-4 bg-background/80 backdrop-blur-xl border shadow-lg"
            : "w-11/12 md:w-10/12 mt-1 bg-background shadow-none"
          }
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => window.location.href = "/"}
        >
          {/* <Image src={logo_icon} alt="Logo Icon" width={40} height={60} className="w-8 h-auto md:w-10" />
          <Image src={logo_name} alt="Logo Name" width={120} height={120} className="w-20 h-auto md:w-28" /> */}
          <span className="text-2xl font-bold text-secondary">EduSense</span>
        </div>

        {/* Desktop Menu items */}
        <ul className="hidden md:flex text-primary gap-8 text-foreground/80 font-medium">
          <Link
            href="/"
            className="cursor-pointer hover:font-semibold transition"
          >
            Home
          </Link>
          <Link
            href="/demo"
            className="cursor-pointer hover:font-semibold transition"
          >
            Demo
          </Link>
          <Link
            href="/pricing"
            className="cursor-pointer hover:font-semibold transition"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="cursor-pointer hover:font-semibold transition"
          >
            Contact
          </Link>
        </ul>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex gap-4">
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Button
              variant="outline"
            >
              Sign In
            </Button>
          </Link>
          <Link
            href="/signup"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Button>
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-primary transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300
          ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden fixed top-0 right-0 h-full w-64 bg-white z-40 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* Mobile Menu Items */}
          <ul className="flex flex-col text-primary gap-6 text-foreground/80 font-medium mb-8">
            <Link
              href="/"
              className="cursor-pointer hover:font-semibold transition py-2 border-b"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="cursor-pointer hover:font-semibold transition py-2 border-b"
            >
              Demo
            </Link>
            <Link
              href="/pricing"
              className="cursor-pointer hover:font-semibold transition py-2 border-b"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="cursor-pointer hover:font-semibold transition py-2 border-b"
            >
              Contact
            </Link>
          </ul>

          {/* Mobile CTA Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
            >
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </Button>
            <Button>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;