import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { updateDiscountRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all discount requests
  app.get("/api/discount-requests", async (req, res) => {
    try {
      const requests = await storage.getAllDiscountRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discount requests" });
    }
  });

  // Get filtered discount requests
  app.get("/api/discount-requests/filtered", async (req, res) => {
    try {
      const filters = {
        productType: req.query.productType as string,
        region: req.query.region as string,
        stage: req.query.stage as string,
        minValue: req.query.minValue ? parseFloat(req.query.minValue as string) : undefined,
        maxValue: req.query.maxValue ? parseFloat(req.query.maxValue as string) : undefined,
      };
      
      const requests = await storage.getDiscountRequestsWithFilters(filters);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch filtered discount requests" });
    }
  });

  // Get all customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  // Get customer by ID
  app.get("/api/customers/:id", async (req, res) => {
    try {
      const customer = await storage.getCustomer(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  });

  // Get customer sales data
  app.get("/api/customers/:id/sales-data", async (req, res) => {
    try {
      const salesData = await storage.getCustomerSalesData(req.params.id);
      res.json(salesData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer sales data" });
    }
  });

  // Get regional data
  app.get("/api/regional-data/:region", async (req, res) => {
    try {
      const data = await storage.getRegionalData(req.params.region);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regional data" });
    }
  });

  // Update discount request (approve/reject)
  app.patch("/api/discount-requests/:id", async (req, res) => {
    try {
      const updateData = updateDiscountRequestSchema.parse(req.body);
      const updatedRequest = await storage.updateDiscountRequest(req.params.id, updateData);
      
      if (!updatedRequest) {
        return res.status(404).json({ error: "Discount request not found" });
      }
      
      res.json(updatedRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update discount request" });
    }
  });

  // Bulk update discount requests
  app.patch("/api/discount-requests/bulk", async (req, res) => {
    try {
      const { ids, status } = req.body;
      
      if (!Array.isArray(ids) || !status) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      const results = await Promise.all(
        ids.map(id => storage.updateDiscountRequest(id, { status }))
      );

      const successCount = results.filter(result => result !== undefined).length;
      res.json({ 
        message: `Updated ${successCount} out of ${ids.length} requests`,
        updated: results.filter(result => result !== undefined)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to bulk update discount requests" });
    }
  });

  // Dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const requests = await storage.getAllDiscountRequests();
      const totalRequests = requests.length;
      const pendingRequests = requests.filter(r => r.status === "pending");
      const totalValue = pendingRequests.reduce((sum, r) => sum + parseFloat(r.orderValue), 0);
      
      res.json({
        totalRequests,
        pendingRequests: pendingRequests.length,
        totalValue,
        approvedRequests: requests.filter(r => r.status === "approved").length,
        rejectedRequests: requests.filter(r => r.status === "rejected").length,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
