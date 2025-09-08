import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { MarginAnalysis } from "@/types/dashboard";
import { chartOptions } from "@/lib/chartConfig";

interface MarginImpactChartProps {
  analysis: MarginAnalysis;
}

export default function MarginImpactChart({ analysis }: MarginImpactChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Mock historical and projected data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historicalMargins = [15.2, 14.8, 16.1, 15.5, 14.9, 15.8, 16.2, 15.4, 14.7, 15.9, 16.3, 15.1];
    const projectedMargins = historicalMargins.map(margin => margin - (analysis.currentLossPercent * 0.1));

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Historical Margin %',
            data: historicalMargins,
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Projected Margin %',
            data: projectedMargins,
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            tension: 0.4,
            fill: false,
            borderDash: [5, 5],
          }
        ]
      },
      options: {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          title: {
            display: true,
            text: 'Margin Impact Trend'
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [analysis]);

  return (
    <canvas 
      ref={chartRef} 
      data-testid="margin-impact-chart"
      className="w-full h-full"
    />
  );
}
