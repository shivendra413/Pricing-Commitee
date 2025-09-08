import { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { CustomerSalesData } from "@shared/schema";
import { pieChartOptions } from "@/lib/chartConfig";

interface ProductWiseChartProps {
  salesData: CustomerSalesData[];
}

export default function ProductWiseChart({ salesData }: ProductWiseChartProps) {
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

    // Group sales data by product
    const productTotals = salesData.reduce((acc, data) => {
      if (!acc[data.product]) {
        acc[data.product] = 0;
      }
      acc[data.product] += parseFloat(data.sales);
      return acc;
    }, {} as Record<string, number>);

    const products = Object.keys(productTotals);
    const values = Object.values(productTotals);
    const colors = ['#3b82f6', '#10b981', '#f59e0b'];

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: products,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, products.length),
          borderWidth: 1,
        }]
      },
      options: {
        ...pieChartOptions,
        plugins: {
          ...pieChartOptions.plugins,
          title: {
            display: true,
            text: 'Product Distribution'
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
      data-testid="product-wise-chart"
      className="w-full h-full"
    />
  );
}
