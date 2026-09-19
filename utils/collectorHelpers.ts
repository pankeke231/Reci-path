import { ORDER_STATUS } from "../constants/orderStatus";
import {
  filterCompletedOrders,
  filterReceivedOrders,
} from "./collectionHelpers";
import {
  formatHistorySchedule,
  getPickupDisplayDate,
  parseOrderNotes,
} from "./orderHelpers";
import { formatDate } from "./formatters";
import { getProfileDisplayName } from "../models/user";
import type { CollectionOrder } from "../models/order";
import type { UserProfile } from "../models/user";

export { filterReceivedOrders, filterCompletedOrders };

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 * @param {string} collectorId
 */

export function filterCollectorCompleted(orders: CollectionOrder[], collectorId: string): CollectionOrder[] {
  return filterCompletedOrders(orders).filter(
    (o) => o.collector_id === collectorId,
  );
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function calculateCollectorImpactKg(orders: CollectionOrder[]): number {
  return filterCompletedOrders(orders).reduce(
    (sum, o) => sum + (o.quantity_kg || 0),
    0,
  );
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function isCollectorActiveToday(orders: CollectionOrder[]): boolean {
  return filterReceivedOrders(orders).some((o) =>
    [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.ASSIGNED,
      ORDER_STATUS.IN_ROUTE,
    ].includes(o.status),
  );
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function getNextStop(orders: CollectionOrder[]): { time: string } | null {
  const active = filterReceivedOrders(orders).sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const next = active[0];
  if (!next) return null;

  return {
    time: formatHistorySchedule(getPickupDisplayDate(next)),
  };
}

/**
 * @param {import('../../../models/user').UserProfile|null} citizen
 */
export function getCitizenUsername(citizen: UserProfile | null): string {
  if (!citizen?.email) return "—";
  const local = citizen.email.split("@")[0];
  return `@${local}`;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 * @param {import('../../../models/user').UserProfile|null} citizen
 */
export function getCitizenName(order: CollectionOrder, citizen: UserProfile | null): string {
  return getProfileDisplayName(citizen) || "Ciudadano S.E.A";
}

/**
 * @param {string|null|undefined} notes
 */
export function parseCollectorResponse(notes: string | null | undefined): { response: string; description: string; pickupDate: string | null } {
  let raw = notes ?? "";
  const responseMatch = raw.match(/\[RESPONSE\]:([^\n]*)/);
  const response = responseMatch?.[1]?.trim() ?? "";
  raw = raw.replace(/\[RESPONSE\]:[^\n]*\n?/, "");
  const parsed = parseOrderNotes(raw);
  return {
    response,
    description: parsed.description,
    pickupDate: parsed.pickupDate,
  };
}

export function formatPickupDateDisplay(pickupDate: string | null, fallback: string | Date): string {
  if (pickupDate && /^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
    return formatDate(pickupDate);
  }
  return formatDate(fallback);
}

export function buildResponseNotes(existingNotes: string | null | undefined, responseText: string): string {
  const { description } = parseOrderNotes(existingNotes);
  const responseLine = `[RESPONSE]:${responseText.trim()}`;
  return description ? `${responseLine}\n${description}` : responseLine;
}
