/**
 * Normalizes axios error payloads (string body, JSON object, or unknown) for UI display.
 */
export function getApiErrorMessage(error) {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }
  if (data && typeof data === 'object') {
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (data.custom_error) {
      return 'Something went wrong. Please try again.';
    }
  }
  return error?.message || 'Something went wrong. Please try again.';
}

export function isDuplicateEmailMessage(message) {
  return /already exists|already registered|duplicate|email.*exists/i.test(String(message));
}
