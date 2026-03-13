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
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function StrengthWeaknessChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: [
          "Concept Understanding",
          "Problem Solving",
          "Method Accuracy",
          "Calculation Errors"
        ],
        datasets: [
          {
            label: "Strength",
            data: [70, 65, 60, 40],
            backgroundColor: '#10B981',
            borderColor: '#10B981'
          },
          {
            label: "Weakness",
            data: [30, 35, 40, 60],
            backgroundColor: '#F59E0B',
            borderColor: '#F59E0B'
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
  }, []);

  return <canvas ref={chartRef} />;
}