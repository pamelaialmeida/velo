import { Page, expect } from '@playwright/test';

export function createCheckoutActions(page: Page) {

    return {
        async expectCheckoutPage() {
            await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();
        },

        async expectTotalPrice(price: string) {
            const summaryTotalPrice = page.getByTestId('summary-total-price');
            await expect(summaryTotalPrice).toBeVisible();
            await expect(summaryTotalPrice).toHaveText(price);
        }
    };
}
