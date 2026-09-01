import { Page, expect } from '@playwright/test';

export function createLandingActions(page: Page) {
  return {
    async goTo() {
      await page.goto('/');
      await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    },
  };
}
