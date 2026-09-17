import { test, expect } from '../support/fixtures';
import { deleteOrderByEmail } from '../support/database/orderRepository.ts';


test.describe('Checkout', () => {

    test.describe('Validações de campos obrigatórios', () => {

        let alerts: any;

        test.beforeEach(async ({ page, app }) => {
            await page.goto('/order');
            await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible();

            alerts = app.checkout.elements.alerts;
        });

        test('Deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
            await app.checkout.submit();

            await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
            await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
            await expect(alerts.email).toHaveText('Email inválido');
            await expect(alerts.phone).toHaveText('Telefone inválido');
            await expect(alerts.document).toHaveText('CPF inválido');
            await expect(alerts.store).toHaveText('Selecione uma loja');
            await expect(alerts.terms).toHaveText('Aceite os termos');
        });

        test('Deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app }) => {

            const customer = {
                name: 'T',
                lastname: 'S',
                email: 'tony@teste.com',
                document: '00000014141',
                phone: '(11) 96989-9956'
            };

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore('Velô Paulista');
            await app.checkout.acceptTerms();

            await app.checkout.submit();

            await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres');
            await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres');
        });

        test('Deve exibir erro para e-mail com formato inválido', async ({ app }) => {
            const customer = {
                name: 'Tony',
                lastname: 'Stark',
                email: 'tony@.com',
                document: '00000014141',
                phone: '(11) 91099-9109'
            };

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore('Velô Paulista');
            await app.checkout.acceptTerms();

            await app.checkout.submit();

            await expect(alerts.email).toHaveText('Email inválido');
        });

        test('Deve exibir erro para CPF inválido', async ({ app }) => {

            const customer = {
                name: 'Bruce',
                lastname: 'Wayne',
                email: 'wayne@test.com',
                document: '00000014199',
                phone: '(11) 96309-4789'
            };

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore('Velô Paulista');
            await app.checkout.acceptTerms();

            await app.checkout.submit();

            await expect(alerts.document).toHaveText('CPF inválido');
        });

        test('Deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {

            const customer = {
                name: 'Harry',
                lastname: 'Potter',
                email: 'potter@test.com',
                document: '00000014199',
                phone: '(11) 98525-1424'
            };

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore('Velô Paulista');

            await expect(app.checkout.elements.terms).not.toBeChecked();

            await app.checkout.submit();

            await expect(alerts.terms).toHaveText('Aceite os termos');
        });
    });

    test.describe('Pagamento e Confirmação', () => {

        test('Deve criar um pedido com sucesso para pagamento à vista', async ({ page, app }) => {

            const customer = {
                name: 'Clark',
                lastname: 'Kent',
                email: 'kent@teste.com',
                document: '05366127068',
                phone: '(11) 99888-3131',
                store: 'Velô Paulista',
                paymentMethod: 'À Vista',
                totalPrice: 'R$ 40.000,00'
            };

            await deleteOrderByEmail(customer.email);

            await page.goto('/');
            await page.getByRole('link', { name: /Configure Agora/i }).click();

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.expectTotalPrice(customer.totalPrice);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await expect(page).toHaveURL(/\/success/)
            await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
        });

    });
});