"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

export default function StudentMiniTrendChart({ trend }: { trend: number[] }) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || !trend.length) return;

    const chart = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: trend.map((_, i) => `E${i + 1}`),
        datasets: [
          {
            data: trend,
            tension: 0.4,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { display: false, min: 0, max: 100 },
          x: { display: false }
        }
      }
    });

    return () => chart.destroy();
  }, [trend]);

  return <canvas ref={chartRef} />;
}
