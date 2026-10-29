import { supabase } from "../lib/supabase";

export const vehiclesService = {
  /**
   * Publica la ubicación del vehículo del recolector autenticado.
   * La RPC valida las coordenadas y se ejecuta con permisos elevados,
   * porque la política RLS de `vehicles` solo permite UPDATE al admin.
   */
  async updateMyLocation(
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const { error } = await supabase.rpc("actualizar_ubicacion_vehiculo", {
      lat: latitude,
      lng: longitude,
    });

    if (error) throw error;
  },
};
