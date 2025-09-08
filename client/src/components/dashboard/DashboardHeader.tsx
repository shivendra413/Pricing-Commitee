import { DashboardStats } from "@/types/dashboard";

interface DashboardHeaderProps {
  stats?: DashboardStats;
}

export default function DashboardHeader({ stats }: DashboardHeaderProps) {
  return (
    <div className="steel-gradient text-primary-foreground p-4 rounded-lg mb-4" data-testid="dashboard-header">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center" data-testid="dashboard-title">
            <i className="fas fa-industry mr-3"></i>
            Steel Products Pricing Committee Dashboard
          </h1>
          <p className="text-primary-foreground/70" data-testid="dashboard-subtitle">
            Discount Request Evaluation System - Oman Region
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold" data-testid="total-requests">
            Total Requests: {stats?.totalRequests || 0}
          </div>
          <div className="text-sm" data-testid="pending-value">
            Pending Value: OMR {stats?.totalValue?.toLocaleString() || '0'}
          </div>
        </div>
      </div>
    </div>
  );
}
