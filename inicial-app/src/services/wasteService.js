import { TABLES } from "../constants/tables";
import { createWasteType, DEFAULT_WASTE_TYPES } from "../models/waste";
import { createCrudService } from "./baseCrudService";

const crud = createCrudService(TABLES.WASTE_TYPES);

export const wasteService = {
  ...crud,

  async listTypes() {
    try {
      const data = await crud.list({ orderBy: "name", ascending: true });
      if (data?.length) return data.map(createWasteType);
    } catch {
      // Tabla no disponible aún: fallback para desarrollo
    }
    return DEFAULT_WASTE_TYPES.map(createWasteType);
  },
};
