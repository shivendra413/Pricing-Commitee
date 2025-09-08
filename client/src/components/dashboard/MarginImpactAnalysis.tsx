import { useMemo } from "react";
import { RequestWithCustomer, MarginAnalysis, RiskAssessment } from "@/types/dashboard";
import MarginImpactChart from "@/components/charts/MarginImpactChart";

interface MarginImpactAnalysisProps {
  selectedRequests: RequestWithCustomer[];
}

export default function MarginImpactAnalysis({ selectedRequests }: MarginImpactAnalysisProps) {
  const analysis: MarginAnalysis = useMemo(() => {
    if (selectedRequests.length === 0) {
      return {
        currentLoss: 0,
        currentLossPercent: 0,
        projectedRevenue: 0,
        revenueGrowth: 0,
        breakeven: 0,
        roiImpact: 0,
        paybackPeriod: 0,
      };
    }

    const totalOrderValue = selectedRequests.reduce(
      (sum, request) => sum + parseFloat(request.orderValue), 0
    );
    
    const avgDiscount = selectedRequests.reduce(
      (sum, request) => sum + parseFloat(request.discountPercentage), 0
    ) / selectedRequests.length;

    const currentLoss = totalOrderValue * (avgDiscount / 100);
    const projectedRevenue = totalOrderValue - currentLoss;
    
    return {
      currentLoss,
      currentLossPercent: avgDiscount,
      projectedRevenue,
      revenueGrowth: 15.3, // Mock calculation
      breakeven: 8.5, // Mock calculation
      roiImpact: 12.3, // Mock calculation
      paybackPeriod: 14, // Mock calculation
    };
  }, [selectedRequests]);

  const riskAssessment: RiskAssessment = useMemo(() => {
    // Mock risk assessment based on selected requests
    const avgDiscount = selectedRequests.length > 0 
      ? selectedRequests.reduce((sum, req) => sum + parseFloat(req.discountPercentage), 0) / selectedRequests.length 
      : 0;

    return {
      competitionLevel: Math.min(65, avgDiscount * 4), // Mock calculation
      retentionLevel: Math.max(30, 100 - avgDiscount * 2), // Mock calculation
      volumeImpact: Math.min(85, selectedRequests.length * 20 + 25), // Mock calculation
    };
  }, [selectedRequests]);

  return (
    <div className="bg-card rounded-lg shadow-sm p-4" data-testid="margin-impact-analysis">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fas fa-calculator mr-2 text-purple-600"></i>
        Margin Impact Analysis
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground">Current Margin Loss</div>
            <div className="font-bold text-red-600" data-testid="current-loss">
              OMR {analysis.currentLoss.toLocaleString()}
            </div>
            <div className="text-xs text-red-600" data-testid="current-loss-percent">
              -{analysis.currentLossPercent.toFixed(1)}%
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded text-center">
            <div className="text-xs text-muted-foreground">Projected Revenue</div>
            <div className="font-bold text-green-600" data-testid="projected-revenue">
              OMR {analysis.projectedRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-green-600" data-testid="revenue-growth">
              +{analysis.revenueGrowth}%
            </div>
          </div>
        </div>

        <div className="bg-muted p-3 rounded">
          <h4 className="font-semibold text-xs mb-2">Risk Assessment</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Market Competition Risk</span>
              <div className="flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full" 
                    style={{ width: `${riskAssessment.competitionLevel}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-orange-600" data-testid="competition-risk">
                  {riskAssessment.competitionLevel > 60 ? 'High' : 
                   riskAssessment.competitionLevel > 30 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Customer Retention Risk</span>
              <div className="flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full" 
                    style={{ width: `${100 - riskAssessment.retentionLevel}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-green-600" data-testid="retention-risk">
                  {riskAssessment.retentionLevel > 70 ? 'Low' : 
                   riskAssessment.retentionLevel > 40 ? 'Medium' : 'High'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Volume Impact</span>
              <div className="flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${riskAssessment.volumeImpact}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-blue-600" data-testid="volume-impact">
                  {riskAssessment.volumeImpact > 70 ? 'High' : 
                   riskAssessment.volumeImpact > 40 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <MarginImpactChart analysis={analysis} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-xs text-muted-foreground">Break-even</div>
            <div className="font-semibold text-blue-600" data-testid="breakeven-months">
              {analysis.breakeven} months
            </div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-xs text-muted-foreground">ROI Impact</div>
            <div className="font-semibold text-purple-600" data-testid="roi-impact">
              +{analysis.roiImpact}%
            </div>
          </div>
          <div className="bg-orange-50 p-2 rounded">
            <div className="text-xs text-muted-foreground">Payback</div>
            <div className="font-semibold text-orange-600" data-testid="payback-period">
              {analysis.paybackPeriod} months
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
