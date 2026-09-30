export interface WasteType {
  id: string;
  name: string;
  color_code: string;
  is_active: boolean;
  created_at: string;
}

export interface WasteTypeSelection {
  id: string;
  name: string;
  color_code: string;
}

export type WasteContainerColor = {
  name: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};

const WASTE_CONTAINER_COLORS: Record<string, WasteContainerColor> = {
  blanco: {
    name: "Blanco",
    backgroundColor: "#F8FAFC",
    textColor: "#111827",
    borderColor: "#CBD5E1",
  },
  white: {
    name: "Blanco",
    backgroundColor: "#F8FAFC",
    textColor: "#111827",
    borderColor: "#CBD5E1",
  },
  verde: {
    name: "Verde",
    backgroundColor: "#16A34A",
    textColor: "#FFFFFF",
    borderColor: "#15803D",
  },
  green: {
    name: "Verde",
    backgroundColor: "#16A34A",
    textColor: "#FFFFFF",
    borderColor: "#15803D",
  },
  negro: {
    name: "Negro",
    backgroundColor: "#111827",
    textColor: "#FFFFFF",
    borderColor: "#030712",
  },
  black: {
    name: "Negro",
    backgroundColor: "#111827",
    textColor: "#FFFFFF",
    borderColor: "#030712",
  },
};

export function createWasteType(data: Partial<WasteType> = {}): WasteType {
  return {
    id: data.id ?? "",
    name: data.name ?? "",
    color_code: data.color_code ?? "",
    is_active: data.is_active ?? false,
    created_at: data.created_at ?? new Date().toISOString(),
  };
}

export function getWasteContainerColor(
  colorCode: string | null | undefined,
): WasteContainerColor {
  const normalized = colorCode?.trim().toLowerCase() ?? "";
  const knownHexColors: Record<string, string> = {
    "#fff": "blanco",
    "#ffffff": "blanco",
    "#16a34a": "verde",
    "#008000": "verde",
    "#000": "negro",
    "#000000": "negro",
  };
  const categoryColors: Record<string, string> = {
    plastic: "blanco",
    paper: "blanco",
    glass: "blanco",
    metal: "blanco",
    organic: "verde",
    general: "negro",
  };
  const mappedColor = WASTE_CONTAINER_COLORS[
    knownHexColors[normalized] ?? categoryColors[normalized] ?? normalized
  ];
  if (mappedColor) return mappedColor;

  if (/^#[0-9a-f]{6}$/i.test(normalized)) {
    return {
      name: normalized.toUpperCase(),
      backgroundColor: normalized,
      textColor: "#FFFFFF",
      borderColor: normalized,
    };
  }

  return (
    mappedColor ?? {
      name: colorCode?.trim() || "Sin color",
      backgroundColor: "#475569",
      textColor: "#FFFFFF",
      borderColor: "#334155",
    }
  );
}
