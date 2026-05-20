export const ROLES = {
  CITIZEN: 'citizen',
  COLLECTOR: 'collector',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [ROLES.CITIZEN]: 'Ciudadano',
  [ROLES.COLLECTOR]: 'Recolector',
  [ROLES.ADMIN]: 'Administrador',
};

export const REGISTERABLE_ROLES = [ROLES.CITIZEN, ROLES.COLLECTOR];
