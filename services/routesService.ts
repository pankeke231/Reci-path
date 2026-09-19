import { TABLES } from "../constants/tables";
import { createRoute } from "../models/route";
import { createCrudService } from "./baseCrudService";
import { supabase } from "../lib/supabase";
import type { CollectionRoute } from "../models/route";

const crud = createCrudService(TABLES.ROUTES);

const ROUTE_SELECT = "*";

export const routesService = {
  ...crud,

  /**
   * @param {string} collectorId
   */
  async listByCollector(collectorId: string) {
    const { data, error } = await supabase
      .from(TABLES.ROUTES)
      .select(ROUTE_SELECT)
      .eq("collector_id", collectorId)
      .order("scheduled_date", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(createRoute);
  },

  async listAll() {
    const { data, error } = await supabase
      .from(TABLES.ROUTES)
      .select(ROUTE_SELECT)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(createRoute);
  },

  /**
   * Punto de extensión futuro: optimización con Dijkstra / grafos.
   * @param {Array<{latitude: number, longitude: number}>} stops
   */
  async planRoute(stops: Pick<CollectionRoute, "id" | "scheduled_date">[]) {
    // Placeholder: en producción se conectaría a un Edge Function o microservicio
    return {
      algorithm: "placeholder",
      stops,
      message:
        "Optimización de rutas pendiente de implementación (Dijkstra / VRP).",
    };
  },
};
