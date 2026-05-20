import { TABLES } from '../constants/tables';
import { ORDER_STATUS } from '../constants/orderStatus';
import { createOrder } from '../models/order';
import { createCrudService } from './baseCrudService';
import { supabase } from './supabase/client';

const crud = createCrudService(TABLES.ORDERS);

const ORDER_SELECT = '*, waste_types ( id, name, code, icon, recyclable )';

export const ordersService = {
  ...crud,

  /**
   * @param {string} citizenId
   */
  async listByCitizen(citizenId) {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select(ORDER_SELECT)
      .eq('citizen_id', citizenId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(createOrder);
  },

  /**
   * @param {string} collectorId
   */
  async listByCollector(collectorId) {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select(ORDER_SELECT)
      .eq('collector_id', collectorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(createOrder);
  },

  /**
   * Pedidos visibles para el recolector: asignados a él + pendientes sin asignar.
   * @param {string} collectorId
   */
  async listForCollector(collectorId) {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select(ORDER_SELECT)
      .or(`collector_id.eq.${collectorId},status.eq.${ORDER_STATUS.PENDING}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data ?? [])
      .filter(
        (row) =>
          row.collector_id === collectorId ||
          (row.status === ORDER_STATUS.PENDING && !row.collector_id),
      )
      .map(createOrder);
  },

  /**
   * @param {string} orderId
   * @param {string} collectorId
   * @param {{ status?: string; notes?: string|null; collector_id?: string }} payload
   */
  async updateByCollector(orderId, collectorId, payload) {
    const data = await crud.update(
      orderId,
      {
        ...payload,
        collector_id: collectorId,
      },
      ORDER_SELECT,
    );
    return createOrder(data);
  },

  /**
   * @param {string} orderId
   * @param {string} collectorId
   * @param {string} responseText
   * @param {string|null} existingNotes
   */
  async completeWithResponse(orderId, collectorId, responseText, existingNotes) {
    const responseLine = `[RESPONSE]:${responseText.trim()}`;
    let notes = existingNotes ?? '';
    if (notes.includes('[RESPONSE]:')) {
      notes = notes.replace(/\[RESPONSE\]:[^\n]*/, responseLine);
    } else {
      notes = notes ? `${responseLine}\n${notes}` : responseLine;
    }

    return this.updateByCollector(orderId, collectorId, {
      status: ORDER_STATUS.COLLECTED,
      notes: notes.trim() || null,
    });
  },

  async listAll() {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select(ORDER_SELECT)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(createOrder);
  },

  /**
   * @param {Object} payload
   */
  async createOrder(payload) {
    const data = await crud.create(
      {
        ...payload,
        status: ORDER_STATUS.PENDING,
      },
      ORDER_SELECT,
    );
    return createOrder(data);
  },

  /**
   * @param {string} orderId
   * @param {string} status
   */
  async updateStatus(orderId, status) {
    return crud.update(orderId, { status }, ORDER_SELECT);
  },

  /**
   * Métricas básicas para dashboard admin.
   */
  async getStats() {
    const { data, error } = await supabase.from(TABLES.ORDERS).select('status');
    if (error) throw error;

    const rows = data ?? [];
    return {
      total: rows.length,
      pending: rows.filter((o) => o.status === ORDER_STATUS.PENDING).length,
      inProgress: rows.filter((o) =>
        [ORDER_STATUS.ASSIGNED, ORDER_STATUS.IN_ROUTE].includes(o.status),
      ).length,
      collected: rows.filter((o) => o.status === ORDER_STATUS.COLLECTED).length,
    };
  },
};
