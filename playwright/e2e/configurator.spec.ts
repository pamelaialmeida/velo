import { test, expect } from '../support/fixtures'

test.describe('Configuração do Veículo', () => {
    test.beforeEach(async ({ app }) => {
        await app.configurator.open();
    });

    test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
        await app.configurator.expectPrice('R$ 40.000,00');

        await app.configurator.selectColor('Midnight Black');
        await app.configurator.expectPrice('R$ 40.000,00');
        await app.configurator.expectCarImageSrc(/midnight-black-aero-wheels/);
    });

    test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
        await app.configurator.expectPrice('R$ 40.000,00');

        await app.configurator.selectWheels(/Sport Wheels/);
        await app.configurator.expectPrice('R$ 42.000,00');
        await app.configurator.expectCarImageSrc(/glacier-blue-sport-wheels/);

        await app.configurator.selectWheels(/Aero Wheels/);
        await app.configurator.expectPrice('R$ 40.000,00');
        await app.configurator.expectCarImageSrc(/glacier-blue-aero-wheels/);
    });

    test('deve atualizar o preço dinamicamente ao selecionar e desselecionar opcionais, e persistir no checkout', async ({ app }) => {
        // Pré-condição: Preço base inicial
        await app.configurator.expectPrice('R$ 40.000,00');

        // Passo 1: Marcar o checkbox do opcional "Precision Park" (+ R$ 5.500,00)
        await app.configurator.togglePrecisionPark();
        await expect(app.configurator.elements.precisionParkCheckbox).toBeChecked();
        await app.configurator.expectPrice('R$ 45.500,00');

        // Passo 2: Marcar o checkbox do opcional "Flux Capacitor" (+ R$ 5.000,00)
        await app.configurator.toggleFluxCapacitor();
        await expect(app.configurator.elements.fluxCapacitorCheckbox).toBeChecked();
        await app.configurator.expectPrice('R$ 50.500,00');

        // Passo 3: Desmarcar os checkboxes dos opcionais (retorno a R$ 40.000,00)
        await app.configurator.togglePrecisionPark();
        await expect(app.configurator.elements.precisionParkCheckbox).not.toBeChecked();

        await app.configurator.toggleFluxCapacitor();
        await expect(app.configurator.elements.fluxCapacitorCheckbox).not.toBeChecked();

        await app.configurator.expectPrice('R$ 40.000,00');

        // Passo 4: Clicar no botão "Monte o Seu" (Checkout) e validar persistência
        await app.configurator.finishConfiguration();
        await app.checkout.expectCheckoutPage();
        await app.checkout.expectTotalPrice('R$ 40.000,00');
    });

})