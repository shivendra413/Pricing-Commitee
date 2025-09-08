import { DashboardFilters } from "@/types/dashboard";

interface FilterControlsProps {
  filters: DashboardFilters;
  onFilterChange: (filters: Partial<DashboardFilters>) => void;
}

export default function FilterControls({ filters, onFilterChange }: FilterControlsProps) {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm mb-4" data-testid="filter-controls">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Product Type
          </label>
          <select
            value={filters.productType}
            onChange={(e) => onFilterChange({ productType: e.target.value })}
            className="w-full border border-input rounded px-2 py-1 text-sm bg-background"
            data-testid="filter-product-type"
          >
            <option value="All">All Products</option>
            <option value="Wire Rod">Wire Rod</option>
            <option value="Rebar">Rebar</option>
            <option value="Billets">Billets</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Region
          </label>
          <select
            value={filters.region}
            onChange={(e) => onFilterChange({ region: e.target.value })}
            className="w-full border border-input rounded px-2 py-1 text-sm bg-background"
            data-testid="filter-region"
          >
            <option value="Oman">Oman</option>
            <option value="All">All Regions</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Booking Stage
          </label>
          <select
            value={filters.stage}
            onChange={(e) => onFilterChange({ stage: e.target.value })}
            className="w-full border border-input rounded px-2 py-1 text-sm bg-background"
            data-testid="filter-stage"
          >
            <option value="All">All Stages</option>
            <option value="Inquiry">Inquiry</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Final Review">Final Review</option>
            <option value="Ready to Close">Ready to Close</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Min Order Value (OMR)
          </label>
          <input
            type="range"
            min="0"
            max="1000000"
            value={filters.minValue}
            onChange={(e) => onFilterChange({ minValue: parseInt(e.target.value) })}
            className="w-full accent-primary"
            data-testid="filter-min-value"
          />
          <span className="text-xs text-muted-foreground" data-testid="min-value-display">
            {filters.minValue.toLocaleString()}
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Max Order Value (OMR)
          </label>
          <input
            type="range"
            min="0"
            max="1000000"
            value={filters.maxValue}
            onChange={(e) => onFilterChange({ maxValue: parseInt(e.target.value) })}
            className="w-full accent-primary"
            data-testid="filter-max-value"
          />
          <span className="text-xs text-muted-foreground" data-testid="max-value-display">
            {filters.maxValue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
