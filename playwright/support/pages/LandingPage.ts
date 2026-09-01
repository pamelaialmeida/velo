import { Page, expect } from '@playwright/test';

export class LandingPage {
    constructor(private page: Page) {}

    async goTo() {
        await this.page.goto('/');
        await expect(this.page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    }

}
