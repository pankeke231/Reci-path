import { TABLES } from '../constants/tables';
import { createUserProfile } from '../models/user';
import { createCrudService } from './baseCrudService';

const crud = createCrudService(TABLES.PROFILES);

export const profileService = {
  ...crud,

  /**
   * @param {string} userId
   */
  async getProfile(userId) {
    const data = await crud.getById(userId);
    return data ? createUserProfile(data) : null;
  },

  /**
   * @param {string} userId
   * @param {Partial<import('../models/user').UserProfile>} updates
   */
  async updateProfile(userId, updates) {
    const data = await crud.update(userId, updates);
    return createUserProfile(data);
  },
};
