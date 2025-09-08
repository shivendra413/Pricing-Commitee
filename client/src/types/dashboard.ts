import { DiscountRequest, Customer, RegionalData, CustomerSalesData } from "@shared/schema";

export interface DashboardFilters {
  productType: string;
  region: string;
  stage: string;
  minValue: number;
  maxValue: number;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  totalValue: number;
  approvedRequests: number;
  rejectedRequests: number;
}

export interface RequestWithCustomer extends DiscountRequest {
  customer?: Customer;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface RiskAssessment {
  competitionLevel: number;
  retentionLevel: number;
  volumeImpact: number;
}

export interface MarginAnalysis {
  currentLoss: number;
  currentLossPercent: number;
  projectedRevenue: number;
  revenueGrowth: number;
  breakeven: number;
  roiImpact: number;
  paybackPeriod: number;
}
