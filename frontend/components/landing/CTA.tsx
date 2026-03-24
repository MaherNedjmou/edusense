import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Button from "../UI/Button";

export default function CTASection() {
  return (
    <section className="w-full bg-background py-24 relative overflow-hidden">

      {/* Soft Background Effects */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6">
        
        <div className="bg-primary rounded-3xl px-10 py-16 text-center relative overflow-hidden">

          {/* Glow effect */}
          <div className="absolute inset-0 bg-secondary/10 blur-2xl opacity-30"></div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Ready to Transform <br />
              <span className="text-secondary">Exam Grading with AI?</span>
            </h2>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">

                <Button>
                    <Link href="/signup" className="flex items-center gap-2 text-lg">
                    Get Started
                    <ArrowRight size={18} />
                    </Link>
                </Button>

                <Button variant="outline">
                    <Link href="/demo" className="flex items-center gap-2 text-lg">
                        View Demo
                    </Link>
                </Button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}