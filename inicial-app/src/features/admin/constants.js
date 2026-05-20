import { ORDER_STATUS } from '../../constants/orderStatus';

export const COLLECTION_TABS = {
  RECEIVED: 'received',
  COMPLETED: 'completed',
};

export const RECEIVED_STATUSES = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.ASSIGNED,
  ORDER_STATUS.IN_ROUTE,
];

export const COMPLETED_STATUSES = [ORDER_STATUS.COLLECTED];

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
};

export const WASTE_TAG_COLORS = {
  plastic: { bg: '#34D39922', text: '#34D399', label: 'PLÁSTICO / PET' },
  paper: { bg: '#3B82F622', text: '#60A5FA', label: 'PAPEL / CARTÓN' },
  organic: { bg: '#F59E0B22', text: '#FBBF24', label: 'ORGÁNICO' },
  glass: { bg: '#8B5CF622', text: '#A78BFA', label: 'VIDRIO' },
  metal: { bg: '#94A3B822', text: '#CBD5E1', label: 'METAL' },
  general: { bg: '#64748B22', text: '#94A3B8', label: 'MIXTOS' },
};
