/**
 * Session Management
 * Client-side only authentication check
 */

export function isAdmin(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.includes('admin_auth=true');
}

export function setAdminSession() {
  if (typeof document === 'undefined') return;
  document.cookie = 'admin_auth=true; path=/; max-age=86400'; // 24 hours
}

export function clearAdminSession() {
  if (typeof document === 'undefined') return;
  document.cookie = 'admin_auth=; path=/; max-age=0';
}

