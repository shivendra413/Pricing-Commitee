import { 
  type User, type InsertUser, type Customer, type InsertCustomer,
  type DiscountRequest, type InsertDiscountRequest, type UpdateDiscountRequest,
  type RegionalData, type InsertRegionalData,
  type CustomerSalesData, type InsertCustomerSalesData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Customers
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Discount Requests
  getDiscountRequest(id: string): Promise<DiscountRequest | undefined>;
  getAllDiscountRequests(): Promise<DiscountRequest[]>;
  getDiscountRequestsWithFilters(filters: {
    productType?: string;
    region?: string;
    stage?: string;
    minValue?: number;
    maxValue?: number;
  }): Promise<DiscountRequest[]>;
  createDiscountRequest(request: InsertDiscountRequest): Promise<DiscountRequest>;
  updateDiscountRequest(id: string, updates: UpdateDiscountRequest): Promise<DiscountRequest | undefined>;

  // Regional Data
  getRegionalData(region: string): Promise<RegionalData[]>;
  createRegionalData(data: InsertRegionalData): Promise<RegionalData>;

  // Customer Sales Data
  getCustomerSalesData(customerId: string): Promise<CustomerSalesData[]>;
  createCustomerSalesData(data: InsertCustomerSalesData): Promise<CustomerSalesData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private customers: Map<string, Customer>;
  private discountRequests: Map<string, DiscountRequest>;
  private regionalData: Map<string, RegionalData>;
  private customerSalesData: Map<string, CustomerSalesData>;

  constructor() {
    this.users = new Map();
    this.customers = new Map();
    this.discountRequests = new Map();
    this.regionalData = new Map();
    this.customerSalesData = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize customers
    const customers = [
      {
        id: randomUUID(),
        name: "Arabian Steel Co.",
        tier: "Premium",
        avgMonthlySales: "1250000",
        avgDiscount: "9.2",
        salesTrend: "12.0",
        discountTrend: "2.1",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Gulf Metal Industries",
        tier: "Gold",
        avgMonthlySales: "950000",
        avgDiscount: "7.8",
        salesTrend: "8.5",
        discountTrend: "-1.2",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Oman Construction Ltd",
        tier: "Silver",
        avgMonthlySales: "650000",
        avgDiscount: "12.5",
        salesTrend: "15.2",
        discountTrend: "3.8",
        createdAt: new Date(),
      }
    ];

    customers.forEach(customer => this.customers.set(customer.id, customer));

    // Initialize discount requests
    const customerIds = Array.from(this.customers.keys());
    const requests = [
      {
        id: randomUUID(),
        customerId: customerIds[0],
        product: "Wire Rod",
        grade: "A500",
        discountPercentage: "12.5",
        orderValue: "485000",
        stage: "Negotiation",
        priority: "High",
        status: "pending",
        region: "Oman",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        customerId: customerIds[1],
        product: "Rebar",
        grade: "B450",
        discountPercentage: "8.2",
        orderValue: "720000",
        stage: "Ready to Close",
        priority: "Medium",
        status: "pending",
        region: "Oman",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        customerId: customerIds[2],
        product: "Billets",
        grade: "150x150mm",
        discountPercentage: "15.0",
        orderValue: "350000",
        stage: "Inquiry",
        priority: "Low",
        status: "pending",
        region: "Oman",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    requests.forEach(request => this.discountRequests.set(request.id, request));

    // Initialize regional data
    const regionalDataEntries = [
      {
        id: randomUUID(),
        region: "Oman",
        product: "Wire Rod",
        margin: "12.5",
        demand: "High",
        capacityUtilization: "85.0",
        inventoryLevel: "2450",
        inventoryStatus: "Low",
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        region: "Oman",
        product: "Rebar",
        margin: "15.2",
        demand: "Stable",
        capacityUtilization: "92.0",
        inventoryLevel: "8320",
        inventoryStatus: "Optimal",
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        region: "Oman",
        product: "Billets",
        margin: "8.7",
        demand: "Low",
        capacityUtilization: "78.0",
        inventoryLevel: "5100",
        inventoryStatus: "Medium",
        updatedAt: new Date(),
      }
    ];

    regionalDataEntries.forEach(data => this.regionalData.set(data.id, data));

    // Initialize customer sales data
    customerIds.forEach((customerId, index) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const products = ['Wire Rod', 'Rebar', 'Billets'];
      
      months.forEach(month => {
        products.forEach(product => {
          const salesData = {
            id: randomUUID(),
            customerId,
            month,
            product,
            sales: (Math.random() * 200000 + 50000 + index * 100000).toString(),
            createdAt: new Date(),
          };
          this.customerSalesData.set(salesData.id, salesData);
        });
      });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      createdAt: new Date(),
      avgMonthlySales: insertCustomer.avgMonthlySales || null,
      avgDiscount: insertCustomer.avgDiscount || null,
      salesTrend: insertCustomer.salesTrend || null,
      discountTrend: insertCustomer.discountTrend || null
    };
    this.customers.set(id, customer);
    return customer;
  }

  // Discount Request methods
  async getDiscountRequest(id: string): Promise<DiscountRequest | undefined> {
    return this.discountRequests.get(id);
  }

  async getAllDiscountRequests(): Promise<DiscountRequest[]> {
    return Array.from(this.discountRequests.values());
  }

  async getDiscountRequestsWithFilters(filters: {
    productType?: string;
    region?: string;
    stage?: string;
    minValue?: number;
    maxValue?: number;
  }): Promise<DiscountRequest[]> {
    const allRequests = Array.from(this.discountRequests.values());
    
    return allRequests.filter(request => {
      if (filters.productType && filters.productType !== 'All' && request.product !== filters.productType) {
        return false;
      }
      if (filters.region && filters.region !== 'All' && request.region !== filters.region) {
        return false;
      }
      if (filters.stage && filters.stage !== 'All' && request.stage !== filters.stage) {
        return false;
      }
      if (filters.minValue && parseFloat(request.orderValue) < filters.minValue) {
        return false;
      }
      if (filters.maxValue && parseFloat(request.orderValue) > filters.maxValue) {
        return false;
      }
      return true;
    });
  }

  async createDiscountRequest(insertRequest: InsertDiscountRequest): Promise<DiscountRequest> {
    const id = randomUUID();
    const request: DiscountRequest = { 
      ...insertRequest,
      id,
      status: "pending",
      region: insertRequest.region || "Oman",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.discountRequests.set(id, request);
    return request;
  }

  async updateDiscountRequest(id: string, updates: UpdateDiscountRequest): Promise<DiscountRequest | undefined> {
    const request = this.discountRequests.get(id);
    if (!request) return undefined;

    const updatedRequest: DiscountRequest = {
      ...request,
      ...updates,
      updatedAt: new Date()
    };
    
    this.discountRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Regional Data methods
  async getRegionalData(region: string): Promise<RegionalData[]> {
    return Array.from(this.regionalData.values()).filter(data => data.region === region);
  }

  async createRegionalData(insertData: InsertRegionalData): Promise<RegionalData> {
    const id = randomUUID();
    const data: RegionalData = {
      ...insertData,
      id,
      updatedAt: new Date(),
      capacityUtilization: insertData.capacityUtilization || null,
      inventoryLevel: insertData.inventoryLevel || null,
      inventoryStatus: insertData.inventoryStatus || null
    };
    this.regionalData.set(id, data);
    return data;
  }

  // Customer Sales Data methods
  async getCustomerSalesData(customerId: string): Promise<CustomerSalesData[]> {
    return Array.from(this.customerSalesData.values()).filter(data => data.customerId === customerId);
  }

  async createCustomerSalesData(insertData: InsertCustomerSalesData): Promise<CustomerSalesData> {
    const id = randomUUID();
    const data: CustomerSalesData = {
      ...insertData,
      id,
      createdAt: new Date()
    };
    this.customerSalesData.set(id, data);
    return data;
  }
}

export const storage = new MemStorage();
