import Stripe from "stripe";
import express from "express";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import type { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// tRPC router for creating checkout sessions
export const stripeRouter = router({
  // Create a Stripe Checkout Session for store orders
  createStoreCheckout: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            description: z.string().optional(),
          })
        ),
        customerEmail: z.string().email().optional(),
        customerName: z.string().optional(),
        origin: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const lineItems = input.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100), // cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: input.customerEmail,
        allow_promotion_codes: true,
        success_url: `${input.origin}/store?payment=success`,
        cancel_url: `${input.origin}/store?payment=cancelled`,
        metadata: {
          customer_name: input.customerName || "",
          source: "store",
        },
      });

      return { url: session.url, sessionId: session.id };
    }),

  // Create a Stripe Checkout Session for invoice payments
  createInvoiceCheckout: publicProcedure
    .input(
      z.object({
        invoiceNumber: z.string(),
        amount: z.number(), // in dollars
        description: z.string(),
        customerEmail: z.string().email().optional(),
        customerName: z.string().optional(),
        origin: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Invoice ${input.invoiceNumber}`,
                description: input.description,
              },
              unit_amount: Math.round(input.amount * 100), // cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: input.customerEmail,
        allow_promotion_codes: true,
        success_url: `${input.origin}/crm?payment=success&invoice=${input.invoiceNumber}`,
        cancel_url: `${input.origin}/crm?payment=cancelled`,
        metadata: {
          invoice_number: input.invoiceNumber,
          customer_name: input.customerName || "",
          source: "invoice",
        },
      });

      return { url: session.url, sessionId: session.id };
    }),
});

// Express webhook handler — must be registered BEFORE express.json()
export function registerStripeWebhook(app: import("express").Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log(`[Stripe] Payment completed for session: ${session.id}`);
          console.log(`[Stripe] Customer: ${session.customer_email}, Amount: $${(session.amount_total || 0) / 100}`);
          console.log(`[Stripe] Source: ${session.metadata?.source}, Invoice: ${session.metadata?.invoice_number || "N/A"}`);
          break;
        }
        case "payment_intent.succeeded": {
          const pi = event.data.object as Stripe.PaymentIntent;
          console.log(`[Stripe] PaymentIntent succeeded: ${pi.id}, Amount: $${pi.amount / 100}`);
          break;
        }
        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    }
  );
}
