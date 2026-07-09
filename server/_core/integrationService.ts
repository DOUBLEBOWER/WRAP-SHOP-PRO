import { TRPCError } from "@trpc/server";
import { ENV } from "./env";

export type PhaseTransitionEvent = {
  dealId: string;
  dealTitle: string;
  customerName: string;
  customerEmail: string;
  previousStage: string;
  newStage: string;
  dueDate: string;
  assignedTo?: string;
  value?: number;
};

export type GoogleCalendarEventPayload = {
  summary: string;
  description: string;
  start_time: string;
  end_time: string;
  attendees?: string[];
  reminders?: number[];
};

/**
 * Map deal stages to calendar event types and descriptions
 */
const getCalendarEventDetails = (event: PhaseTransitionEvent) => {
  const stageMap: Record<string, { title: string; description: string; daysOut: number }> = {
    inquiry: {
      title: `[Inquiry] ${event.dealTitle} - ${event.customerName}`,
      description: `New inquiry received for ${event.dealTitle}.\n\nCustomer: ${event.customerName}\nValue: $${event.value || 0}\n\nAssigned to: ${event.assignedTo || "Unassigned"}`,
      daysOut: 0
    },
    design: {
      title: `[Design] ${event.dealTitle} - ${event.customerName}`,
      description: `Design phase started for ${event.dealTitle}.\n\nCustomer: ${event.customerName}\nValue: $${event.value || 0}\n\nAssigned to: ${event.assignedTo || "Unassigned"}`,
      daysOut: 1
    },
    approval: {
      title: `[Approval] ${event.dealTitle} - ${event.customerName}`,
      description: `Awaiting customer approval for ${event.dealTitle}.\n\nCustomer: ${event.customerName}\nValue: $${event.value || 0}\n\nAssigned to: ${event.assignedTo || "Unassigned"}`,
      daysOut: 2
    },
    production: {
      title: `[Production] ${event.dealTitle} - ${event.customerName}`,
      description: `Production phase for ${event.dealTitle}.\n\nCustomer: ${event.customerName}\nValue: $${event.value || 0}\n\nDue Date: ${event.dueDate}\nAssigned to: ${event.assignedTo || "Unassigned"}`,
      daysOut: 3
    },
    installation: {
      title: `[Installation] ${event.dealTitle} - ${event.customerName}`,
      description: `Installation scheduled for ${event.dealTitle}.\n\nCustomer: ${event.customerName}\nValue: $${event.value || 0}\n\nDue Date: ${event.dueDate}\nAssigned to: ${event.assignedTo || "Unassigned"}`,
      daysOut: 5
    },
    completed: {
      title: `[Completed] ${event.dealTitle} - ${event.customerName}`,
      description: `Job completed: ${event.dealTitle}.\n\nCustomer: ${event.customerName}\nValue: $${event.value || 0}\n\nAssigned to: ${event.assignedTo || "Unassigned"}`,
      daysOut: 0
    }
  };

  return stageMap[event.newStage] || stageMap.inquiry;
};

/**
 * Calculate RFC3339 formatted datetime
 */
const calculateEventTime = (daysOut: number = 0): { start: string; end: string } => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + daysOut);
  startDate.setHours(9, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(10, 0, 0, 0);

  const formatRFC3339 = (date: Date): string => {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
    const isoString = date.toISOString().split(".")[0];
    return `${isoString}${sign}${hours}:${minutes}`;
  };

  return {
    start: formatRFC3339(startDate),
    end: formatRFC3339(endDate)
  };
};

/**
 * Create a Google Calendar event via MCP
 */
export async function createGoogleCalendarEvent(
  event: PhaseTransitionEvent
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const eventDetails = getCalendarEventDetails(event);
    const times = calculateEventTime(eventDetails.daysOut);

    const payload = {
      events: [
        {
          summary: eventDetails.title,
          description: eventDetails.description,
          start_time: times.start,
          end_time: times.end,
          calendar_id: "primary",
          reminders: [15, 60], // Remind 15 min and 1 hour before
          attendees: event.customerEmail ? [event.customerEmail] : []
        }
      ]
    };

    // Call MCP tool via the webdev service
    const response = await fetch(
      new URL(
        "webdevtoken.v1.WebDevService/CallMcp",
        ENV.forgeApiUrl?.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`
      ).toString(),
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "connect-protocol-version": "1",
          authorization: `Bearer ${ENV.forgeApiKey}`,
        },
        body: JSON.stringify({
          server: "google-calendar",
          tool: "google_calendar_create_events",
          input: payload,
        }),
      }
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[Integration] Google Calendar event creation failed: ${detail}`);
      return { success: false, error: `Calendar API error: ${response.statusText}` };
    }

    const result = await response.json();
    console.log("[Integration] Google Calendar event created successfully", result);

    return { success: true, eventId: result?.eventId || "created" };
  } catch (error) {
    console.error("[Integration] Error creating Google Calendar event:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a Gmail notification email
 */
export async function sendGmailNotification(
  event: PhaseTransitionEvent
): Promise<{ success: boolean; error?: string }> {
  try {
    const stageLabel = event.newStage.replace(/_/g, " ").toUpperCase();
    const emailBody = `
Job Update: ${event.dealTitle}

Customer: ${event.customerName}
Previous Stage: ${event.previousStage.replace(/_/g, " ")}
New Stage: ${stageLabel}
Due Date: ${event.dueDate}
Assigned To: ${event.assignedTo || "Unassigned"}
Value: $${event.value || 0}

This is an automated notification from Coast 2 Coast CRM.
    `.trim();

    // Use the Gmail connector via Manus API to send email
    const response = await fetch("https://api.manus.ai/v2/task.create", {
      method: "POST",
      headers: {
        "x-manus-api-key": ENV.manusApiKey || "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Send an email notification to my Gmail inbox with the following details:\n\nSubject: [Coast 2 Coast CRM] Job "${event.dealTitle}" moved to ${stageLabel}\n\nBody:\n${emailBody}`,
        connectors: ["9444d960-ab7e-450f-9cb9-b9467fb0adda"], // Gmail connector UID
        mode: "fast",
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[Integration] Gmail notification failed: ${detail}`);
      return { success: false, error: `Gmail API error: ${response.statusText}` };
    }

    console.log("[Integration] Gmail notification sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[Integration] Error sending Gmail notification:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Handle phase transition: Create calendar event and send email notification
 */
export async function handlePhaseTransition(
  event: PhaseTransitionEvent
): Promise<{ calendarCreated: boolean; emailSent: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Create Google Calendar event
  const calendarResult = await createGoogleCalendarEvent(event);
  if (!calendarResult.success) {
    errors.push(`Calendar: ${calendarResult.error}`);
  }

  // Send Gmail notification
  const emailResult = await sendGmailNotification(event);
  if (!emailResult.success) {
    errors.push(`Email: ${emailResult.error}`);
  }

  return {
    calendarCreated: calendarResult.success,
    emailSent: emailResult.success,
    errors
  };
}
