import { TABLES } from "../constants/tables";
import { createWasteType } from "../models/waste";
import { createCrudService } from "./baseCrudService";

const crud = createCrudService(TABLES.WASTE_TYPES);

export const wasteService = {
  ...crud,

  async listTypes() {
    const data = await crud.list({
      select: "id, name, color_code, is_active, created_at",
      filters: { is_active: true },
      orderBy: "name",
      ascending: true,
    });
    return data.map(createWasteType);
  },
};
