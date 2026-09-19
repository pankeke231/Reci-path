import 'expo-sqlite/localStorage/install';

const ONBOARDING_COMPLETED_KEY = 'recipath.onboarding.completed';

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
  } catch (error) {
    console.warn('[Onboarding] No se pudo leer el estado guardado:', error);
    return false;
  }
}

export function completeOnboarding() {
  try {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  } catch (error) {
    console.warn('[Onboarding] No se pudo guardar el estado:', error);
  }
}
