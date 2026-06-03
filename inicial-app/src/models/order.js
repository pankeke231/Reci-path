import { ORDER_STATUS } from "../constants/orderStatus";

/**
 * @typedef {Object} CollectionOrder
 * @property {string} id
 * @property {string} citizen_id
 * @property {string|null} collector_id
 * @property {string|null} route_id
 * @property {string} waste_type_id
 * @property {string} status
 * @property {number} quantity_kg
 * @property {Object|null} detalles
 * @property {number} latitude
 * @property {number} longitude
 * @property {string|null} address
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Object} [waste_types]
 * @property {Object} [profiles]
 */

/**
 * @param {Partial<CollectionOrder>} data
 * @returns {CollectionOrder}
 */
export function createOrder(data = {}) {
  return {
    id: data.id ?? "",
    citizen_id: data.citizen_id ?? "",
    collector_id: data.collector_id ?? null,
    route_id: data.route_id ?? null,
    waste_type_id: data.waste_type_id ?? "",
    status: data.status ?? ORDER_STATUS.PENDING,
    quantity_kg: data.quantity_kg ?? 0,
    detalles: data.detalles ?? null,
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    address: data.address ?? null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? new Date().toISOString(),
    waste_types: data.waste_types,
    profiles: data.profiles,
  };
}

/**
 * @param {string} status
 */
export function canCancelOrder(status) {
  return status === ORDER_STATUS.PENDING || status === ORDER_STATUS.ASSIGNED;
}
