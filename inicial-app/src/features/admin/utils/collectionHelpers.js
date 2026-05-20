import { COMPLETED_STATUSES, RECEIVED_STATUSES, WASTE_TAG_COLORS } from '../constants';
import { formatWeight } from '../../../utils/formatters';
import {
  formatHistorySchedule,
  getPickupDisplayDate,
  getWasteLabel,
  parseOrderNotes,
} from '../../citizen/utils/orderHelpers';

export function filterReceivedOrders(orders) {
  return orders.filter((o) => RECEIVED_STATUSES.includes(o.status));
}

export function filterCompletedOrders(orders) {
  return orders.filter((o) => COMPLETED_STATUSES.includes(o.status));
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getWasteTagStyle(order) {
  const code = order.waste_types?.code ?? order.waste_type_id ?? 'general';
  return WASTE_TAG_COLORS[code] ?? WASTE_TAG_COLORS.general;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getWasteTagLabel(order) {
  const style = getWasteTagStyle(order);
  return style.label ?? getWasteLabel(order);
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getCompletedTagLabel(order) {
  const base = getWasteTagLabel(order);
  const weight = formatWeight(order.quantity_kg);
  return `${base.replace(' / ', ' & ')} (${weight.replace(' kg', ' KG')})`;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getCollectionAddress(order) {
  return order.address ?? 'Dirección registrada en Cali';
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function getReceivedSchedule(order) {
  return formatHistorySchedule(getPickupDisplayDate(order));
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 */
export function formatCompletedDate(order) {
  const d = new Date(order.updated_at ?? order.created_at);
  return d
    .toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace('.', '')
    .toUpperCase();
}

export { parseOrderNotes, getWasteLabel };
