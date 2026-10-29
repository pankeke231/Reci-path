export type AuthLinkParams = {
  accessToken: string | null;
  refreshToken: string | null;
  code: string | null;
  tokenHash: string | null;
  type: string | null;
  error: string | null;
  errorDescription: string | null;
};

function decode(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function parsePairs(input: string): Record<string, string> {
  const result: Record<string, string> = {};

  for (const chunk of input.split("&")) {
    if (!chunk) continue;

    const separator = chunk.indexOf("=");
    const key = decode(separator === -1 ? chunk : chunk.slice(0, separator));
    const value =
      separator === -1 ? "" : decode(chunk.slice(separator + 1));

    if (key) result[key] = value;
  }

  return result;
}

/**
 * Extrae los parámetros relevantes de un enlace de recuperación de Supabase.
 * Soporta tokens en el fragmento (flujo implícito) y `?code=` (flujo PKCE).
 */
export function parseAuthLink(url: string): AuthLinkParams {
  const hashIndex = url.indexOf("#");
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const fragment = hashIndex >= 0 ? url.slice(hashIndex + 1) : "";
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";

  const params = { ...parsePairs(query), ...parsePairs(fragment) };

  return {
    accessToken: params.access_token ?? null,
    refreshToken: params.refresh_token ?? null,
    code: params.code ?? null,
    tokenHash: params.token_hash ?? null,
    type: params.type ?? null,
    error: params.error ?? null,
    errorDescription: params.error_description ?? null,
  };
}
