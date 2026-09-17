import { test, expect } from '../support/fixtures';
import { generateOrderCode } from '../support/helpers.ts';
import { OrderDetails } from '../support/actions/orderLookupActions.ts';
import { insertOrder, deleteOrderByNumber } from '../support/database/orderRepository.ts';
import testData from '../support/fixtures/orders.json' with { type: 'json' };

test.describe('Consulta de Pedidos', () => {

    test.beforeEach(async ({ app }) => {
        await app.orderLookup.open();
    });

    test('Deve consultar um pedido aprovado', async ({ app }) => {
        // const order: OrderDetails = {
        //     number: 'VLO-C8PNMW',
        //     status: 'APROVADO',
        //     color: 'Midnight Black',
        //     wheels: 'sport Wheels',
        //     customer: {
        //         name: 'Pamela Almeida',
        //         email: 'pamela@velo.dev'
        //     },
        //     payment: 'À Vista'
        // };
        const order: OrderDetails = testData.aprovado as OrderDetails;

        await deleteOrderByNumber(order.number);
        await insertOrder(order);

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('Deve consultar um pedido em analise', async ({ app }) => {
        // const order: OrderDetails = {
        //     number: 'VLO-MG9BYE',
        //     status: 'EM_ANALISE',
        //     color: 'Lunar White',
        //     wheels: 'aero Wheels',
        //     customer: {
        //         name: 'Joao Silva',
        //         email: 'joao@velo.dev'
        //     },
        //     payment: 'À Vista'
        // };

        const order: OrderDetails = testData.em_analise as OrderDetails;

        await deleteOrderByNumber(order.number);
        await insertOrder(order);

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });


    test('Deve consultar um pedido reprovado', async ({ app }) => {
        // const order: OrderDetails = {
        //     number: 'VLO-VMXBKJ',
        //     status: 'REPROVADO',
        //     color: 'Midnight Black',
        //     wheels: 'sport Wheels',
        //     customer: {
        //         name: 'Steve Jobs',
        //         email: 'steve@apple.com'
        //     },
        //     payment: 'À Vista'
        // };

        const order: OrderDetails = testData.reprovado as OrderDetails;

        await deleteOrderByNumber(order.number);
        await insertOrder(order);

        await app.orderLookup.searchOrder(order.number);

        await app.orderLookup.validateOrderDetails(order);
        await app.orderLookup.validateStatusBadge(order.status);
    });

    test('Deve exibir mensagem de erro quando o pedido não é encontrado', async ({ app }) => {
        const order = generateOrderCode();

        await app.orderLookup.searchOrder(order);

        await app.orderLookup.validateOrderNotFound();

    });

    test('Deve exibir mensagem de erro quando o pedido está fora do padrão', async ({ app }) => {
        const order = 'AB-INVALIDO-9931';

        await app.orderLookup.searchOrder(order);

        await app.orderLookup.validateOrderNotFound();
    });

    test('Deve manter o botao de buscar pedido desabilitado quando o campo de busca está vazio ou quando é preenchido somente com espacos', async ({ app }) => {
        await expect(app.orderLookup.elements.searchButton).toBeDisabled();

        await app.orderLookup.elements.orderInput.fill('   ');
        await expect(app.orderLookup.elements.searchButton).toBeDisabled();
    });

});
