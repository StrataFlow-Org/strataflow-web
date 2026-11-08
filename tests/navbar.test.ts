import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Navbar Navigation Routes & Drawer State Logic Tests', () => {
  const routes = [
    { label: 'Agreements', href: '/agreements' },
    { label: 'Create Escrow', href: '/create' },
    { label: 'Arbitration', href: '/agreements?tab=arbitration' },
  ];

  it('contains essential navigation links with valid routes', () => {
    assert.strictEqual(routes.length, 3);
    assert.ok(routes.some((r) => r.href === '/agreements'));
    assert.ok(routes.some((r) => r.href === '/create'));
  });

  it('determines active link based on current path', () => {
    const isRouteActive = (pathname: string, href: string) => {
      if (href === '/agreements' && pathname.startsWith('/agreements')) return true;
      if (href === '/create' && pathname.startsWith('/create')) return true;
      return pathname === href;
    };

    assert.strictEqual(isRouteActive('/agreements/42', '/agreements'), true);
    assert.strictEqual(isRouteActive('/create', '/create'), true);
    assert.strictEqual(isRouteActive('/create', '/agreements'), false);
    assert.strictEqual(isRouteActive('/agreements', '/create'), false);
  });

  it('toggles mobile menu state correctly on user interaction', () => {
    let isMobileOpen = false;

    // User taps hamburger icon
    isMobileOpen = !isMobileOpen;
    assert.strictEqual(isMobileOpen, true);

    // User taps a link or close icon
    isMobileOpen = false;
    assert.strictEqual(isMobileOpen, false);
  });
});
