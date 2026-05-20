import { ORDER_STATUS } from '../../constants/orderStatus';

export const HISTORY_TABS = {
  SENT: 'sent',
  COMPLETED: 'completed',
};

export const CITIZEN_BADGE = {
  [ORDER_STATUS.PENDING]: { label: 'PENDIENTE', tone: 'muted' },
  [ORDER_STATUS.ASSIGNED]: { label: 'PENDIENTE', tone: 'muted' },
  [ORDER_STATUS.IN_ROUTE]: { label: 'EN CURSO', tone: 'active' },
  [ORDER_STATUS.COLLECTED]: { label: 'COMPLETADA', tone: 'success' },
  [ORDER_STATUS.CANCELLED]: { label: 'CANCELADA', tone: 'danger' },
};

export const ACTIVE_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.ASSIGNED,
  ORDER_STATUS.IN_ROUTE,
];

export const COMPLETED_STATUSES = [ORDER_STATUS.COLLECTED];
