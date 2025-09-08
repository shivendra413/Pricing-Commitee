import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { RegionalData } from "@shared/schema";
import { miniChartOptions } from "@/lib/chartConfig";

interface DemandSupplyChartProps {
  regionalData: RegionalData[];
}

export default function DemandSupplyChart({ regionalData }: DemandSupplyChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !regionalData.length) return;

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const products = regionalData.map(data => data.product);
    const capacityData = regionalData.map(data => parseFloat(data.capacityUtilization || '0'));
    const demandData = regionalData.map(data => {
      // Convert demand text to numbers
      switch (data.demand) {
        case 'High': return 90;
        case 'Stable': return 70;
        case 'Low': return 40;
        default: return 50;
      }
    });

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: products,
        datasets: [
          {
            label: 'Capacity %',
            data: capacityData,
            backgroundColor: '#3b82f6',
          },
          {
            label: 'Demand %',
            data: demandData,
            backgroundColor: '#10b981',
          }
        ]
      },
      options: miniChartOptions
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [regionalData]);

  return (
    <canvas 
      ref={chartRef} 
      data-testid="demand-supply-chart"
      className="w-full h-full"
    />
  );
}
