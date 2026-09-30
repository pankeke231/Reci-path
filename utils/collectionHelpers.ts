import {
  COMPLETED_STATUSES,
  RECEIVED_STATUSES,
} from "../constants/admin";
import { formatWeight } from "./formatters";
import {
  formatHistorySchedule,
  getOrderWasteCategories,
  getPickupDisplayDate,
  getWasteLabel,
  parseOrderNotes,
} from "./orderHelpers";
import type { CollectionOrder } from "../models/order";
import { getWasteContainerColor } from "../models/waste";

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
  const categories = getOrderWasteCategories(order.detalles);
  if (categories.length > 0) {
    const labels = categories.map((category) => {
      const categoryColor = getWasteContainerColor(category.color_code);
      return `${categoryColor.name.toUpperCase()} - ${category.name.toUpperCase()}`;
    });
    const firstColor = getWasteContainerColor(categories[0].color_code);
    return {
      bg: `${firstColor.backgroundColor}22`,
      text: firstColor.backgroundColor,
      label: labels.join(" · "),
    };
  }

  const colorCode =
    typeof order.waste_types?.color_code === "string"
      ? order.waste_types.color_code
      : null;
  const wasteName =
    typeof order.waste_types?.name === "string"
      ? order.waste_types.name
      : "Residuo";
  const color = getWasteContainerColor(colorCode);
  return {
    bg: `${color.backgroundColor}22`,
    text: color.backgroundColor,
    label: `${color.name.toUpperCase()} - ${wasteName.toUpperCase()}`,
  };
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
