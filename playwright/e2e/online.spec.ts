import { test, expect } from '../support/fixtures';

test('Webapp deve estar online', async ({ page }) => {
  await page.goto('https://velo-pamelaialmeida.vercel.app/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Velô by Papito/);
});

