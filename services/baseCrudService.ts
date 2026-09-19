import { supabase } from "../lib/supabase";

type CrudOptions = {
  select?: string;
  filters?: Record<string, string | number | boolean | null | undefined>;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
};
type Payload = Record<string, unknown>;
/**
 * Servicio CRUD genérico reutilizable sobre tablas de Supabase.
 * @param {string} tableName
 */
export function createCrudService(tableName: string) {
  return {
    /**
     * @param {Object} [options]
     * @param {string} [options.select]
     * @param {Object} [options.filters] clave-valor para .eq()
     * @param {string} [options.orderBy]
     * @param {boolean} [options.ascending]
     * @param {number} [options.limit]
     */
    async list({
      select = "*",
      filters = {},
      orderBy = "created_at",
      ascending = false,
      limit,
    }: CrudOptions = {}): Promise<Record<string, unknown>[]> {
      let query = supabase.from(tableName).select(select);

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      query = query.order(orderBy, { ascending });
      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },

    /**
     * @param {string} id
     * @param {string} [select]
     */
    async getById(id: string, select = "*"): Promise<Record<string, unknown> | null> {
      const { data, error } = await supabase
        .from(tableName)
        .select(select)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    /**
     * @param {Object} payload
     * @param {string} [select]
     */
    async create(payload: Payload, select = "*"): Promise<Record<string, unknown>> {
      const { data, error } = await supabase
        .from(tableName)
        .insert(payload)
        .select(select)
        .single();

      if (error) throw error;
      return data;
    },

    /**
     * @param {string} id
     * @param {Object} payload
     * @param {string} [select]
     */
    async update(id: string, payload: Payload, select = "*"): Promise<Record<string, unknown>> {
      const { data, error } = await supabase
        .from(tableName)
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(select)
        .single();

      if (error) throw error;
      return data;
    },

    /**
     * @param {string} id
     */
    async remove(id: string): Promise<boolean> {
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  };
}
