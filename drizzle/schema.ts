import {
  int, mysqlEnum, mysqlTable, text, timestamp,
  varchar, decimal, boolean, json
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── CRM: Customers ────────────────────────────────────────────────────────
export const customers = mysqlTable("customers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull().default("Personal Custom"),
  email: varchar("email", { length: 320 }).notNull().default(""),
  phone: varchar("phone", { length: 64 }).notNull().default(""),
  address: text("address"),
  totalSpent: decimal("totalSpent", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  createdAt: varchar("createdAt", { length: 32 }).notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// ─── CRM: Deals / Jobs ─────────────────────────────────────────────────────
export const deals = mysqlTable("deals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  customerId: varchar("customerId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  serviceType: varchar("serviceType", { length: 64 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull().default("0"),
  stage: varchar("stage", { length: 32 }).notNull().default("inquiry"),
  specs: json("specs"),
  dueDate: varchar("dueDate", { length: 32 }).notNull().default(""),
  notes: text("notes"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  vinylUsed: varchar("vinylUsed", { length: 255 }),
  workDetails: text("workDetails"),
  comments: json("comments"),
  proofUrl: text("proofUrl"),
  proofStatus: varchar("proofStatus", { length: 32 }),
  proofNotes: text("proofNotes"),
  updatedAt: varchar("updatedAt", { length: 32 }).notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

// ─── CRM: Invoices ─────────────────────────────────────────────────────────
export const invoices = mysqlTable("invoices", {
  id: varchar("id", { length: 64 }).primaryKey(),
  customerId: varchar("customerId", { length: 64 }).notNull(),
  dealId: varchar("dealId", { length: 64 }),
  invoiceNumber: varchar("invoiceNumber", { length: 64 }).notNull(),
  type: varchar("type", { length: 16 }).notNull().default("invoice"),
  status: varchar("status", { length: 32 }).notNull().default("draft"),
  items: json("items").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull().default("0"),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).notNull().default("8.5"),
  taxAmount: decimal("taxAmount", { precision: 10, scale: 2 }).notNull().default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull().default("0"),
  issueDate: varchar("issueDate", { length: 32 }).notNull(),
  dueDate: varchar("dueDate", { length: 32 }).notNull(),
  notes: text("notes"),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// ─── CRM: Inventory ────────────────────────────────────────────────────────
export const inventory = mysqlTable("inventory", {
  id: varchar("id", { length: 64 }).primaryKey(),
  brand: varchar("brand", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  colorCode: varchar("colorCode", { length: 16 }).notNull().default("#000000"),
  finish: varchar("finish", { length: 32 }).notNull().default("Gloss"),
  sqFtTotal: int("sqFtTotal").notNull().default(0),
  sqFtUsed: int("sqFtUsed").notNull().default(0),
  sqFtRemaining: int("sqFtRemaining").notNull().default(0),
  costPerSqFt: decimal("costPerSqFt", { precision: 8, scale: 2 }).notNull().default("0"),
  minAlertThreshold: int("minAlertThreshold").notNull().default(50),
});

export type InventoryItem = typeof inventory.$inferSelect;
export type InsertInventoryItem = typeof inventory.$inferInsert;

// ─── CRM: Calendar Events ──────────────────────────────────────────────────
export const calendarEvents = mysqlTable("calendar_events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  dealId: varchar("dealId", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  customerName: varchar("customerName", { length: 255 }).notNull().default(""),
  type: varchar("type", { length: 32 }).notNull().default("installation"),
  start: varchar("start", { length: 32 }).notNull(),
  end: varchar("end", { length: 32 }).notNull(),
  assignedTech: varchar("assignedTech", { length: 255 }).notNull().default(""),
  status: varchar("status", { length: 32 }).notNull().default("scheduled"),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

// ─── Portfolio: Gallery Items ──────────────────────────────────────────────
export const portfolioItems = mysqlTable("portfolio_items", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  imageUrl: text("imageUrl").notNull(), // S3 URL or remote URL
  imageKey: varchar("imageKey", { length: 255 }), // S3 storage key for deletion
  featured: boolean("featured").notNull().default(false),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = typeof portfolioItems.$inferInsert;


// ─── Design Approvals: Simple Workflow ───────────────────────────────────────
export const designApprovals = mysqlTable("design_approvals", {
  id: varchar("id", { length: 64 }).primaryKey(),
  dealId: varchar("dealId", { length: 64 }).notNull(),
  designImageUrl: text("designImageUrl").notNull(),
  designName: varchar("designName", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "revisions_requested"]).notNull().default("pending"),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  approvalToken: varchar("approvalToken", { length: 255 }).notNull().unique(),
  feedback: text("feedback"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DesignApproval = typeof designApprovals.$inferSelect;
export type InsertDesignApproval = typeof designApprovals.$inferInsert;


// ─── Team Members ────────────────────────────────────────────────────────────
export const teamMembers = mysqlTable("team_members", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 64 }).notNull(),
  pin: varchar("pin", { length: 64 }).notNull(),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
