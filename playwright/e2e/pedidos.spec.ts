import { test, expect } from '@playwright/test';

test('Deve consultar um pedido aprovado', async ({ page }) => {

    // Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

    // Act

    // Outros exemplos de locators:
    //await page.getByTestId('search-order-id').fill('VLO-C8PNMW');    
    //await page.getByLabel('Número do Pedido').fill('VLO-C8PNMW');
    //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-C8PNMW');

    await page.getByRole('textbox', {name: 'Número do Pedido'}).fill('VLO-C8PNMW');

    // Outros exemplos de locators:
    //await page.getByTestId('search-order-button').click();
    await page.getByRole('button', {name: 'Buscar Pedido'}).click();

    // Assert

    // Outros exemplos de locators:
    // await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10000});
    // await expect(page.getByTestId('order-result-id')).toContainText('VLO-C8PNMW');

    // Usando CSS locators para buscar o texto "Pedido" e so entao o ID do pedido para garantir que esta no local certo
    const orderResultId = page.locator('p:text-is("Pedido") + p');
    await expect(orderResultId).toBeVisible({timeout: 10000});

    // Outros exemplos de locators:
    // await expect(page.getByTestId('order-result-status')).toBeVisible();
    // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
    await expect(page.getByText('APROVADO')).toBeVisible();    
});