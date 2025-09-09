import { Customer, CustomerSalesData } from "@shared/schema";
import CustomerGrowthChart from "@/components/charts/CustomerGrowthChart";
import ProductWiseChart from "@/components/charts/ProductWiseChart";

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

// Hardcoded customer sales data
const generateHardcodedSalesData = (customerId: string): CustomerSalesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const products = ['Wire Rod', 'Rebar', 'Billets'];
  const salesData: CustomerSalesData[] = [];
  
  const customerIndex = HARDCODED_CUSTOMERS.findIndex(c => c.id === customerId);
  if (customerIndex === -1) return [];
  
  months.forEach(month => {
    products.forEach(product => {
      salesData.push({
        id: `sales-${customerId}-${month}-${product}`.toLowerCase().replace(/\s+/g, '-'),
        customerId,
        month,
        product,
        sales: (Math.random() * 200000 + 50000 + customerIndex * 100000).toString(),
        createdAt: new Date('2024-01-01'),
      });
    });
  });
  
  return salesData;
};

interface CustomerProfileProps {
  customerId: string | null;
}

export default function CustomerProfile({ customerId }: CustomerProfileProps) {
  // Use hardcoded data instead of API calls
  const customer = customerId
    ? HARDCODED_CUSTOMERS.find(c => c.id === customerId || c.name === customerId)
    : null;
  const salesData = customer
    ? generateHardcodedSalesData(customer.id)
    : [];

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
