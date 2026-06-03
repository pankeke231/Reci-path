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
  /**
   * Lista recolectores registrados.
   */
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
   * Registra un recolector sin cerrar la sesión del administrador.
   */
  async registerCollector({
    email,
    password,
    documentId,
    firstNames,
    lastNames,
    address,
    phone,
    vehicleType,
    licensePlate,
  }) {
    const document_id = normalizeDocumentId(documentId);
    const first_names = firstNames.trim();
    const last_names = lastNames.trim();
    const full_name = `${first_names} ${last_names}`.trim();
    const ephemeral = getEphemeralClient();

    const { data, error } = await ephemeral.auth.signUp({
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
          vehicle_type: vehicleType?.trim() || null,
          license_plate: licensePlate?.trim() || null,
        },
      },
    });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase
        .from(TABLES.PROFILES)
        .upsert({
          id: data.user.id,
          email: email.trim().toLowerCase(),
          document_id,
          first_names,
          last_names,
          full_name,
          address: address.trim(),
          phone: phone.trim(),
          role: ROLES.COLLECTOR,
          vehicle_type: vehicleType?.trim() || null,
          license_plate: licensePlate?.trim() || null,
          account_status: "active",
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;
    }

    return createUserProfile({
      id: data.user?.id,
      email,
      document_id,
      first_names,
      last_names,
      full_name,
      address,
      phone,
      vehicle_type: vehicleType?.trim() || null,
      license_plate: licensePlate?.trim() || null,
      role: ROLES.COLLECTOR,
      account_status: "active",
    });
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
};
