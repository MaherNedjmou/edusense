"use client";

import React from "react";

type InsightVariant = "success" | "warning" | "info";

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  variant?: InsightVariant;
}

const variantStyles: Record<InsightVariant, {
  iconBg: string;
  iconColor: string;
  accent: string;
  glow: string;
}> = {
  success: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accent: "bg-emerald-400",
    glow: "group-hover:shadow-emerald-100/60",
  },
  warning: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    accent: "bg-amber-400",
    glow: "group-hover:shadow-amber-100/60",
  },
  info: {
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    accent: "bg-sky-400",
    glow: "group-hover:shadow-sky-100/60",
  },
};

export default function InsightCard({
  icon,
  title,
  text,
  variant = "info",
}: InsightCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        group relative bg-white border border-primary/10
        rounded-2xl p-6 shadow-sm
        hover:shadow-xl ${styles.glow}
        transition-all duration-300 ease-out
        hover:-translate-y-1
        overflow-hidden
      `}
    >
      {/* Subtle top-right background circle for depth */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${styles.iconBg}`} />

      {/* Icon */}
      <div className={`relative w-10 h-10 rounded-xl ${styles.iconBg} ${styles.iconColor} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>

      {/* Text */}
      <div className="relative space-y-2">
        <h3 className="font-semibold text-primary text-sm tracking-tight">{title}</h3>
        <p className="text-sm text-primary/50 leading-relaxed">{text}</p>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full ${styles.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
}