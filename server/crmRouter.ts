import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  customers, deals, invoices, inventory, calendarEvents, portfolioItems
} from "../drizzle/schema";

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────

export const crmRouter = router({

  // ── Customers ──
  customers: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(customers);
      return rows.map(r => ({
        ...r,
        totalSpent: Number(r.totalSpent)
      }));
    }),

    create: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        company: z.string().default("Personal Custom"),
        email: z.string().default(""),
        phone: z.string().default(""),
        address: z.string().optional(),
        totalSpent: z.number().default(0),
        notes: z.string().optional(),
        createdAt: z.string()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(customers).values({
          ...input,
          totalSpent: input.totalSpent.toString()
        });
        return { success: true };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string().optional(),
        company: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        totalSpent: z.number().optional(),
        notes: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, totalSpent, ...rest } = input;
        await db.update(customers)
          .set({ ...rest, ...(totalSpent !== undefined ? { totalSpent: totalSpent.toString() } : {}) })
          .where(eq(customers.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(customers).where(eq(customers.id, input.id));
        return { success: true };
      })
  }),

  // ── Deals / Jobs ──
  deals: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(deals);
      return rows.map(r => ({
        ...r,
        value: Number(r.value),
        specs: r.specs as any || {},
        comments: r.comments as any[] || []
      }));
    }),

    create: publicProcedure
      .input(z.object({
        id: z.string(),
        customerId: z.string(),
        title: z.string(),
        serviceType: z.string(),
        value: z.number(),
        stage: z.string().default("inquiry"),
        specs: z.any().optional(),
        dueDate: z.string(),
        notes: z.string().optional(),
        assignedTo: z.string().optional(),
        vinylUsed: z.string().optional(),
        workDetails: z.string().optional(),
        comments: z.any().optional(),
        proofUrl: z.string().optional(),
        proofStatus: z.string().optional(),
        proofNotes: z.string().optional(),
        updatedAt: z.string()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(deals).values({
          ...input,
          value: input.value.toString(),
          specs: input.specs || {},
          comments: input.comments || []
        });
        return { success: true };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.string(),
        customerId: z.string().optional(),
        title: z.string().optional(),
        serviceType: z.string().optional(),
        value: z.number().optional(),
        stage: z.string().optional(),
        specs: z.any().optional(),
        dueDate: z.string().optional(),
        notes: z.string().optional(),
        assignedTo: z.string().optional(),
        vinylUsed: z.string().optional(),
        workDetails: z.string().optional(),
        comments: z.any().optional(),
        proofUrl: z.string().optional(),
        proofStatus: z.string().optional(),
        proofNotes: z.string().optional(),
        updatedAt: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, value, ...rest } = input;
        await db.update(deals)
          .set({ ...rest, ...(value !== undefined ? { value: value.toString() } : {}) })
          .where(eq(deals.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(deals).where(eq(deals.id, input.id));
        return { success: true };
      })
  }),

  // ── Invoices ──
  invoices: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(invoices);
      return rows.map(r => ({
        ...r,
        subtotal: Number(r.subtotal),
        taxRate: Number(r.taxRate),
        taxAmount: Number(r.taxAmount),
        discount: Number(r.discount),
        total: Number(r.total),
        items: r.items as any[] || []
      }));
    }),

    create: publicProcedure
      .input(z.object({
        id: z.string(),
        customerId: z.string(),
        dealId: z.string().optional(),
        invoiceNumber: z.string(),
        type: z.string(),
        status: z.string(),
        items: z.any(),
        subtotal: z.number(),
        taxRate: z.number(),
        taxAmount: z.number(),
        discount: z.number(),
        total: z.number(),
        issueDate: z.string(),
        dueDate: z.string(),
        notes: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(invoices).values({
          ...input,
          subtotal: input.subtotal.toString(),
          taxRate: input.taxRate.toString(),
          taxAmount: input.taxAmount.toString(),
          discount: input.discount.toString(),
          total: input.total.toString()
        });
        return { success: true };
      }),

    updateStatus: publicProcedure
      .input(z.object({ id: z.string(), status: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(invoices).set({ status: input.status }).where(eq(invoices.id, input.id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(invoices).where(eq(invoices.id, input.id));
        return { success: true };
      })
  }),

  // ── Inventory ──
  inventory: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(inventory);
      return rows.map(r => ({
        ...r,
        costPerSqFt: Number(r.costPerSqFt)
      }));
    }),

    create: publicProcedure
      .input(z.object({
        id: z.string(),
        brand: z.string(),
        name: z.string(),
        colorCode: z.string(),
        finish: z.string(),
        sqFtTotal: z.number(),
        sqFtUsed: z.number(),
        sqFtRemaining: z.number(),
        costPerSqFt: z.number(),
        minAlertThreshold: z.number()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(inventory).values({
          ...input,
          costPerSqFt: input.costPerSqFt.toString()
        });
        return { success: true };
      }),

    updateStock: publicProcedure
      .input(z.object({ id: z.string(), sqFtUsed: z.number(), sqFtRemaining: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(inventory)
          .set({ sqFtUsed: input.sqFtUsed, sqFtRemaining: input.sqFtRemaining })
          .where(eq(inventory.id, input.id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(inventory).where(eq(inventory.id, input.id));
        return { success: true };
      })
  }),

  // ── Calendar Events ──
  events: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(calendarEvents);
    }),

    create: publicProcedure
      .input(z.object({
        id: z.string(),
        dealId: z.string(),
        title: z.string(),
        customerName: z.string(),
        type: z.string(),
        start: z.string(),
        end: z.string(),
        assignedTech: z.string(),
        status: z.string()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(calendarEvents).values(input);
        return { success: true };
      }),

    updateStatus: publicProcedure
      .input(z.object({ id: z.string(), status: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(calendarEvents).set({ status: input.status }).where(eq(calendarEvents.id, input.id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(calendarEvents).where(eq(calendarEvents.id, input.id));
        return { success: true };
      })
  }),

  portfolio: router({
    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db.select().from(portfolioItems);
      return rows;
    }),

    create: publicProcedure
      .input(z.object({
        id: z.string(),
        title: z.string(),
        category: z.string(),
        imageUrl: z.string(),
        imageKey: z.string().optional(),
        featured: z.boolean().default(false)
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(portfolioItems).values({
          id: input.id,
          title: input.title,
          category: input.category,
          imageUrl: input.imageUrl,
          imageKey: input.imageKey,
          featured: input.featured
        });
        return { success: true };
      }),

    update: publicProcedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        category: z.string().optional(),
        featured: z.boolean().optional()
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, ...updates } = input;
        await db.update(portfolioItems).set(updates).where(eq(portfolioItems.id, id));
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(portfolioItems).where(eq(portfolioItems.id, input.id));
        return { success: true };
      })
  })
});
