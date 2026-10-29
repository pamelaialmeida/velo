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

        test.beforeEach(async ({ app }) => {
            await app.hero.open();
        });

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

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.expectTotalPrice(customer.totalPrice);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await app.checkout.expectResult('Pedido Aprovado!');
        });

        test('Deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento', async ({ app, page }) => {

            const customer = {
                name: 'Frank',
                lastname: 'Castle',
                email: 'frank.castle@velo.dev',
                document: '65493881047',
                phone: '(21) 94529-9981',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00'
            };

            await deleteOrderByEmail(customer.email);

            await app.mock.creditAnalysis(701);

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            // await app.checkout.expectSummaryTotal(customer.totalPrice);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await app.checkout.expectResult('Pedido Aprovado!');
        });

        test('Deve encaminhar para análise de crédito quando o score do CPF for entre 501 e 700 no financiamento', async ({ app, page }) => {

            const customer = {
                name: 'Logan',
                lastname: 'Howlett',
                email: 'logan@velo.dev',
                document: '55161018089',
                phone: '(13) 52029-7561',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00'
            };

            await deleteOrderByEmail(customer.email);

            await app.mock.creditAnalysis(700);

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            // await app.checkout.expectSummaryTotal(customer.totalPrice);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await app.checkout.expectResult('Pedido em Análise!');
        });

        test('Deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento sem entrada', async ({ app, page }) => {

            const customer = {
                name: 'Clark',
                lastname: 'Kent',
                email: 'clark@dailyplanet.com',
                document: '52998224725',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00'
            }

            await deleteOrderByEmail(customer.email);

            await app.mock.creditAnalysis(500);

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await app.checkout.expectResult('Pedido Reprovado!');
        });

        test('Deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada menor que 50%', async ({ app, page }) => {

            const customer = {
                name: 'Diana',
                lastname: 'Prince',
                email: 'diana@themiscira.com',
                document: '11144477735',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00',
                downPayment: '10000'
            }

            await deleteOrderByEmail(customer.email);

            await app.mock.creditAnalysis(500);

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.fillDownPayment(customer.downPayment);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await app.checkout.expectResult('Pedido Reprovado!');
        });

        test('Deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada igual a 50%', async ({ app, page }) => {

            const customer = {
                name: 'Richard',
                lastname: 'Fortus',
                email: 'richard@gmail.com',
                document: '39434745004',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00',
                downPayment: '20000'
            }

            await deleteOrderByEmail(customer.email);

            await app.mock.creditAnalysis(450);

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.fillDownPayment(customer.downPayment);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await app.checkout.expectResult('Pedido Aprovado!');
        });

        test('Deve aprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada mair que 50%', async ({ app, page }) => {

            const customer = {
                name: 'Axl',
                lastname: 'Rose',
                email: 'alx@gnr.com',
                document: '79327557000',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00',
                downPayment: '30000'
            }

            await deleteOrderByEmail(customer.email);

            await app.mock.creditAnalysis(300);

            await app.configurator.expectPrice(customer.totalPrice);
            await app.configurator.finishConfiguration();
            await app.checkout.expectCheckoutPage();

            await app.checkout.fillCustomerData(customer);
            await app.checkout.selectStore(customer.store);

            await app.checkout.selectPaymentMethod(customer.paymentMethod);
            await app.checkout.fillDownPayment(customer.downPayment);
            await app.checkout.acceptTerms();
            await app.checkout.submit();

            await app.checkout.expectResult('Pedido Aprovado!');
        });

    });
});