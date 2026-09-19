import {
  COMPLETED_STATUSES,
  RECEIVED_STATUSES,
  WASTE_TAG_COLORS,
} from "../constants/admin";
import { formatWeight } from "./formatters";
import {
  formatHistorySchedule,
  getPickupDisplayDate,
  getWasteLabel,
  parseOrderNotes,
} from "./orderHelpers";
import type { CollectionOrder } from "../models/order";

export function filterReceivedOrders(orders: CollectionOrder[]): CollectionOrder[] {
  return orders.filter((o) => RECEIVED_STATUSES.includes(o.status));
}

export function filterCompletedOrders(orders: CollectionOrder[]): CollectionOrder[] {
  return orders.filter((o) => COMPLETED_STATUSES.includes(o.status));
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getWasteTagStyle(order: CollectionOrder) {
  const code = order.waste_types?.code ?? order.waste_type_id ?? "general";
  return WASTE_TAG_COLORS[code] ?? WASTE_TAG_COLORS.general;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getWasteTagLabel(order: CollectionOrder): string {
  const style = getWasteTagStyle(order);
  return style.label ?? getWasteLabel(order);
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getCompletedTagLabel(order: CollectionOrder): string {
  const base = getWasteTagLabel(order);
  const weight = formatWeight(order.quantity_kg);
  return `${base.replace(" / ", " & ")} (${weight.replace(" kg", " KG")})`;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getCollectionAddress(order: CollectionOrder): string {
  return order.address ?? "Dirección registrada en Cali";
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getReceivedSchedule(order: CollectionOrder): string {
  return formatHistorySchedule(getPickupDisplayDate(order));
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function formatCompletedDate(order: CollectionOrder): string {
  const d = new Date(order.updated_at ?? order.created_at);
  return d
    .toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(".", "")
    .toUpperCase();
}

export { parseOrderNotes, getWasteLabel };
