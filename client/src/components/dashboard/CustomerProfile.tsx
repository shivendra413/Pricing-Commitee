import { useQuery } from "@tanstack/react-query";
import { Customer, CustomerSalesData } from "@shared/schema";
import CustomerGrowthChart from "@/components/charts/CustomerGrowthChart";
import ProductWiseChart from "@/components/charts/ProductWiseChart";

interface CustomerProfileProps {
  customerId: string | null;
}

export default function CustomerProfile({ customerId }: CustomerProfileProps) {
  const { data: customer } = useQuery<Customer>({
    queryKey: ['/api/customers', customerId],
    enabled: !!customerId,
  });

  const { data: salesData } = useQuery<CustomerSalesData[]>({
    queryKey: ['/api/customers', customerId, 'sales-data'],
    enabled: !!customerId,
  });

  if (!customerId || !customer) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-4" data-testid="customer-profile">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <i className="fas fa-user-tie mr-2 text-green-600"></i>
          Customer Profile
        </h3>
        <div className="text-center text-muted-foreground py-8" data-testid="no-customer-selected">
          Select a request to view customer profile
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4" data-testid="customer-profile">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <i className="fas fa-user-tie mr-2 text-green-600"></i>
        Customer Profile
      </h3>
      <div className="space-y-3">
        <div className="border-l-4 border-blue-500 pl-3">
          <div className="text-xs text-muted-foreground">Customer</div>
          <div className="font-semibold" data-testid="customer-name">{customer.name}</div>
          <div className="text-xs text-muted-foreground" data-testid="customer-tier">
            Tier: {customer.tier}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground">Avg Monthly Sales</div>
            <div className="font-semibold text-green-600" data-testid="avg-sales">
              OMR {customer.avgMonthlySales ? parseFloat(customer.avgMonthlySales).toLocaleString() : '0'}
            </div>
            <div className="text-xs text-green-600" data-testid="sales-trend">
              ↗ +{customer.salesTrend || '0'}% YoY
            </div>
          </div>
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground">Avg Discount</div>
            <div className="font-semibold text-orange-600" data-testid="avg-discount">
              {customer.avgDiscount || '0'}%
            </div>
            <div className="text-xs text-orange-600" data-testid="discount-trend">
              ↗ +{customer.discountTrend || '0'}%
            </div>
          </div>
        </div>

        <div className="chart-container">
          <CustomerGrowthChart salesData={salesData || []} />
        </div>

        <div className="small-chart">
          <ProductWiseChart salesData={salesData || []} />
        </div>
      </div>
    </div>
  );
}
