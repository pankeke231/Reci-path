import { supabase } from './supabase/client';
import { TABLES } from '../constants/tables';

/**
 * Suscripción a cambios de pedidos (preparado para WebSockets/Realtime).
 * @param {string} [filterColumn]
 * @param {string} [filterValue]
 * @param {(payload: import('@supabase/supabase-js').RealtimePostgresChangesPayload) => void} callback
 */
export function subscribeToOrders(filterColumn, filterValue, callback) {
  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.ORDERS,
        ...(filterColumn && filterValue
          ? { filter: `${filterColumn}=eq.${filterValue}` }
          : {}),
      },
      callback,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
