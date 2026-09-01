import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers.ts';
import { Navbar } from '../support/components/NavBar.ts'; 
import { LandingPage } from '../support/pages/LandingPage.ts';
import { OrderLookupPage, OrderDetails } from '../support/pages/OrderLookupPage.ts';

test.describe('Consulta de Pedidos', () => {

    let orderLookupPage: OrderLookupPage;

    test.beforeEach(async ({ page }) => {
        // Arrange
        // await page.goto('http://localhost:5173/');
        // await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
        // await page.getByRole('link', { name: 'Consultar Pedido' }).click();
        // await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
        await new LandingPage(page).goTo();

        await new Navbar(page).orderLookupLink();

        orderLookupPage = new OrderLookupPage(page);
        orderLookupPage.validatePageLoaded();
    });

    test('Deve consultar um pedido aprovado', async ({ page }) => {
        // Test Data
        //const order = 'VLO-C8PNMW';

        const order: OrderDetails = {
            number: 'VLO-C8PNMW',
            status: 'APROVADO',
            color: 'Midnight Black',
            wheels: 'sport Wheels',
            customer: {
                name: 'Pamela Almeida',
                email: 'pamela@velo.dev'
            },
            payment: 'À Vista'
        };

        // Act

        // Outros exemplos de locators:
        //await page.getByTestId('search-order-id').fill('VLO-C8PNMW');    
        //await page.getByLabel('Número do Pedido').fill('VLO-C8PNMW');
        //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-C8PNMW');

        //await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);

        // Outros exemplos de locators:
        //await page.getByTestId('search-order-button').click();
        //await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        //const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order.number);

        // Assert

        // Validação usando snapshot
        // await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
        //     - img
        //     - paragraph: Pedido
        //     - paragraph: ${order.number}
        //     - status:
        //         - img
        //         - text: ${order.status}
        //     - img "Velô Sprint"
        //     - paragraph: Modelo
        //     - paragraph: Velô Sprint
        //     - paragraph: Cor
        //     - paragraph: ${order.color}
        //     - paragraph: Interior
        //     - paragraph: cream
        //     - paragraph: Rodas
        //     - paragraph: ${order.wheels}
        //     - heading "Dados do Cliente" [level=4]
        //     - paragraph: Nome
        //     - paragraph: ${order.customer.name}
        //     - paragraph: Email
        //     - paragraph: ${order.customer.email}
        //     - paragraph: Loja de Retirada
        //     - paragraph
        //     - paragraph: Data do Pedido
        //     - paragraph: /\\d+\\/\\d+\\/\\d+/
        //     - heading "Pagamento" [level=4]
        //     - paragraph: ${order.payment}
        //     - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
        //     `);

        await orderLookupPage.validateOrderDetails(order);

        await orderLookupPage.validateStatusBadge(order.status);

            // const statusBadge = page.getByRole('status').filter({hasText: order.status});
            // await expect(statusBadge).toHaveClass(/bg-green-100/);
            // await expect(statusBadge).toHaveClass(/text-green-700/);

            // const statusIcon = statusBadge.locator('svg');
            // await expect(statusIcon).toHaveClass(/lucide-circle-check-big/);

        // Outros exemplos de locators:
        // await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10000});
        // await expect(page.getByTestId('order-result-id')).toContainText('VLO-C8PNMW');

        // Usando CSS locators para buscar o texto "Pedido" e so entao o ID do pedido para garantir que esta no local certo
        // const orderResultId = page.locator('p:text-is("Pedido") + p');
        // await expect(orderResultId).toBeVisible({timeout: 10000});

        // Opção com XPath:
        // const orderCode = page.locator('//p[text()="Pedido"]/../p[text()="VLO-C8PNMW"]');
        // await expect(orderCode).toBeVisible({timeout: 10000});

        // Opção com getByRole
        // const containerPedido = page.getByRole('paragraph')
        //     .filter({ hasText: /^Pedido$/ })
        //     .locator('..'); // Sobe para o elemento pai (a div que agrupa ambos)

        // await expect(containerPedido).toContainText(order, { timeout: 10000 });

        // // Outros exemplos de locators:
        // // await expect(page.getByTestId('order-result-status')).toBeVisible();
        // // await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');
        // await expect(page.getByText('APROVADO')).toBeVisible();
    });

    test('Deve consultar um pedido em analise', async ({ page }) => {
        //Arrange
        const order: OrderDetails = {
            number: 'VLO-MG9BYE',
            status: 'EM_ANALISE',
            color: 'Lunar White',
            wheels: 'aero Wheels',
            customer: {
                name: 'Joao Silva',
                email: 'joao@velo.dev'
            },
            payment: 'À Vista'
        };

        // Act
        //await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);
        //await page.getByRole('button', { name: 'Buscar Pedido' }).click();
        //const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order.number);

        // Assert

        // Validação usando snapshot
        // await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
        //     - img
        //     - paragraph: Pedido
        //     - paragraph: ${order.number}
        //     - status:
        //         - img
        //         - text: ${order.status}
        //     - img "Velô Sprint"
        //     - paragraph: Modelo
        //     - paragraph: Velô Sprint
        //     - paragraph: Cor
        //     - paragraph: ${order.color}
        //     - paragraph: Interior
        //     - paragraph: cream
        //     - paragraph: Rodas
        //     - paragraph: ${order.wheels}
        //     - heading "Dados do Cliente" [level=4]
        //     - paragraph: Nome
        //     - paragraph: ${order.customer.name}
        //     - paragraph: Email
        //     - paragraph: ${order.customer.email}
        //     - paragraph: Loja de Retirada
        //     - paragraph
        //     - paragraph: Data do Pedido
        //     - paragraph: /\\d+\\/\\d+\\/\\d+/
        //     - heading "Pagamento" [level=4]
        //     - paragraph: ${order.payment}
        //     - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
        //     `);

        await orderLookupPage.validateOrderDetails(order);

            // const statusBadge = page.getByRole('status').filter({hasText: order.status});
            // await expect(statusBadge).toHaveClass(/bg-amber-100/);
            // await expect(statusBadge).toHaveClass(/text-amber-700/);

            // const statusIcon = statusBadge.locator('svg');
            // await expect(statusIcon).toHaveClass(/lucide-clock/);

        await orderLookupPage.validateStatusBadge(order.status);
    });


    test('Deve consultar um pedido reprovado', async ({ page }) => {
        // Test Data
        const order: OrderDetails = {
            number: 'VLO-VMXBKJ',
            status: 'REPROVADO',
            color: 'Midnight Black',
            wheels: 'sport Wheels',
            customer: {
                name: 'Steve Jobs',
                email: 'steve@apple.com'
            },
            payment: 'À Vista'
        };

        // Act

        // Outros exemplos de locators:
        //await page.getByTestId('search-order-id').fill('VLO-C8PNMW');    
        //await page.getByLabel('Número do Pedido').fill('VLO-C8PNMW');
        //await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-C8PNMW');

        //await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.number);

        // Outros exemplos de locators:
        //await page.getByTestId('search-order-button').click();
        //await page.getByRole('button', { name: 'Buscar Pedido' }).click();

        //const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order.number);

        // Assert

        // Validação usando snapshot
        // await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
        //     - img
        //     - paragraph: Pedido
        //     - paragraph: ${order.number}
        //     - status:
        //         - img
        //         - text: ${order.status}
        //     - img "Velô Sprint"
        //     - paragraph: Modelo
        //     - paragraph: Velô Sprint
        //     - paragraph: Cor
        //     - paragraph: ${order.color}
        //     - paragraph: Interior
        //     - paragraph: cream
        //     - paragraph: Rodas
        //     - paragraph: ${order.wheels}
        //     - heading "Dados do Cliente" [level=4]
        //     - paragraph: Nome
        //     - paragraph: ${order.customer.name}
        //     - paragraph: Email
        //     - paragraph: ${order.customer.email}
        //     - paragraph: Loja de Retirada
        //     - paragraph
        //     - paragraph: Data do Pedido
        //     - paragraph: /\\d+\\/\\d+\\/\\d+/
        //     - heading "Pagamento" [level=4]
        //     - paragraph: ${order.payment}
        //     - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
        //     `);

        await orderLookupPage.validateOrderDetails(order);

            // const statusBadge = page.getByRole('status').filter({hasText: order.status});
            // await expect(statusBadge).toHaveClass(/bg-red-100/);
            // await expect(statusBadge).toHaveClass(/text-red-700/);

            // const statusIcon = statusBadge.locator('svg');
            // await expect(statusIcon).toHaveClass(/lucide-circle-x/);

        await orderLookupPage.validateStatusBadge(order.status);
    });

    test('Deve exibir mensagem de erro quando o pedido não é encontrado', async ({ page }) => {
        const order = generateOrderCode();

        // Act
        //await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order);
        //await page.getByRole('button', { name: 'Buscar Pedido' }).click();
        //const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order);

        // Assert
        // const messageTitle = page.getByRole('heading', { name: 'Pedido não encontrado', level: 3});
        // await expect(messageTitle).toBeVisible();

        // const messageText = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'});
        // await expect(messageText).toBeVisible();

        await orderLookupPage.validateOrderNotFound();

    });

    test('Deve exibir mensagem de erro quando o pedido está fora do padrão', async ({ page }) => {
        const order = 'AB-INVALIDO-9931';

        // Act
        //const orderLookupPage = new OrderLookupPage(page);
        await orderLookupPage.searchOrder(order);

        // Assert
        await orderLookupPage.validateOrderNotFound();
    });

});
