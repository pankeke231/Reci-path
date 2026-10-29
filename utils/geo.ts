export type GeoPoint = {
  latitude: number;
  longitude: number;
};

/**
 * Construye una geometría EWKT válida para PostGIS.
 * PostGIS usa el orden (longitud, latitud).
 */
export function toEwktPoint({ latitude, longitude }: GeoPoint): string {
  return `SRID=4326;POINT(${longitude} ${latitude})`;
}

/**
 * Distancia aproximada en metros entre dos coordenadas (haversine).
 */
export function distanceInMeters(a: GeoPoint, b: GeoPoint): number {
  const EARTH_RADIUS_M = 6371000;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const deltaLat = toRadians(b.latitude - a.latitude);
  const deltaLng = toRadians(b.longitude - a.longitude);
  const latA = toRadians(a.latitude);
  const latB = toRadians(b.latitude);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(latA) * Math.cos(latB) * Math.sin(deltaLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(haversine));
}
