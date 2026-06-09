import { createClient } from "@supabase/supabase-js";
import { ENV } from "../config/env";
import { TABLES } from "../constants/tables";
import { ROLES } from "../constants/roles";
import { createUserProfile } from "../models/user";
import { normalizeDocumentId } from "../utils/validators";
import { supabase } from "./supabase/client";

function getEphemeralClient() {
  return createClient(
    ENV.supabaseUrl || "https://placeholder.supabase.co",
    ENV.supabaseAnonKey || "placeholder",
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
  }) {
    const document_id = normalizeDocumentId(documentId);
    const first_names = firstNames.trim();
    const last_names = lastNames.trim();
    const full_name = `${first_names} ${lastNames}`.trim();
    const ephemeral = getEphemeralClient();

    let userId: string | undefined;
    let sessionError: string | null = null;

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
      sessionError = signUpError.message;
      if (
        signUpError.message?.includes("already registered") ||
        signUpError.status === 422
      ) {
        const { data: existingUser, error: fetchError } =
          await ephemeral.auth.admin.getUserByEmail(
            email.trim().toLowerCase(),
          );
        if (fetchError || !existingUser?.user) {
          throw new Error(
            `El correo ya está registrado y no se pudo recuperar: ${fetchError?.message}`,
          );
        }
        userId = existingUser.user.id;
      } else {
        throw signUpError;
      }
    } else {
      userId = signUpData.user?.id;
    }

    if (userId) {
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
    }

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
  async registerVehicle(collectorId, vehicleData) {
    const { data, error } = await supabase
      .from(TABLES.VEHICLES)
      .insert({
        collector_id: collectorId,
        placa: vehicleData.plate,
        tipo_vehiculo: vehicleData.vehicleType,
        capacidad_toneladas: vehicleData.capacity ?? null,
        modelo_name: vehicleData.brandModel || null,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * @param {string} collectorId
   * @param {Partial<import('../models/user').UserProfile>} updates
   */
  async updateCollector(collectorId, updates) {
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

  async updateVehicle(collectorId, vehicleData) {
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

  async getVehicle(collectorId) {
    const { data, error } = await supabase
      .from(TABLES.VEHICLES)
      .select("*")
      .eq("collector_id", collectorId)
      .single();

    if (error) return null;
    return data;
  },
};
