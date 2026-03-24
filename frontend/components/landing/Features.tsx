import { ArrowRight, ScanText, Brain, Layers, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <ScanText className="w-8 h-8" />,
      title: "Smart OCR Extraction",
      description:
        "Accurately extract text, tables, and structured content from scanned exam papers using advanced OCR and layout detection.",
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Structured Answer Modeling",
      description:
        "Convert raw student responses and model solutions into structured formats for precise and explainable evaluation.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Evaluation",
      description:
        "Analyze answers at concept level and generate accurate grading, detailed feedback, and improvement suggestions.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Insights & Analytics",
      description:
        "Track performance trends, identify strengths and weaknesses, and gain actionable insights across students and exams.",
    },
  ];

  return (
    <section className="w-full relative bg-background">

      {/* Top Section */}
      <div className="w-[94%] mx-auto relative bg-primary pt-24 pb-64 overflow-hidden rounded-3xl">
        <div className="px-6 max-w-6xl mx-auto relative z-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">

            <div className="space-y-4">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/70 font-semibold tracking-wide uppercase text-sm">
                  Key Features
                </span>
              </div>

              {/* Title */}
              <h2 className="text-5xl font-semibold text-white leading-tight">
                Powerful AI Tools For <br />
                <span className="text-secondary">Modern Assessment</span>
              </h2>
            </div>
          </div>

        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto relative -mt-48 pb-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((feature, index) => (
            <div key={index} className="relative group">

              <div className="bg-background border border-foreground/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                
                {/* Icon */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="absolute inset-0 w-16 h-16 bg-secondary rounded-full blur-xl opacity-40"></div>
                </div>

                {/* Content */}
                <div className="mt-12 flex-1 flex flex-col text-center">
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-foreground/70 mb-6 flex-1">
                    {feature.description}
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