import { useQuery } from "@tanstack/react-query";
import { RegionalData } from "@shared/schema";
import DemandSupplyChart from "@/components/charts/DemandSupplyChart";

interface RegionalContextProps {
  region: string;
}

export default function RegionalContext({ region }: RegionalContextProps) {
  const { data: regionalData } = useQuery<RegionalData[]>({
    queryKey: ['/api/regional-data', region],
  });

  const getProductData = (product: string) => {
    return regionalData?.find(data => data.product === product);
  };

  const wireRodData = getProductData("Wire Rod");
  const rebarData = getProductData("Rebar");
  const billetsData = getProductData("Billets");

  const getTrendIcon = (demand: string) => {
    switch (demand) {
      case "High": return "↑";
      case "Stable": return "→";
      case "Low": return "↓";
      default: return "→";
    }
  };

  const getTrendColor = (demand: string) => {
    switch (demand) {
      case "High": return "text-green-600";
      case "Stable": return "text-orange-600";
      case "Low": return "text-red-600";
      default: return "text-orange-600";
    }
  };

  const getInventoryColor = (status?: string) => {
    switch (status) {
      case "Low": return "text-red-600";
      case "Optimal": return "text-green-600";
      case "Medium": return "text-orange-600";
      case "High": return "text-blue-600";
      default: return "text-orange-600";
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-4" data-testid="regional-context">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fas fa-map-marker-alt mr-2 text-red-600"></i>
        {region} Regional Context
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-xs text-muted-foreground">Wire Rod</div>
            <div className="font-semibold text-blue-600" data-testid="wire-rod-margin">
              {wireRodData?.margin || '0'}%
            </div>
            <div className={`text-xs ${getTrendColor(wireRodData?.demand || 'Stable')}`} data-testid="wire-rod-trend">
              {getTrendIcon(wireRodData?.demand || 'Stable')} {wireRodData?.demand || 'Stable'} Demand
            </div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-xs text-muted-foreground">Rebar</div>
            <div className="font-semibold text-green-600" data-testid="rebar-margin">
              {rebarData?.margin || '0'}%
            </div>
            <div className={`text-xs ${getTrendColor(rebarData?.demand || 'Stable')}`} data-testid="rebar-trend">
              {getTrendIcon(rebarData?.demand || 'Stable')} {rebarData?.demand || 'Stable'}
            </div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-xs text-muted-foreground">Billets</div>
            <div className="font-semibold text-purple-600" data-testid="billets-margin">
              {billetsData?.margin || '0'}%
            </div>
            <div className={`text-xs ${getTrendColor(billetsData?.demand || 'Stable')}`} data-testid="billets-trend">
              {getTrendIcon(billetsData?.demand || 'Stable')} {billetsData?.demand || 'Stable'} Demand
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-3 rounded">
          <h4 className="font-semibold text-xs mb-2">Production Pipeline</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Wire Rod Capacity</span>
              <span className="font-semibold text-green-600" data-testid="wire-rod-capacity">
                {wireRodData?.capacityUtilization || '0'}% Utilized
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Rebar Capacity</span>
              <span className="font-semibold text-orange-600" data-testid="rebar-capacity">
                {rebarData?.capacityUtilization || '0'}% Utilized
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Billets Capacity</span>
              <span className="font-semibold text-blue-600" data-testid="billets-capacity">
                {billetsData?.capacityUtilization || '0'}% Utilized
              </span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-3 rounded">
          <h4 className="font-semibold text-xs mb-2">Inventory Levels</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Wire Rod</span>
              <span className={`font-semibold ${getInventoryColor(wireRodData?.inventoryStatus || undefined)}`} data-testid="wire-rod-inventory">
                {wireRodData?.inventoryLevel ? parseFloat(wireRodData.inventoryLevel).toLocaleString() : '0'} MT ({wireRodData?.inventoryStatus || 'N/A'})
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Rebar</span>
              <span className={`font-semibold ${getInventoryColor(rebarData?.inventoryStatus || undefined)}`} data-testid="rebar-inventory">
                {rebarData?.inventoryLevel ? parseFloat(rebarData.inventoryLevel).toLocaleString() : '0'} MT ({rebarData?.inventoryStatus || 'N/A'})
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Billets</span>
              <span className={`font-semibold ${getInventoryColor(billetsData?.inventoryStatus || undefined)}`} data-testid="billets-inventory">
                {billetsData?.inventoryLevel ? parseFloat(billetsData.inventoryLevel).toLocaleString() : '0'} MT ({billetsData?.inventoryStatus || 'N/A'})
              </span>
            </div>
          </div>
        </div>

        <div className="mini-chart">
          <DemandSupplyChart regionalData={regionalData || []} />
        </div>
      </div>
    </div>
  );
}
