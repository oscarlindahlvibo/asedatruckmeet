import { z } from "zod";
import { webhookIdempotencyKey } from "./domain-rules";

const pretixConfigSchema = z.object({
  baseUrl: z.string().url(),
  token: z.string().min(1),
  organizer: z.string().min(1),
});

export type PretixConfig = z.infer<typeof pretixConfigSchema>;

export type PretixWebhookPayload = {
  notification_id?: number | string;
  organizer?: string;
  event?: string;
  code?: string;
  action?: string;
  orderposition_id?: number;
  checkin_list?: number;
};

export type PretixOrder = {
  code: string;
  status: string;
  email?: string;
  invoice_address?: { name?: string };
  total?: string;
  currency?: string;
  positions?: Array<{
    id: number;
    item?: number;
    variation?: number;
    item_name?: string;
    admission?: boolean;
    secret?: string;
    checkins?: Array<{ datetime?: string; list?: number }>;
    answers?: Array<{ question?: number; question_identifier?: string; answer?: string; option_identifiers?: string[] }>;
  }>;
};

export type PretixProduct = {
  id: number;
  name?: string | Record<string, string>;
  description?: string | Record<string, string> | null;
  default_price?: string;
  category?: number | null;
  active?: boolean;
  admission?: boolean;
  available?: number | null;
  variations?: Array<{
    id: number;
    value?: string | Record<string, string>;
    default_price?: string;
    active?: boolean;
  }>;
};

export function getPretixConfig() {
  const parsed = pretixConfigSchema.safeParse({
    baseUrl: process.env.PRETIX_BASE_URL,
    token: process.env.PRETIX_API_TOKEN,
    organizer: process.env.PRETIX_ORGANIZER,
  });

  return parsed.success ? parsed.data : null;
}

export class PretixClient {
  private baseUrl: string;
  private token: string;
  private organizer: string;

  constructor(config = getPretixConfig()) {
    if (!config) {
      throw new Error("Pretix is not configured");
    }

    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.token = config.token;
    this.organizer = config.organizer;
  }

  private async request<T>(path: string, init: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${this.token}`,
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Pretix API ${response.status}: ${await response.text()}`);
    }

    return (await response.json()) as T;
  }

  listProducts(eventSlug: string) {
    return this.request(
      `/api/v1/organizers/${this.organizer}/events/${eventSlug}/items/`,
    ) as Promise<{ results: PretixProduct[] }>;
  }

  getOrder(eventSlug: string, orderCode: string) {
    return this.request(
      `/api/v1/organizers/${this.organizer}/events/${eventSlug}/orders/${orderCode}/?expand=positions.item&expand=positions.variation&expand=checkins`,
    ) as Promise<PretixOrder>;
  }

  async downloadOrderTickets(eventSlug: string, orderCode: string, output = "pdf") {
    const response = await fetch(`${this.baseUrl}/api/v1/organizers/${this.organizer}/events/${eventSlug}/orders/${orderCode}/download/${output}/`, {
      headers: { Accept: "application/pdf, application/zip", Authorization: `Token ${this.token}` },
      cache: "no-store",
    });
    return response;
  }

  listOrdersModifiedSince(eventSlug: string, modifiedSince?: string) {
    const query = modifiedSince
      ? `?modified_since=${encodeURIComponent(modifiedSince)}`
      : "";
    return this.request(
      `/api/v1/organizers/${this.organizer}/events/${eventSlug}/orders/${query}`,
    );
  }

  getCheckinListStatus(eventSlug: string, listId: number) {
    return this.request(
      `/api/v1/organizers/${this.organizer}/events/${eventSlug}/checkinlists/${listId}/status/`,
    );
  }

  openPretixUrl(eventSlug: string, orderCode?: string) {
    const eventPath = `${this.baseUrl}/control/event/${this.organizer}/${eventSlug}`;
    return orderCode ? `${eventPath}/orders/${orderCode}/` : eventPath;
  }
}

export function normalizeWebhook(payload: PretixWebhookPayload) {
  return {
    idempotencyKey: webhookIdempotencyKey(payload),
    notificationId:
      payload.notification_id == null
        ? null
        : String(payload.notification_id),
    organizerSlug: payload.organizer ?? null,
    eventSlug: payload.event ?? null,
    orderCode: payload.code ?? null,
    action: payload.action ?? "unknown",
    shouldSyncOrder: Boolean(payload.event && payload.code),
  };
}
