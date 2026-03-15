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

interface SubmissionsChartProps {
  data: { exam: string; score: number }[];
}

export default function SubmissionsChart({ data }: SubmissionsChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const labels = data.map(d => d.exam);
  const values = data.map(d => d.score);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Score",
            data: values,
            tension: 0.4,
            fill: true,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.3)'
          }
        ]
      },
      options: {
        responsive: true,
        color: '#334155',
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#334155' }
          },
          x: {
            ticks: { color: '#334155' }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data, labels, values]);

  return <canvas ref={chartRef} />;
}