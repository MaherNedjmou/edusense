"use client"

import { useEffect, useRef } from "react";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarController
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface Props {
  data: {
    exam: string;
    score: number;
  }[];
}

export default function SubjectPerformanceChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const labels = data.map((d) => d.exam);
    const values = data.map((d) => d.score);

    const chart = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Average Score",
            data: values,
            backgroundColor: "#10B981",
            borderColor: "#334155",
            borderWidth: 1,
            hoverBackgroundColor: "#22c55e",
            hoverBorderColor: "#334155",
            borderRadius: 4,
            maxBarThickness: 36
          }
        ]
      },
      options: {
        responsive: true,
        animation: {
          duration: 900,
          easing: "easeOutQuart"
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { stepSize: 10 }
          },
          x: {
            ticks: { autoSkip: true, maxTicksLimit: 10 }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={canvasRef} />;
}
