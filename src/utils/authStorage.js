/**
 * User JSON is stored in localStorage (remember me) or sessionStorage.
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function clearUser() {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
}
