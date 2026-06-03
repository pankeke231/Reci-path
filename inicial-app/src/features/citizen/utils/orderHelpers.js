import { ORDER_STATUS } from "../../../constants/orderStatus";
import { ACTIVE_STATUSES, COMPLETED_STATUSES } from "../constants";

const PICKUP_PREFIX = "[PICKUP]:";

/**
 * @param {string} pickupDate ISO o dd/mm/yyyy
 * @param {string} description
 */
export function encodeOrderNotes(pickupDate, description) {
  const desc = description?.trim() ?? "";
  if (!pickupDate) return desc || null;
  return `${PICKUP_PREFIX}${pickupDate}\n${desc}`;
}

/**
 * @param {string|null|undefined} notes
 */
export function parseOrderNotes(notes) {
  if (!notes) return { pickupDate: null, description: "" };
  if (notes.startsWith(PICKUP_PREFIX)) {
    const rest = notes.slice(PICKUP_PREFIX.length);
    const lineBreak = rest.indexOf("\n");
    if (lineBreak === -1) {
      return { pickupDate: rest.trim(), description: "" };
    }
    return {
      pickupDate: rest.slice(0, lineBreak).trim(),
      description: rest.slice(lineBreak + 1).trim(),
    };
  }
  return { pickupDate: null, description: notes };
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function filterActiveOrders(orders) {
  return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function filterCompletedOrders(orders) {
  return orders.filter((o) => COMPLETED_STATUSES.includes(o.status));
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function calculateWeeklyCo2Saved(orders) {
  const collected = filterCompletedOrders(orders);
  const totalKg = collected.reduce((sum, o) => sum + (o.quantity_kg || 0), 0);
  return Math.round(totalKg * 2.4);
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function hasActiveRequests(orders) {
  return filterActiveOrders(orders).length > 0;
}

/**
 * @param {number} quantityKg
 */
export function estimatePoints(quantityKg) {
  return Math.round((quantityKg || 0) * 11);
}

/**
 * @param {string|Date} date
 */
export function formatHistorySchedule(date) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return String(date);

  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  const time = d.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) return `Hoy, ${time}hs`;
  if (isTomorrow) return `Mañana, ${time}hs`;
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * @param {string|Date} date
 */
export function formatCompletedHeader(date) {
  if (!date) return "COMPLETADA";
  const d = typeof date === "string" ? new Date(date) : date;
  const day = d.getDate();
  const month = d
    .toLocaleString("es-CO", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  return `COMPLETADA - ${day} ${month}`;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getWasteLabel(order) {
  return (
    order.waste_types?.name?.toUpperCase() ??
    order.waste_type_id?.toUpperCase() ??
    "RESIDUO"
  );
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getPickupDisplayDate(order) {
  const { pickupDate } = parseOrderNotes(order.notes);
  if (pickupDate) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
      const [y, m, d] = pickupDate.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return pickupDate;
  }
  return order.created_at;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getRecyclerLabel(order) {
  if (order.status !== ORDER_STATUS.COLLECTED) {
    return order.collector_id
      ? "Recolector asignado"
      : "Pendiente de asignación";
  }
  return "Recolector S.E.A";
}
