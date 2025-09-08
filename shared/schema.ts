import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  tier: text("tier").notNull(), // Premium, Gold, Silver
  avgMonthlySales: decimal("avg_monthly_sales", { precision: 12, scale: 2 }),
  avgDiscount: decimal("avg_discount", { precision: 5, scale: 2 }),
  salesTrend: decimal("sales_trend", { precision: 5, scale: 2 }),
  discountTrend: decimal("discount_trend", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const discountRequests = pgTable("discount_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  product: text("product").notNull(), // Wire Rod, Rebar, Billets
  grade: text("grade").notNull(),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).notNull(),
  orderValue: decimal("order_value", { precision: 12, scale: 2 }).notNull(),
  stage: text("stage").notNull(), // Inquiry, Negotiation, Final Review, Ready to Close
  priority: text("priority").notNull(), // High, Medium, Low
  status: text("status").default("pending"), // pending, approved, rejected
  region: text("region").default("Oman"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regionalData = pgTable("regional_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  region: text("region").notNull(),
  product: text("product").notNull(),
  margin: decimal("margin", { precision: 5, scale: 2 }).notNull(),
  demand: text("demand").notNull(), // High, Medium, Low
  capacityUtilization: decimal("capacity_utilization", { precision: 5, scale: 2 }),
  inventoryLevel: decimal("inventory_level", { precision: 10, scale: 2 }),
  inventoryStatus: text("inventory_status"), // Low, Optimal, Medium, High
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customerSalesData = pgTable("customer_sales_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").references(() => customers.id).notNull(),
  month: text("month").notNull(),
  sales: decimal("sales", { precision: 12, scale: 2 }).notNull(),
  product: text("product").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertDiscountRequestSchema = createInsertSchema(discountRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRegionalDataSchema = createInsertSchema(regionalData).omit({
  id: true,
  updatedAt: true,
});

export const insertCustomerSalesDataSchema = createInsertSchema(customerSalesData).omit({
  id: true,
  createdAt: true,
});

// Update schemas
export const updateDiscountRequestSchema = insertDiscountRequestSchema.extend({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
}).partial();

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertDiscountRequest = z.infer<typeof insertDiscountRequestSchema>;
export type DiscountRequest = typeof discountRequests.$inferSelect;
export type UpdateDiscountRequest = z.infer<typeof updateDiscountRequestSchema>;

export type InsertRegionalData = z.infer<typeof insertRegionalDataSchema>;
export type RegionalData = typeof regionalData.$inferSelect;

export type InsertCustomerSalesData = z.infer<typeof insertCustomerSalesDataSchema>;
export type CustomerSalesData = typeof customerSalesData.$inferSelect;
