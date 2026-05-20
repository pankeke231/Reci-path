/**
 * @typedef {Object} WasteType
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string|null} description
 * @property {string|null} icon
 * @property {boolean} recyclable
 * @property {string} created_at
 */

/**
 * @param {Partial<WasteType>} data
 * @returns {WasteType}
 */
export function createWasteType(data = {}) {
  return {
    id: data.id ?? '',
    name: data.name ?? '',
    code: data.code ?? '',
    description: data.description ?? null,
    icon: data.icon ?? null,
    recyclable: data.recyclable ?? true,
    created_at: data.created_at ?? new Date().toISOString(),
  };
}

/** Tipos por defecto si la tabla aún no tiene datos (desarrollo/demo) */
export const DEFAULT_WASTE_TYPES = [
  { id: 'plastic', name: 'Plástico', code: 'plastic', recyclable: true },
  { id: 'paper', name: 'Papel y cartón', code: 'paper', recyclable: true },
  { id: 'glass', name: 'Vidrio', code: 'glass', recyclable: true },
  { id: 'metal', name: 'Metal', code: 'metal', recyclable: true },
  { id: 'organic', name: 'Orgánico', code: 'organic', recyclable: false },
  { id: 'general', name: 'Residuos mixtos', code: 'general', recyclable: false },
];
