import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { CustomerSalesData } from "@shared/schema";
import { chartOptions } from "@/lib/chartConfig";

interface CustomerGrowthChartProps {
  salesData: CustomerSalesData[];
}

export default function CustomerGrowthChart({ salesData }: CustomerGrowthChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !salesData.length) return;

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Group sales data by month
    const monthlyTotals = salesData.reduce((acc, data) => {
      if (!acc[data.month]) {
        acc[data.month] = 0;
      }
      acc[data.month] += parseFloat(data.sales);
      return acc;
    }, {} as Record<string, number>);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = months.map(month => monthlyTotals[month] || 0);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Monthly Sales (OMR)',
          data: values,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.4,
          fill: false,
        }]
      },
      options: {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          title: {
            display: true,
            text: 'Customer Growth Trend'
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [salesData]);

  return (
    <canvas 
      ref={chartRef} 
      data-testid="customer-growth-chart"
      className="w-full h-full"
    />
  );
}
