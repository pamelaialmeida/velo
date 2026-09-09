import { Page, expect } from '@playwright/test'

export function createConfiguratorActions(page: Page) {

    const precisionParkCheckbox = page.getByRole('checkbox', { name: /Precision Park/i });
    const fluxCapacitorCheckbox = page.getByRole('checkbox', { name: /Flux Capacitor/i });

    return {
        elements: {
            precisionParkCheckbox,
            fluxCapacitorCheckbox,
        },

        async open() {
            await page.goto('/configure');
        },

        async selectColor(name: string) {
            await page.getByRole('button', { name }).click();
        },

        async selectWheels(name: string | RegExp) {
            await page.getByRole('button', { name }).click();
        },

        async toggleOptional(name: string | RegExp) {
            const locator = typeof name === 'string' ? new RegExp(name, 'i') : name;
            await page.getByRole('checkbox', { name: locator }).click();
        },

        async expectPrice(price: string) {
            const priceElement = page.getByTestId('total-price');
            await expect(priceElement).toBeVisible();
            await expect(priceElement).toHaveText(price);
        },

        async expectCarImageSrc(src: string | RegExp) {
            const carImage = page.locator('img[alt^="Velô Sprint"]');
            await expect(carImage).toHaveAttribute('src', src);
        },

        async goToCheckout() {
            await page.getByRole('button', { name: 'Monte o Seu' }).click();
        }
    }
}