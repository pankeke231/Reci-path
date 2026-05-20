/**
 * @typedef {Object} CollectionRoute
 * @property {string} id
 * @property {string} name
 * @property {string} collector_id
 * @property {string} status
 * @property {string|null} scheduled_date
 * @property {Object|null} path_geojson
 * @property {number|null} estimated_distance_km
 * @property {string} created_at
 * @property {string} updated_at
 */

export const ROUTE_STATUS = {
  PLANNED: 'planned',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * @param {Partial<CollectionRoute>} data
 * @returns {CollectionRoute}
 */
export function createRoute(data = {}) {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    collector_id: data.collector_id ?? '',
    status: data.status ?? ROUTE_STATUS.PLANNED,
    scheduled_date: data.scheduled_date ?? null,
    path_geojson: data.path_geojson ?? null,
    estimated_distance_km: data.estimated_distance_km ?? null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? new Date().toISOString(),
  };
}
