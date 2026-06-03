export const ORDER_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_ROUTE: "in_route",
  COLLECTED: "collected",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pendiente",
  [ORDER_STATUS.ASSIGNED]: "Asignado",
  [ORDER_STATUS.IN_ROUTE]: "En ruta",
  [ORDER_STATUS.COLLECTED]: "Recolectado",
  [ORDER_STATUS.CANCELLED]: "Cancelado",
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "#F59E0B",
  [ORDER_STATUS.ASSIGNED]: "#3B82F6",
  [ORDER_STATUS.IN_ROUTE]: "#8B5CF6",
  [ORDER_STATUS.COLLECTED]: "#34D399",
  [ORDER_STATUS.CANCELLED]: "#EF4444",
};
