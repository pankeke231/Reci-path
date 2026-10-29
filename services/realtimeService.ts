import { supabase } from "../lib/supabase";
import { TABLES } from "../constants/tables";

export type RealtimeStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type RealtimeChangeCallback = (payload: unknown) => void;

/**
 * Suscripción a cambios de pedidos (preparado para WebSockets/Realtime).
 * @param {string} [filterColumn]
 * @param {string} [filterValue]
 * @param {(payload: unknown) => void} callback
 */
export function subscribeToOrders(
  filterColumn: string | undefined,
  filterValue: string | undefined,
  callback: RealtimeChangeCallback,
) {
  const channel = supabase
    .channel(
      `orders-realtime-${filterColumn ?? "all"}-${filterValue ?? "all"}`,
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
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

/**
 * Suscripción conjunta a pedidos y vehículos.
 * Se usa como "señal": al recibir cualquier evento se vuelven a ejecutar
 * las RPC del mapa, evitando parsear la geometría (WKB) del payload.
 *
 * @param {(payload: unknown) => void} onChange
 * @param {(status: RealtimeStatus) => void} [onStatus]
 */
export function subscribeToMapChanges(
  onChange: RealtimeChangeCallback,
  onStatus?: (status: RealtimeStatus) => void,
) {
  const channel = supabase
    .channel("map-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLES.ORDERS },
      onChange,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: TABLES.VEHICLES },
      onChange,
    )
    .subscribe((status) => {
      if (!onStatus) return;

      if (status === "SUBSCRIBED") {
        onStatus("connected");
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        onStatus("error");
      } else if (status === "CLOSED") {
        onStatus("disconnected");
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
