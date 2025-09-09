import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterControls from "@/components/dashboard/FilterControls";
import RequestList from "@/components/dashboard/RequestList";
import CustomerProfile from "@/components/dashboard/CustomerProfile";
import RegionalContext from "@/components/dashboard/RegionalContext";
import MarginImpactAnalysis from "@/components/dashboard/MarginImpactAnalysis";
import ActionButtons from "@/components/dashboard/ActionButtons";
import { AiChatbot } from "@/components/dashboard/AiChatbot";
import { DashboardFilters, RequestWithCustomer, DashboardStats } from "@/types/dashboard";
import { DiscountRequest, Customer } from "@shared/schema";

// Hardcoded customer data
const HARDCODED_CUSTOMERS: Customer[] = [
  {
    id: "customer-1-arabian-steel",
    name: "Arabian Steel Co.",
    tier: "Premium",
    avgMonthlySales: "1250000",
    avgDiscount: "9.2",
    salesTrend: "12.0",
    discountTrend: "2.1",
    createdAt: new Date('2024-01-01'),
  },
  {
    id: "customer-2-gulf-metal",
    name: "Gulf Metal Industries",
    tier: "Gold",
    avgMonthlySales: "950000",
    avgDiscount: "7.8",
    salesTrend: "8.5",
    discountTrend: "-1.2",
    createdAt: new Date('2024-01-01'),
  },
  {
    id: "customer-3-oman-construction",
    name: "Oman Construction Ltd",
    tier: "Silver",
    avgMonthlySales: "650000",
    avgDiscount: "12.5",
    salesTrend: "15.2",
    discountTrend: "3.8",
    createdAt: new Date('2024-01-01'),
  }
];

// Hardcoded discount requests
const HARDCODED_REQUESTS: DiscountRequest[] = [
  {
    id: "request-1-arabian-wire",
    customerId: "customer-1-arabian-steel",
    product: "Wire Rod",
    grade: "A500",
    discountPercentage: "12.5",
    orderValue: "485000",
    stage: "Negotiation",
    priority: "High",
    status: "pending",
    region: "Oman",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: "request-2-gulf-rebar",
    customerId: "customer-2-gulf-metal",
    product: "Rebar",
    grade: "B450",
    discountPercentage: "8.2",
    orderValue: "720000",
    stage: "Ready to Close",
    priority: "Medium",
    status: "pending",
    region: "Oman",
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: "request-3-oman-billets",
    customerId: "customer-3-oman-construction",
    product: "Billets",
    grade: "150x150mm",
    discountPercentage: "15.0",
    orderValue: "350000",
    stage: "Inquiry",
    priority: "Low",
    status: "pending",
    region: "Oman",
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  }
];

// Hardcoded dashboard stats
const HARDCODED_STATS: DashboardStats = {
  totalRequests: 3,
  pendingRequests: 3,
  totalValue: 1555000,
  approvedRequests: 0,
  rejectedRequests: 0
};

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

  // Use hardcoded data instead of API calls
  const stats = HARDCODED_STATS;
  const customers = HARDCODED_CUSTOMERS;
  const allRequests = HARDCODED_REQUESTS;

  // Apply client-side filtering to hardcoded requests
  const filteredRequests = HARDCODED_REQUESTS.filter(request => {
    if (filters.productType !== 'All' && request.product !== filters.productType) return false;
    if (filters.region !== 'All' && request.region !== filters.region) return false;
    if (filters.stage !== 'All' && request.stage !== filters.stage) return false;
    
    const orderValue = parseFloat(request.orderValue);
    if (orderValue < filters.minValue || orderValue > filters.maxValue) return false;
    
    return true;
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
      setSelectedCustomerId(request.customer.name); // Use name instead of id
    }
  };

  // No loading state needed since we're using hardcoded data

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
          customerId={selectedCustomerId} // Now passing name
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

      {/* AI Chatbot */}
      <AiChatbot 
        selectedRequest={requestsWithCustomers.find(r => selectedRequestIds.includes(r.id))}
        allRequests={requestsWithCustomers}
      />
    </div>
  );
}
