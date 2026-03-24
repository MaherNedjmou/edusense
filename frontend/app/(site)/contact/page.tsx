"use client";

import Button from "@/components/UI/Button";
import { Mail, Phone, MapPin  } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="w-full bg-background text-foreground py-24">
      <div className="max-w-6xl mx-auto px-6">

      {/* HERO */}
      <section className="px-6 text-center max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            < Mail className="w-5 h-5 text-white" />
          </div>
          <span className="uppercase text-sm tracking-wide text-foreground/70">
            Contact Us
          </span>
        </div>

        <h1 className="text-5xl font-semibold">
          Get in Touch with <span className="text-secondary">EduSense</span>
        </h1>
        <p className="text-foreground/70 text-lg">
          Have questions, need a custom plan, or want a demo? Reach out to our team
          and we’ll get back to you promptly.
        </p>
      </section>


      {/* Contact Form & Info */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
          <form className="space-y-6">

            <div className="flex flex-col">
              <label htmlFor="name" className="text-foreground/70 mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-foreground/70 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-foreground/70 mb-2">Message</label>
              <textarea
                id="message"
                placeholder="Write your message here..."
                rows={6}
                className="border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              className="w-full"
            >
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col justify-center space-y-8">

          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-secondary mt-1 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Location</h4>
              <p className="text-foreground/70">Constantine, Algeria</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-secondary mt-1 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Email</h4>
              <p className="text-foreground/70">contact@edusense.ai</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="w-6 h-6 text-secondary mt-1 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Phone</h4>
              <p className="text-foreground/70">+213 XX XX XX XX</p>
            </div>
          </div>


        </div>

      </section>

      </div>
    </main>
  );
}