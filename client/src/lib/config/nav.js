// Single source of truth for the landing nav links.
// Header.svelte and MobileMenu.svelte both import this so links never drift apart.
export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Team', href: '/teams' },
  { label: 'Hackathons', href: '/hackathons' },
  { label: 'Rankers', href: '/rankers' }
];

// Decides whether a given link is "active" based on the current route.
// '/' only matches exactly (otherwise every route would light up Home).
// Everything else matches on prefix so nested routes (e.g. /product/x) still highlight.
export function isLinkActive(href, pathname) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}
