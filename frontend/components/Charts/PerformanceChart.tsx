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
import { CHART_DATA } from "@/data/mockData";


export default function PerformanceChart() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: CHART_DATA.performance.labels,
        datasets: [
          {
            data: CHART_DATA.performance.data,
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
  }, []);

  return <canvas ref={chartRef} />;
}