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
import { CHART_DATA } from "@/data/mockData";


export default function StrengthWeaknessChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: CHART_DATA.strengthWeakness.labels,
        datasets: [
          {
            label: "Strength",
            data: CHART_DATA.strengthWeakness.strengths,
            backgroundColor: '#10B981',
            borderColor: '#10B981'
          },
          {
            label: "Weakness",
            data: CHART_DATA.strengthWeakness.weaknesses,
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