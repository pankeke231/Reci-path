import { createClient } from "@supabase/supabase-js";
import { ENV } from "../config/env";
import { TABLES } from "../constants/tables";
import { ROLES } from "../constants/roles";
import { createUserProfile } from "../models/user";
import { normalizeDocumentId } from "../utils/validators";
import { supabase } from "../lib/supabase";
import type { UserProfile } from "../models/user";
type CollectorInput = {
  email: string; password: string; documentId: string; firstNames: string;
  lastNames: string; address: string; phone: string;
};
type VehicleInput = {
  plate: string;
  vehicleType: string;
  capacity?: number | null;
  brandModel?: string | null;
};

function getEphemeralClient() {
  if (!ENV.supabaseUrl || !ENV.supabaseApiKey) {
    throw new Error(
      "Falta la URL o la clave pública de Supabase. Revisa la configuración EXPO_PUBLIC_SUPABASE_*.",
    );
  }

  return createClient(
    ENV.supabaseUrl,
    ENV.supabaseApiKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export const adminService = {
  async listCollectors() {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select("*")
      .eq("role", ROLES.COLLECTOR)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(createUserProfile);
  },

  /**
   * Paso 1: crea el usuario en auth.users y el perfil básico en profiles.
   * No incluye datos de vehículo.
   */
  async registerCollector({
    email,
    password,
    documentId,
    firstNames,
    lastNames,
    address,
    phone,
  }: CollectorInput) {
    const document_id = normalizeDocumentId(documentId);
    const first_names = firstNames.trim();
    const last_names = lastNames.trim();
    const full_name = `${first_names} ${lastNames}`.trim();
    const ephemeral = getEphemeralClient();

    let userId: string | undefined;

    const { data: signUpData, error: signUpError } =
      await ephemeral.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            document_id,
            first_names,
            last_names,
            full_name,
            address: address.trim(),
            phone: phone.trim(),
            role: ROLES.COLLECTOR,
          },
        },
      });

    if (signUpError) {
      if (!signUpError.message.toLowerCase().includes("already registered")) {
        throw signUpError;
      }

      const { data: existingProfile, error: profileLookupError } = await supabase
        .from(TABLES.PROFILES)
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .eq("role", ROLES.COLLECTOR)
        .maybeSingle();

      if (profileLookupError) throw profileLookupError;
      if (!existingProfile) {
        throw new Error(
          "Este correo ya tiene una cuenta, pero no encontramos su perfil de reciclador. " +
            "No es seguro recuperar su usuario desde la app; requiere revisión desde el backend.",
        );
      }

      return createUserProfile(existingProfile);
    } else {
      userId = signUpData.user?.id;
    }

    if (!userId) {
      throw new Error(
        "Supabase no devolvió el usuario creado; no se puede completar el perfil ni registrar el vehículo.",
      );
    }

    const { error: profileError } = await supabase
      .from(TABLES.PROFILES)
      .upsert(
        {
          id: userId,
          email: email.trim().toLowerCase(),
          document_id,
          first_names,
          last_names,
          full_name,
          address: address.trim(),
          phone: phone.trim(),
          role: ROLES.COLLECTOR,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

    if (profileError) throw profileError;

    return createUserProfile({
      id: userId,
      email,
      document_id,
      first_names,
      last_names,
      full_name,
      address,
      phone,
      role: ROLES.COLLECTOR,
    });
  },

  /**
   * Paso 2: guarda los datos del vehículo en la tabla vehicles.
   */
  async registerVehicle(collectorId: string, vehicleData: VehicleInput) {
    const { data, error } = await supabase
      .from(TABLES.VEHICLES)
      .upsert(
        {
          collector_id: collectorId,
          placa: vehicleData.plate,
          tipo_vehiculo: vehicleData.vehicleType,
          capacidad_toneladas: vehicleData.capacity ?? null,
          modelo_name: vehicleData.brandModel || null,
        },
        { onConflict: "collector_id" },
      )
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * @param {string} collectorId
   * @param {Partial<import('../models/user').UserProfile>} updates
   */
  async updateCollector(collectorId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", collectorId)
      .eq("role", ROLES.COLLECTOR)
      .select("*")
      .single();

    if (error) throw error;
    return createUserProfile(data);
  },

  async updateVehicle(collectorId: string, vehicleData: VehicleInput) {
    const { data, error } = await supabase
      .from(TABLES.VEHICLES)
      .upsert(
        {
          collector_id: collectorId,
          placa: vehicleData.plate,
          tipo_vehiculo: vehicleData.vehicleType,
          capacidad_toneladas: vehicleData.capacity ?? null,
          modelo_name: vehicleData.brandModel || null,
        },
        { onConflict: "collector_id" },
      )
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async getVehicle(collectorId: string) {
    const { data, error } = await supabase
      .from(TABLES.VEHICLES)
      .select("*")
      .eq("collector_id", collectorId)
      .single();

    if (error) return null;
    return data;
  },
};
