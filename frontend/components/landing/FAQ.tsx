"use client";

import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is EduSense and how does it work?",
      answer:
        "EduSense is an AI-powered assessment system that automates exam grading. It processes scanned exam papers using OCR and layout detection, converts them into structured data, and evaluates student answers against model solutions to generate grades, feedback, and insights."
    },
    {
      question: "How accurate is the grading?",
      answer:
        "EduSense combines advanced OCR, structured answer modeling, and AI evaluation to ensure high accuracy. By analyzing answers at a concept level rather than simple text matching, it delivers reliable and consistent grading results."
    },
    {
      question: "Can EduSense handle handwritten exam papers?",
      answer:
        "Yes. EduSense is designed to work with scanned or photographed exam sheets, including handwritten content. The OCR and preprocessing pipeline enhances readability and extracts relevant information for evaluation."
    },
    {
      question: "What kind of feedback does EduSense generate?",
      answer:
        "EduSense provides detailed, personalized feedback including strengths, weaknesses, and concept-level explanations. This helps students understand their mistakes and improve more effectively."
    },
    {
      question: "Is EduSense scalable for large classes or institutions?",
      answer:
        "Absolutely. EduSense is built to handle large volumes of exam papers efficiently, making it suitable for schools, universities, and training centers looking to automate grading at scale."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="w-full bg-background py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* HEADER */}
        <div className="text-center space-y-6 mb-16">

          {/* Badge */}
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground/70 font-medium tracking-wide uppercase text-sm">
              FAQ
            </span>
          </div>

          {/* Title */}
          <h2 className="text-5xl font-semibold leading-tight text-foreground">
            Frequently Asked <span className="text-secondary">Questions</span>
          </h2>

        </div>

        {/* ACCORDION */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-foreground/60 rounded-xl overflow-hidden bg-background hover:border-secondary/40 transition-colors"
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-foreground/5 transition-colors"
              >
                <span className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 pt-2">
                  <p className="text-foreground/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}