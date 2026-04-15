/**
 * Admin Routes Registry
 * Canonical list of all admin routes
 */

export const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/revenue',
  '/admin/control',
  '/admin/settings',
  '/admin/editor',
  '/admin/builder',
  '/admin/content',
];

export function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname.startsWith(route));
}

