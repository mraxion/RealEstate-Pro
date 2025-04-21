import { 
  users, type User, type InsertUser,
  properties, type Property, type InsertProperty,
  leads, type Lead, type InsertLead,
  appointments, type Appointment, type InsertAppointment,
  workflows, type Workflow, type InsertWorkflow,
  activities, type Activity, type InsertActivity
} from "@shared/schema";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import createMemoryStore from "memorystore";
import { pool, db } from "./db";
import { and, eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property operations
  getProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Lead operations
  getLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: number): Promise<boolean>;
  
  // Appointment operations
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Workflow operations
  getWorkflows(): Promise<Workflow[]>;
  getWorkflow(id: number): Promise<Workflow | undefined>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;
  
  // Activity operations
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Session storage
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private leads: Map<number, Lead>;
  private appointments: Map<number, Appointment>;
  private workflows: Map<number, Workflow>;
  private activities: Map<number, Activity>;
  
  private userId: number;
  private propertyId: number;
  private leadId: number;
  private appointmentId: number;
  private workflowId: number;
  private activityId: number;
  
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.leads = new Map();
    this.appointments = new Map();
    this.workflows = new Map();
    this.activities = new Map();
    
    this.userId = 1;
    this.propertyId = 1;
    this.leadId = 1;
    this.appointmentId = 1;
    this.workflowId = 1;
    this.activityId = 1;

    // Configurar el almacén de sesiones en memoria
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Eliminar sesiones expiradas cada 24h
    });
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      fullName: "Ana García",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    });

    // Add sample workflows
    this.createWorkflow({
      name: "Respuesta automática a leads",
      description: "Envía respuestas automáticas a nuevos leads",
      status: "active",
      progress: 100,
      type: "lead-response"
    });
    
    this.createWorkflow({
      name: "Notificaciones a clientes",
      description: "Envía notificaciones sobre nuevas propiedades a clientes",
      status: "active",
      progress: 100,
      type: "notification"
    });
    
    this.createWorkflow({
      name: "Actualización de precios",
      description: "Actualiza precios basados en el mercado",
      status: "paused",
      progress: 60,
      type: "price-update"
    });
    
    this.createWorkflow({
      name: "Sincronización con portales",
      description: "Sincroniza propiedades con portales inmobiliarios",
      status: "error",
      progress: 30,
      type: "portal-sync"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const now = new Date();
    const property: Property = {
      ...insertProperty,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.properties.set(id, property);
    
    // Create activity log
    await this.createActivity({
      type: "property-created",
      description: `Se añadió ${property.title}`,
      entityId: property.id,
      entityType: "property"
    });
    
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty: Property = {
      ...property,
      ...updateData,
      updatedAt: new Date()
    };
    this.properties.set(id, updatedProperty);
    
    // Create activity log
    await this.createActivity({
      type: "property-updated",
      description: `Se actualizó ${updatedProperty.title}`,
      entityId: updatedProperty.id,
      entityType: "property"
    });
    
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const property = this.properties.get(id);
    if (!property) return false;
    
    const result = this.properties.delete(id);
    
    if (result) {
      // Create activity log
      await this.createActivity({
        type: "property-deleted",
        description: `Se eliminó ${property.title}`,
        entityId: id,
        entityType: "property"
      });
    }
    
    return result;
  }

  // Lead methods
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.leadId++;
    const now = new Date();
    const lead: Lead = {
      ...insertLead,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.leads.set(id, lead);
    
    // Create activity log
    await this.createActivity({
      type: "lead-created",
      description: `Nuevo lead interesado: ${lead.name}`,
      entityId: lead.id,
      entityType: "lead"
    });
    
    return lead;
  }

  async updateLead(id: number, updateData: Partial<InsertLead>): Promise<Lead | undefined> {
    const lead = this.leads.get(id);
    if (!lead) return undefined;
    
    const updatedLead: Lead = {
      ...lead,
      ...updateData,
      updatedAt: new Date()
    };
    this.leads.set(id, updatedLead);
    
    // Create activity log
    await this.createActivity({
      type: "lead-updated",
      description: `Se actualizó la información de ${updatedLead.name}`,
      entityId: updatedLead.id,
      entityType: "lead"
    });
    
    return updatedLead;
  }

  async deleteLead(id: number): Promise<boolean> {
    const lead = this.leads.get(id);
    if (!lead) return false;
    
    const result = this.leads.delete(id);
    
    if (result) {
      // Create activity log
      await this.createActivity({
        type: "lead-deleted",
        description: `Se eliminó el lead ${lead.name}`,
        entityId: id,
        entityType: "lead"
      });
    }
    
    return result;
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const now = new Date();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      createdAt: now
    };
    this.appointments.set(id, appointment);
    
    // Create activity log
    await this.createActivity({
      type: "appointment-created",
      description: `Nueva cita agendada para ${appointment.date.toLocaleDateString()}`,
      entityId: appointment.id,
      entityType: "appointment"
    });
    
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment: Appointment = {
      ...appointment,
      ...updateData
    };
    this.appointments.set(id, updatedAppointment);
    
    // Create activity log
    await this.createActivity({
      type: "appointment-updated",
      description: `Se actualizó la cita para ${updatedAppointment.date.toLocaleDateString()}`,
      entityId: updatedAppointment.id,
      entityType: "appointment"
    });
    
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const appointment = this.appointments.get(id);
    if (!appointment) return false;
    
    const result = this.appointments.delete(id);
    
    if (result) {
      // Create activity log
      await this.createActivity({
        type: "appointment-deleted",
        description: `Se eliminó la cita programada para ${appointment.date.toLocaleDateString()}`,
        entityId: id,
        entityType: "appointment"
      });
    }
    
    return result;
  }

  // Workflow methods
  async getWorkflows(): Promise<Workflow[]> {
    return Array.from(this.workflows.values());
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = this.workflowId++;
    const now = new Date();
    const workflow: Workflow = {
      ...insertWorkflow,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.workflows.set(id, workflow);
    
    // Create activity log
    await this.createActivity({
      type: "workflow-created",
      description: `Se creó el flujo de trabajo: ${workflow.name}`,
      entityId: workflow.id,
      entityType: "workflow"
    });
    
    return workflow;
  }

  async updateWorkflow(id: number, updateData: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;
    
    const updatedWorkflow: Workflow = {
      ...workflow,
      ...updateData,
      updatedAt: new Date()
    };
    this.workflows.set(id, updatedWorkflow);
    
    // Create activity log
    await this.createActivity({
      type: "workflow-updated",
      description: `Se actualizó el flujo de trabajo: ${updatedWorkflow.name}`,
      entityId: updatedWorkflow.id,
      entityType: "workflow"
    });
    
    return updatedWorkflow;
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    const workflow = this.workflows.get(id);
    if (!workflow) return false;
    
    const result = this.workflows.delete(id);
    
    if (result) {
      // Create activity log
      await this.createActivity({
        type: "workflow-deleted",
        description: `Se eliminó el flujo de trabajo: ${workflow.name}`,
        entityId: id,
        entityType: "workflow"
      });
    }
    
    return result;
  }

  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const now = new Date();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: now
    };
    this.activities.set(id, activity);
    return activity;
  }
}

// Implementación de almacenamiento en base de datos PostgreSQL
export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    // Configurar almacén de sesiones en PostgreSQL
    const PgSessionStore = connectPgSimple(session);
    this.sessionStore = new PgSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session' // Nombre de la tabla para las sesiones
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Property methods
  async getProperties(): Promise<Property[]> {
    return db.select().from(properties);
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const now = new Date();
    const propertyData = {
      ...insertProperty,
      createdAt: now,
      updatedAt: now
    };
    
    const [property] = await db.insert(properties).values(propertyData).returning();
    
    // Create activity log
    await this.createActivity({
      type: "property-created",
      description: `Se añadió ${property.title}`,
      entityId: property.id,
      entityType: "property"
    });
    
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    // Obtener la propiedad para comprobar que existe
    const [existingProperty] = await db.select().from(properties).where(eq(properties.id, id));
    if (!existingProperty) return undefined;
    
    const now = new Date();
    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...updateData,
        updatedAt: now
      })
      .where(eq(properties.id, id))
      .returning();
    
    // Create activity log
    await this.createActivity({
      type: "property-updated",
      description: `Se actualizó ${updatedProperty.title}`,
      entityId: updatedProperty.id,
      entityType: "property"
    });
    
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    // Obtener la propiedad para comprobar que existe y para el log
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    if (!property) return false;
    
    const result = await db.delete(properties).where(eq(properties.id, id)).returning();
    
    if (result.length > 0) {
      // Create activity log
      await this.createActivity({
        type: "property-deleted",
        description: `Se eliminó ${property.title}`,
        entityId: id,
        entityType: "property"
      });
      return true;
    }
    
    return false;
  }

  // Lead methods
  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads);
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const now = new Date();
    const leadData = {
      ...insertLead,
      createdAt: now,
      updatedAt: now
    };
    
    const [lead] = await db.insert(leads).values(leadData).returning();
    
    // Create activity log
    await this.createActivity({
      type: "lead-created",
      description: `Nuevo lead interesado: ${lead.name}`,
      entityId: lead.id,
      entityType: "lead"
    });
    
    return lead;
  }

  async updateLead(id: number, updateData: Partial<InsertLead>): Promise<Lead | undefined> {
    // Obtener el lead para comprobar que existe
    const [existingLead] = await db.select().from(leads).where(eq(leads.id, id));
    if (!existingLead) return undefined;
    
    const now = new Date();
    const [updatedLead] = await db
      .update(leads)
      .set({
        ...updateData,
        updatedAt: now
      })
      .where(eq(leads.id, id))
      .returning();
    
    // Create activity log
    await this.createActivity({
      type: "lead-updated",
      description: `Se actualizó la información de ${updatedLead.name}`,
      entityId: updatedLead.id,
      entityType: "lead"
    });
    
    return updatedLead;
  }

  async deleteLead(id: number): Promise<boolean> {
    // Obtener el lead para comprobar que existe y para el log
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    if (!lead) return false;
    
    const result = await db.delete(leads).where(eq(leads.id, id)).returning();
    
    if (result.length > 0) {
      // Create activity log
      await this.createActivity({
        type: "lead-deleted",
        description: `Se eliminó el lead ${lead.name}`,
        entityId: id,
        entityType: "lead"
      });
      return true;
    }
    
    return false;
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const now = new Date();
    const appointmentData = {
      ...insertAppointment,
      createdAt: now
    };
    
    const [appointment] = await db.insert(appointments).values(appointmentData).returning();
    
    // Create activity log
    await this.createActivity({
      type: "appointment-created",
      description: `Nueva cita agendada para ${appointment.date.toLocaleDateString()}`,
      entityId: appointment.id,
      entityType: "appointment"
    });
    
    return appointment;
  }

  async updateAppointment(id: number, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    // Obtener la cita para comprobar que existe
    const [existingAppointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    if (!existingAppointment) return undefined;
    
    const [updatedAppointment] = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, id))
      .returning();
    
    // Create activity log
    await this.createActivity({
      type: "appointment-updated",
      description: `Se actualizó la cita para ${updatedAppointment.date.toLocaleDateString()}`,
      entityId: updatedAppointment.id,
      entityType: "appointment"
    });
    
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    // Obtener la cita para comprobar que existe y para el log
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    if (!appointment) return false;
    
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    
    if (result.length > 0) {
      // Create activity log
      await this.createActivity({
        type: "appointment-deleted",
        description: `Se eliminó la cita programada para ${appointment.date.toLocaleDateString()}`,
        entityId: id,
        entityType: "appointment"
      });
      return true;
    }
    
    return false;
  }

  // Workflow methods
  async getWorkflows(): Promise<Workflow[]> {
    return db.select().from(workflows);
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow;
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const now = new Date();
    const workflowData = {
      ...insertWorkflow,
      createdAt: now,
      updatedAt: now
    };
    
    const [workflow] = await db.insert(workflows).values(workflowData).returning();
    
    // Create activity log
    await this.createActivity({
      type: "workflow-created",
      description: `Se creó el flujo de trabajo: ${workflow.name}`,
      entityId: workflow.id,
      entityType: "workflow"
    });
    
    return workflow;
  }

  async updateWorkflow(id: number, updateData: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    // Obtener el workflow para comprobar que existe
    const [existingWorkflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    if (!existingWorkflow) return undefined;
    
    const now = new Date();
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({
        ...updateData,
        updatedAt: now
      })
      .where(eq(workflows.id, id))
      .returning();
    
    // Create activity log
    await this.createActivity({
      type: "workflow-updated",
      description: `Se actualizó el flujo de trabajo: ${updatedWorkflow.name}`,
      entityId: updatedWorkflow.id,
      entityType: "workflow"
    });
    
    return updatedWorkflow;
  }

  async deleteWorkflow(id: number): Promise<boolean> {
    // Obtener el workflow para comprobar que existe y para el log
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    if (!workflow) return false;
    
    const result = await db.delete(workflows).where(eq(workflows.id, id)).returning();
    
    if (result.length > 0) {
      // Create activity log
      await this.createActivity({
        type: "workflow-deleted",
        description: `Se eliminó el flujo de trabajo: ${workflow.name}`,
        entityId: id,
        entityType: "workflow"
      });
      return true;
    }
    
    return false;
  }

  // Activity methods
  async getActivities(limit?: number): Promise<Activity[]> {
    let query = db
      .select()
      .from(activities)
      .orderBy(desc(activities.createdAt));
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return query;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const now = new Date();
    const activityData = {
      ...insertActivity,
      createdAt: now
    };
    
    const [activity] = await db.insert(activities).values(activityData).returning();
    return activity;
  }
}

// Cambiar esta línea para usar el almacenamiento de PostgreSQL
export const storage = new DatabaseStorage();
