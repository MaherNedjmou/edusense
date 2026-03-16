"use client"

import { useEffect, useRef } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController
} from "chart.js";

Chart.register(
  ArcElement,
  DoughnutController,
  Tooltip,
  Legend, 
);

interface Props {
  excellent: number;
  good: number;
  average: number;
  weak: number;
}

export default function ScoreDistributionChart({ excellent, good, average, weak }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const chart = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: ["Excellent", "Good", "Average", "Weak"],
        datasets: [
          {
            data: [excellent, good, average, weak],
            backgroundColor: [
              '#10B981', // Sage Emerald
              '#F59E0B', // Amber Gold
              '#334155', // Slate Gray
              '#33415580' // semi-transparent for lowest
            ],
            borderColor: '#334155',
            borderWidth: 1,
          }
        ]
      },
      options: {
        responsive: true,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 850,
          easing: "easeOutBounce"
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#334155",
              usePointStyle: true,
              boxWidth: 10
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const value = context.parsed || 0;
                const sum = context.chart._metasets[context.datasetIndex].total || 1;
                const percent = ((value / sum) * 100).toFixed(1);
                return `${context.label}: ${value} (${percent}%)`;
              }
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [excellent, good, average, weak]);

  return <canvas ref={canvasRef} />;
}
