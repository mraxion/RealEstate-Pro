import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { 
  insertPropertySchema, 
  insertLeadSchema, 
  insertAppointmentSchema, 
  insertWorkflowSchema
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.resolve(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.") as any);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes
  const apiRouter = app.route("/api");
  
  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  
  // Properties API
  app.get("/api/properties", async (req: Request, res: Response) => {
    try {
      const properties = await storage.getProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching properties", error });
    }
  });
  
  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Error fetching property", error });
    }
  });
  
  app.post("/api/properties", upload.array("images", 10), async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
      
      // Parse and validate the data
      const propertyData = {
        ...req.body,
        price: parseInt(req.body.price),
        bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : undefined,
        bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : undefined,
        area: req.body.area ? parseInt(req.body.area) : undefined,
        features: req.body.features ? JSON.parse(req.body.features) : [],
        images: imageUrls,
      };
      
      const validatedData = insertPropertySchema.parse(propertyData);
      const property = await storage.createProperty(validatedData);
      
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid property data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating property", error });
      }
    }
  });
  
  app.put("/api/properties/:id", upload.array("newImages", 10), async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      const newImageUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];
      
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Handle existing and new images
      let images = property.images as string[] || [];
      if (req.body.keepImages) {
        const keepImages = Array.isArray(req.body.keepImages) 
          ? req.body.keepImages 
          : [req.body.keepImages];
        images = images.filter(img => keepImages.includes(img));
      }
      
      // Add new uploaded images
      images = [...images, ...newImageUrls];
      
      // Parse and validate the data
      const propertyData = {
        ...req.body,
        price: req.body.price ? parseInt(req.body.price) : property.price,
        bedrooms: req.body.bedrooms ? parseInt(req.body.bedrooms) : property.bedrooms,
        bathrooms: req.body.bathrooms ? parseInt(req.body.bathrooms) : property.bathrooms,
        area: req.body.area ? parseInt(req.body.area) : property.area,
        features: req.body.features ? JSON.parse(req.body.features) : property.features,
        images: images,
      };
      
      delete propertyData.keepImages; // Remove auxiliary field
      
      const updatedProperty = await storage.updateProperty(id, propertyData);
      
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(updatedProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid property data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating property", error });
      }
    }
  });
  
  app.delete("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProperty(id);
      
      if (!success) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting property", error });
    }
  });
  
  // Leads API
  app.get("/api/leads", async (req: Request, res: Response) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Error fetching leads", error });
    }
  });
  
  app.get("/api/leads/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(lead);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lead", error });
    }
  });
  
  app.post("/api/leads", async (req: Request, res: Response) => {
    try {
      const leadData = {
        ...req.body,
        budget: req.body.budget ? parseInt(req.body.budget) : undefined,
        lastContactDate: req.body.lastContactDate ? new Date(req.body.lastContactDate) : undefined
      };
      
      const validatedData = insertLeadSchema.parse(leadData);
      const lead = await storage.createLead(validatedData);
      
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating lead", error });
      }
    }
  });
  
  app.put("/api/leads/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const leadData = {
        ...req.body,
        budget: req.body.budget ? parseInt(req.body.budget) : undefined,
        lastContactDate: req.body.lastContactDate ? new Date(req.body.lastContactDate) : undefined
      };
      
      const updatedLead = await storage.updateLead(id, leadData);
      
      if (!updatedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updatedLead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating lead", error });
      }
    }
  });
  
  app.delete("/api/leads/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting lead", error });
    }
  });
  
  // Appointments API
  app.get("/api/appointments", async (req: Request, res: Response) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments", error });
    }
  });
  
  app.get("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointment", error });
    }
  });
  
  app.post("/api/appointments", async (req: Request, res: Response) => {
    try {
      const appointmentData = {
        ...req.body,
        leadId: parseInt(req.body.leadId),
        propertyId: parseInt(req.body.propertyId),
        date: new Date(req.body.date)
      };
      
      const validatedData = insertAppointmentSchema.parse(appointmentData);
      const appointment = await storage.createAppointment(validatedData);
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating appointment", error });
      }
    }
  });
  
  app.put("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointmentData = {
        ...req.body,
        leadId: req.body.leadId ? parseInt(req.body.leadId) : undefined,
        propertyId: req.body.propertyId ? parseInt(req.body.propertyId) : undefined,
        date: req.body.date ? new Date(req.body.date) : undefined
      };
      
      const updatedAppointment = await storage.updateAppointment(id, appointmentData);
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating appointment", error });
      }
    }
  });
  
  app.delete("/api/appointments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAppointment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting appointment", error });
    }
  });
  
  // Workflows API
  app.get("/api/workflows", async (req: Request, res: Response) => {
    try {
      const workflows = await storage.getWorkflows();
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workflows", error });
    }
  });
  
  app.get("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(id);
      
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ message: "Error fetching workflow", error });
    }
  });
  
  app.post("/api/workflows", async (req: Request, res: Response) => {
    try {
      const workflowData = {
        ...req.body,
        progress: req.body.progress ? parseInt(req.body.progress) : 100
      };
      
      const validatedData = insertWorkflowSchema.parse(workflowData);
      const workflow = await storage.createWorkflow(validatedData);
      
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid workflow data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating workflow", error });
      }
    }
  });
  
  app.put("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const workflowData = {
        ...req.body,
        progress: req.body.progress ? parseInt(req.body.progress) : undefined
      };
      
      const updatedWorkflow = await storage.updateWorkflow(id, workflowData);
      
      if (!updatedWorkflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      res.json(updatedWorkflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid workflow data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating workflow", error });
      }
    }
  });
  
  app.delete("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWorkflow(id);
      
      if (!success) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting workflow", error });
    }
  });
  
  // Activities API
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities", error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
