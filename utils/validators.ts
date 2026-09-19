export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isValidPassword(password: string): boolean {
  return String(password).length >= 6;
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return true;
  return /^\+?[\d\s-]{7,15}$/.test(String(phone).trim());
}

/** Celular obligatorio en registro (mín. 10 dígitos) */
export function isValidCellPhone(phone: string): boolean {
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

/** Cédula / documento de identidad (Colombia: 6–12 dígitos) */
export function isValidDocumentId(documentId: string): boolean {
  const cleaned = String(documentId).replace(/[.\s-]/g, "");
  return /^\d{6,12}$/.test(cleaned);
}

export function normalizeDocumentId(documentId: string): string {
  return String(documentId).replace(/[.\s-]/g, "");
}

export function parsePositiveNumber(value: string | number): number | null {
  const num = parseFloat(String(value).replace(",", "."));
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function parseCoordinates(lat: string, lng: string): { latitude: number; longitude: number } | null {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }
  return { latitude, longitude };
}
