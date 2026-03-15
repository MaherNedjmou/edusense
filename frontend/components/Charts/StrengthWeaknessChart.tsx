"use client";

import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  Tooltip,
  Legend
);

interface StrengthWeaknessChartProps {
  pass: number;
  fail: number;
}

export default function StrengthWeaknessChart({ pass, fail }: StrengthWeaknessChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Pass", "Fail/Needs Improvement"],
        datasets: [
          {
            label: "Students",
            data: [pass, fail],
            backgroundColor: ['#10B981', '#F59E0B'],
            borderColor: ['#10B981', '#F59E0B']
          }
        ]
      },
      options: {
        responsive: true,
        color: '#334155',
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: '#334155' }
          }
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
  }, [pass, fail]);

  return <canvas ref={chartRef} />;
}