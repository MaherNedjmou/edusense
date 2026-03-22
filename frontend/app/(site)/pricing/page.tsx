"use client";

import Button from "@/components/UI/Button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0DZD",
    desc: "Perfect for individuals getting started",
    features: [
      "Upload limited exam papers",
      "Basic OCR extraction",
      "Standard grading",
      "Basic feedback",
    ],
    highlight: false,
  },
  {
    name: "Standard",
    price: "200DZD/mo",
    desc: "For teachers and small classes",
    features: [
      "Higher upload limits",
      "Advanced OCR & structuring",
      "AI feedback generation",
      "Performance insights",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "350DZD/mo",
    desc: "For institutions and large scale use",
    features: [
      "Unlimited uploads",
      "Full pipeline access",
      "Advanced analytics",
      "Priority support",
    ],
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="w-full bg-background py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-semibold text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-foreground/70">
            Choose the plan that fits your needs — from individual teachers to institutions.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 border transition-all ${
                plan.highlight
                  ? "bg-primary text-white border-primary scale-105"
                  : "bg-background border-foreground/10"
              }`}
            >
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.highlight ? "text-white/70" : "text-foreground/70"}`}>
                {plan.desc}
              </p>

              <div className="text-4xl font-bold mb-6">{plan.price}</div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-secondary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

            <Button
              className={`w-full flex items-center justify-center gap-2 font-semibold transition`}
              variant={plan.highlight ? "primary" : "outline"}
            >
              <Link
                href="/"  
                className="w-full flex items-center justify-center gap-2 font-semibold transition"
              >
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Compare Plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-foreground/10 rounded-xl overflow-hidden">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-4 text-left">Features</th>
                  <th className="p-4">Free</th>
                  <th className="p-4">Standard</th>
                  <th className="p-4">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["OCR Extraction", "Basic", "Advanced", "Advanced"],
                  ["AI Feedback", "Limited", "Full", "Full"],
                  ["Analytics", "Basic", "Standard", "Advanced"],
                  ["Upload Limit", "Low", "Medium", "Unlimited"],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-foreground/10">
                    {row.map((cell, idx) => (
                      <td key={idx} className="p-4 text-center text-foreground/80">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Pricing */}
        <div className="bg-primary rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-semibold mb-4">
            Need a Custom Plan?
          </h2>
          <p className="text-white/70 mb-6">
            Contact us for tailored solutions for universities and large institutions.
          </p>
          <Button variant="outline" className="mx-auto">
            <Link
              href="/contact"  
              className="w-full flex items-center justify-center gap-2 font-semibold transition"
            >
              Contact Us
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
