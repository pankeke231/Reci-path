/**
 * Normaliza errores de Supabase / red a mensajes legibles.
 * @param {unknown} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (!error) return 'Ocurrió un error inesperado';

  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) {
    const err = /** @type {{ message?: string; error_description?: string }} */ (error);
    return err.message || err.error_description || 'Ocurrió un error inesperado';
  }

  return 'Ocurrió un error inesperado';
}

/**
 * @param {unknown} error
 */
export function isAuthError(error) {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('invalid login') ||
    message.includes('invalid credentials') ||
    message.includes('email not confirmed') ||
    message.includes('jwt')
  );
}
