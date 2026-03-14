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
import { CHART_DATA } from "@/data/mockData";


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

export default function SubmissionsChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: CHART_DATA.submissions.labels,
        datasets: [
          {
            label: "Submissions",
            data: CHART_DATA.submissions.data,
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
  }, []);

  return <canvas ref={chartRef} />;
}