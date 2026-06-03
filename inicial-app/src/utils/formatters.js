/**
 * @param {string|Date} date
 */
export function formatDate(date) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * @param {string|Date} date
 */
export function formatDateTime(date) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * @param {number} kg
 */
export function formatWeight(kg) {
  if (!Number.isFinite(kg)) return "—";
  return `${kg.toFixed(1)} kg`;
}

/**
 * @param {string} text
 * @param {number} max
 */
export function truncate(text, max = 80) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
