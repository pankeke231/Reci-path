import { supabase } from "../lib/supabase";

const BUCKET = "images";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

export type StorageImage = {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
};

type ImageFolder = "Profile" | "Residue";

function getFileExtension(image: StorageImage): string {
  const mimeExtension = image.mimeType?.split("/")[1]?.replace("jpeg", "jpg");
  if (mimeExtension && /^[a-z0-9]+$/i.test(mimeExtension)) {
    return mimeExtension.toLowerCase();
  }

  const nameExtension = image.fileName?.split(".").pop();
  if (nameExtension && /^[a-z0-9]{2,5}$/i.test(nameExtension)) {
    return nameExtension.toLowerCase();
  }

  return "jpg";
}

export const imageStorageService = {
  async upload(folder: ImageFolder, userId: string, image: StorageImage) {
    const response = await fetch(image.uri);
    if (!response.ok) {
      throw new Error("No se pudo leer la imagen seleccionada.");
    }

    const file = await response.arrayBuffer();
    const extension = getFileExtension(image);
    const objectPath = `${folder}/${userId}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, file, {
      contentType: image.mimeType ?? `image/${extension === "jpg" ? "jpeg" : extension}`,
      upsert: false,
    });

    if (error) throw error;
    return objectPath;
  },

  async createSignedUrl(objectPath: string) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);

    if (error) throw error;
    return data.signedUrl;
  },

  async remove(objectPath: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([objectPath]);
    if (error) throw error;
  },
};
