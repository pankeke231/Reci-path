import { TABLES } from "../constants/tables";
import { ROLES } from "../constants/roles";
import { createUserProfile } from "../models/user";
import { normalizeDocumentId } from "../utils/validators";
import { supabase } from "./supabase/client";

/**
 * @typedef {Object} SignUpInput
 * @property {string} email
 * @property {string} password
 * @property {string} documentId
 * @property {string} firstNames
 * @property {string} lastNames
 * @property {string} address
 * @property {string} phone
 * @property {string} role
 */

export const authService = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * @param {string} userId
   * @returns {Promise<import('../models/user').UserProfile|null>}
   */
  async fetchProfile(userId) {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data ? createUserProfile(data) : null;
  },

  /**
   * @param {{ email: string; password: string }} credentials
   */
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw error;

    const profile = await this.fetchProfile(data.user.id);
    return { session: data.session, user: data.user, profile };
  },

  /**
   * @param {SignUpInput} input
   */
  async signUp({
    email,
    password,
    documentId,
    firstNames,
    lastNames,
    address,
    phone,
    role,
  }) {
    const document_id = normalizeDocumentId(documentId);
    const first_names = firstNames.trim();
    const last_names = lastNames.trim();
    const full_name = `${first_names} ${last_names}`.trim();
    const userRole = role || ROLES.CITIZEN;

    const { data, error } = await supabase.auth.signUp({
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
          role: userRole,
        },
      },
    });
    if (error) throw error;

    if (data.user) {
      await this.upsertProfile({
        id: data.user.id,
        email: data.user.email ?? email.trim().toLowerCase(),
        document_id,
        first_names,
        last_names,
        full_name,
        address: address.trim(),
        phone: phone.trim(),
        role: userRole,
      });
    }

    const profile = data.user ? await this.fetchProfile(data.user.id) : null;
    return { session: data.session, user: data.user, profile };
  },

  /**
   * @param {Partial<import('../models/user').UserProfile>} profile
   */
  async upsertProfile(profile) {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .upsert(
        {
          ...profile,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select("*")
      .single();

    if (error) throw error;
    return createUserProfile(data);
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * @param {(event: string, session: import('@supabase/supabase-js').Session|null) => void} callback
   */
  onAuthStateChange(callback) {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  },
};
