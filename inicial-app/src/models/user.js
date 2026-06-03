import { ROLES } from "../constants/roles";

/**
 * @typedef {'citizen'|'collector'|'admin'} UserRole
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} email
 * @property {string} document_id
 * @property {string} first_names
 * @property {string} last_names
 * @property {string} full_name
 * @property {UserRole} role
 * @property {string|null} address
 * @property {string|null} phone
 * @property {'active'|'pending'} [account_status]
 * @property {string|null} avatar_url
 * @property {number|null} latitude
 * @property {number|null} longitude
 * @property {string|null} vehicle_type
 * @property {string|null} license_plate
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @param {Partial<UserProfile>} data
 * @returns {UserProfile}
 */
export function createUserProfile(data = {}) {
  const firstNames = data.first_names ?? "";
  const lastNames = data.last_names ?? "";
  const composedName = `${firstNames} ${lastNames}`.trim();

  return {
    id: data.id ?? "",
    email: data.email ?? "",
    document_id: data.document_id ?? "",
    first_names: firstNames,
    last_names: lastNames,
    full_name: data.full_name?.trim() || composedName,
    role: data.role ?? ROLES.CITIZEN,
    address: data.address ?? null,
    phone: data.phone ?? null,
    account_status: data.account_status ?? "active",
    avatar_url: data.avatar_url ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    vehicle_type: data.vehicle_type ?? null,
    license_plate: data.license_plate ?? null,
    created_at: data.created_at ?? new Date().toISOString(),
    updated_at: data.updated_at ?? new Date().toISOString(),
  };
}

/**
 * @param {UserProfile|null|undefined} profile
 */
export function getProfileDisplayName(profile) {
  if (!profile) return "";
  const composed =
    `${profile.first_names ?? ""} ${profile.last_names ?? ""}`.trim();
  return composed || profile.full_name || "";
}

/**
 * @param {UserProfile|null|undefined} profile
 */
export function getProfileFirstName(profile) {
  const name = getProfileDisplayName(profile);
  return name.split(" ")[0] || "";
}

/**
 * @param {UserProfile|null|undefined} profile
 */
export function isAdmin(profile) {
  return profile?.role === ROLES.ADMIN;
}

/**
 * @param {UserProfile|null|undefined} profile
 */
export function isCollector(profile) {
  return profile?.role === ROLES.COLLECTOR;
}

/**
 * @param {UserProfile|null|undefined} profile
 */
export function isCitizen(profile) {
  return profile?.role === ROLES.CITIZEN;
}
