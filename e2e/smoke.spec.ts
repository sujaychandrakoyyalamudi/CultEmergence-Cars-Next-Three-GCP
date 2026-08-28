import { expect, test } from '@playwright/test';

test('home page exposes the complete collection', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ten cars');
  await expect(page.locator('.car-card')).toHaveCount(10);
  await expect(page.getByRole('link', { name: /Porsche 911 Carrera GTS/i })).toBeVisible();
});

test('detail page is source-transparent', async ({ page }) => {
  await page.goto('/cars/toyota-camry-le-hybrid');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Camry LE Hybrid');
  await expect(page.getByText('U.S. starting price')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sources and image license' })).toBeVisible();
});

test('comparison enforces the three-car limit', async ({ page }) => {
  await page.goto('/compare');
  await expect(page.getByText('3 of 3 selected')).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: /Porsche/i })).toBeVisible();
  await expect(page.getByLabel(/Mercedes-Benz/i)).toBeDisabled();
});

test('keyboard navigation reaches main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
});

test('reduced-motion preference removes reveal travel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.motion-reveal').first()).toHaveCSS('opacity', '1');
  await expect(page.locator('.motion-reveal').first()).toHaveCSS('transform', 'none');
});

test('WebGL failure uses the local stage fallback', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    const patched = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (contextId === 'webgl' || contextId === 'webgl2') return null;
      return Reflect.apply(original, this, [contextId, ...args]);
    };
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: patched });
  });
  await page.goto('/');
  await expect(page.locator('.stage-fallback')).toBeVisible();
});

test('unknown routes render the branded not-found page', async ({ page }) => {
  const response = await page.goto('/cars/not-a-real-car');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /That road ends here/i })).toBeVisible();
});
