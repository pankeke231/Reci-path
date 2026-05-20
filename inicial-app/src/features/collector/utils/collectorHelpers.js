import { ORDER_STATUS } from '../../../constants/orderStatus';
import {
  filterCompletedOrders,
  filterReceivedOrders,
} from '../../admin/utils/collectionHelpers';
import {
  formatHistorySchedule,
  getCollectionAddress,
  getPickupDisplayDate,
  parseOrderNotes,
} from '../../citizen/utils/orderHelpers';
import { formatDate } from '../../../utils/formatters';
import { getProfileDisplayName } from '../../../models/user';

export { filterReceivedOrders, filterCompletedOrders };

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 * @param {string} collectorId
 */
export function filterCollectorCompleted(orders, collectorId) {
  return filterCompletedOrders(orders).filter(
    (o) => o.collector_id === collectorId,
  );
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function calculateCollectorImpactKg(orders) {
  return filterCompletedOrders(orders).reduce(
    (sum, o) => sum + (o.quantity_kg || 0),
    0,
  );
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function isCollectorActiveToday(orders) {
  return filterReceivedOrders(orders).some((o) =>
    [ORDER_STATUS.PENDING, ORDER_STATUS.ASSIGNED, ORDER_STATUS.IN_ROUTE].includes(
      o.status,
    ),
  );
}

/**
 * @param {import('../../../models/order').CollectionOrder[]} orders
 */
export function getNextStop(orders) {
  const active = filterReceivedOrders(orders).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );
  const next = active[0];
  if (!next) return null;

  return {
    address: getCollectionAddress(next),
    time: formatHistorySchedule(getPickupDisplayDate(next)),
  };
}

/**
 * @param {import('../../../models/user').UserProfile|null} citizen
 */
export function getCitizenUsername(citizen) {
  if (!citizen?.email) return '—';
  const local = citizen.email.split('@')[0];
  return `@${local}`;
}

/**
 * @param {import('../../../models/order').CollectionOrder} order
 * @param {import('../../../models/user').UserProfile|null} citizen
 */
export function getCitizenName(order, citizen) {
  return getProfileDisplayName(citizen) || 'Ciudadano S.E.A';
}

/**
 * @param {string|null|undefined} notes
 */
export function parseCollectorResponse(notes) {
  let raw = notes ?? '';
  const responseMatch = raw.match(/\[RESPONSE\]:([^\n]*)/);
  const response = responseMatch?.[1]?.trim() ?? '';
  raw = raw.replace(/\[RESPONSE\]:[^\n]*\n?/, '');
  const parsed = parseOrderNotes(raw);
  return {
    response,
    description: parsed.description,
    pickupDate: parsed.pickupDate,
  };
}

export function formatPickupDateDisplay(pickupDate, fallback) {
  if (pickupDate && /^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) {
    return formatDate(pickupDate);
  }
  return formatDate(fallback);
}

export function buildResponseNotes(existingNotes, responseText) {
  const { description } = parseOrderNotes(existingNotes);
  const responseLine = `[RESPONSE]:${responseText.trim()}`;
  return description ? `${responseLine}\n${description}` : responseLine;
}
