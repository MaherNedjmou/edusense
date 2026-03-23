import { Brain, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import about_pic from "@/public/images/about_pic.png";

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-background py-24 overflow-hidden">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">

        {/* LEFT — TEXT */}
        <div className="flex-1 space-y-8">

          {/* Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-foreground/70 font-medium tracking-wide uppercase text-sm">
              Why Choose EduSense
            </span>
          </div>

          {/* Title */}
          <h2 className="text-5xl font-semibold leading-tight text-foreground">
            Accurate, Explainable <br />
            <span className="text-secondary">AI-Powered Grading</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-foreground/75 max-w-xl leading-relaxed">
            EduSense combines computer vision and advanced AI models to deliver 
            reliable grading, meaningful feedback, and deep performance insights — 
            helping educators save time while improving evaluation quality.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">

            {/* Feature 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <h3 className="text-xl font-bold text-foreground">
                  High Accuracy
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Advanced OCR and structured evaluation ensure precise grading with minimal errors.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-secondary" />
                <h3 className="text-xl font-bold text-foreground">
                  Explainable Feedback
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                Understand not just the grade, but the reasoning behind it with clear, concept-level insights.
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT — IMAGE */}
        <div className="flex-1 relative">
          {/* Gradient Blobs */}
          <div className="absolute top-0 -right-16 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-16 -left-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 w-full">
            <Image 
              src={about_pic} 
              alt="EduSense AI grading system visualization" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}