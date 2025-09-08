import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterControls from "@/components/dashboard/FilterControls";
import RequestList from "@/components/dashboard/RequestList";
import CustomerProfile from "@/components/dashboard/CustomerProfile";
import RegionalContext from "@/components/dashboard/RegionalContext";
import MarginImpactAnalysis from "@/components/dashboard/MarginImpactAnalysis";
import ActionButtons from "@/components/dashboard/ActionButtons";
import { DashboardFilters, RequestWithCustomer, DashboardStats } from "@/types/dashboard";
import { DiscountRequest, Customer } from "@shared/schema";

export default function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    productType: "All",
    region: "Oman",
    stage: "All",
    minValue: 0,
    maxValue: 1000000,
  });

  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Fetch dashboard stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch all requests
  const { data: allRequests, isLoading: requestsLoading } = useQuery<DiscountRequest[]>({
    queryKey: ['/api/discount-requests'],
  });

  // Fetch all customers
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  // Fetch filtered requests
  const { data: filteredRequests } = useQuery<DiscountRequest[]>({
    queryKey: ['/api/discount-requests/filtered', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.productType !== 'All') params.set('productType', filters.productType);
      if (filters.region !== 'All') params.set('region', filters.region);
      if (filters.stage !== 'All') params.set('stage', filters.stage);
      if (filters.minValue > 0) params.set('minValue', filters.minValue.toString());
      if (filters.maxValue < 1000000) params.set('maxValue', filters.maxValue.toString());
      
      const response = await fetch(`/api/discount-requests/filtered?${params}`);
      if (!response.ok) throw new Error('Failed to fetch filtered requests');
      return response.json();
    },
  });

  // Combine requests with customer data
  const requestsWithCustomers: RequestWithCustomer[] = (filteredRequests || allRequests || []).map(request => ({
    ...request,
    customer: customers?.find(c => c.id === request.customerId)
  }));

  const handleFilterChange = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRequestSelection = (requestId: string) => {
    setSelectedRequestIds(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleRequestSelect = (request: RequestWithCustomer) => {
    if (request.customer) {
      setSelectedCustomerId(request.customer.id);
    }
  };

  if (requestsLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4" data-testid="dashboard-container">
      <DashboardHeader stats={stats} />
      
      <FilterControls 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <div className="dashboard-grid">
        <RequestList
          requests={requestsWithCustomers}
          selectedRequestIds={selectedRequestIds}
          onRequestSelection={handleRequestSelection}
          onRequestSelect={handleRequestSelect}
        />

        <CustomerProfile 
          customerId={selectedCustomerId}
        />

        <RegionalContext 
          region={filters.region}
        />

        <MarginImpactAnalysis 
          selectedRequests={requestsWithCustomers.filter(r => 
            selectedRequestIds.includes(r.id)
          )}
        />

        <ActionButtons
          selectedRequestIds={selectedRequestIds}
          onSelectionClear={() => setSelectedRequestIds([])}
        />
      </div>
    </div>
  );
}
