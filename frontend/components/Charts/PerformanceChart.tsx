"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface PerformanceChartProps {
  data: number[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["0-50", "50-70", "70-85", "85-100"],
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#10B981', // Sage Emerald
              '#F59E0B', // Amber Gold
              '#334155', // Slate Gray
              '#33415580' // semi-transparent for lowest
            ],
            borderColor: '#334155',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        color: '#334155',
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: '#334155'
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [data]);

  return <canvas ref={chartRef} />;
}