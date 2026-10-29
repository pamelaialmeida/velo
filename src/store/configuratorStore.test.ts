import { describe, it, expect } from 'vitest'
import { calculateTotalPrice, calculateInstallment, formatPrice, CarConfiguration, useConfiguratorStore } from './configuratorStore'

describe('configuratorStore pure functions', () => {
    describe('calculateTotalPrice', () => {
        it('should calculate base price with aero wheels and no optionals', () => {
            const config: CarConfiguration = {
                exteriorColor: 'glacier-blue',
                interiorColor: 'carbon-black',
                wheelType: 'aero',
                optionals: []
            }
            expect(calculateTotalPrice(config)).toBe(40000);
        })

        it('should add sport wheels price correctly', () => {
            const config: CarConfiguration = {
                exteriorColor: 'glacier-blue',
                interiorColor: 'carbon-black',
                wheelType: 'sport',
                optionals: []
            }
            expect(calculateTotalPrice(config)).toBe(42000);
        })

        it('should add optionals price correctly', () => {
            const config: CarConfiguration = {
                exteriorColor: 'glacier-blue',
                interiorColor: 'carbon-black',
                wheelType: 'aero',
                optionals: ['precision-park', 'flux-capacitor']
            }
            expect(calculateTotalPrice(config)).toBe(40000 + 5500 + 5000);
        })
    })

    describe('calculateInstallment', () => {
        it('should calculate 12x installment with 2% monthly interest correctly', () => {
            const total = 40000;
            const installment = calculateInstallment(total);
            expect(installment).toBe(3782.38);
        })
    })

    describe('formatPrice', () => {
        it('should format numbers to BRL currency string', () => {
            const formatted = formatPrice(40000);
            const normalized = formatted.replace(/\u00A0/g, ' ');
            expect(normalized).toContain('R$');
            expect(normalized).toContain('40.000,00');
        })
    })
})

describe('configuratorStore actions', () => {
    it('should toggle an optional feature correctly', () => {
        useConfiguratorStore.getState().resetConfiguration();

        expect(useConfiguratorStore.getState().configuration.optionals).toEqual([]);

        useConfiguratorStore.getState().toggleOptional('precision-park');
        expect(useConfiguratorStore.getState().configuration.optionals).toContain('precision-park');

        useConfiguratorStore.getState().toggleOptional('precision-park');
        expect(useConfiguratorStore.getState().configuration.optionals).not.toContain('precision-park');
    })

    it('should handle login logic depending on previous orders', () => {
        useConfiguratorStore.setState({ orders: [] });
        useConfiguratorStore.getState().logout();

        const loginResult1 = useConfiguratorStore.getState().login('test@example.com');
        expect(loginResult1).toBe(false);
        expect(useConfiguratorStore.getState().currentUserEmail).toBeNull();

        useConfiguratorStore.setState({
            orders: [
                {
                    id: '1',
                    configuration: { exteriorColor: 'glacier-blue', interiorColor: 'carbon-black', wheelType: 'aero', optionals: [] },
                    totalPrice: 40000,
                    customer: { name: 'Test', surname: 'User', email: 'test@example.com', phone: '', cpf: '', store: '' },
                    paymentMethod: 'avista',
                    status: 'APROVADO',
                    createdAt: new Date().toISOString()
                }
            ]
        });

        const loginResult2 = useConfiguratorStore.getState().login('test@example.com');
        expect(loginResult2).toBe(true);
        expect(useConfiguratorStore.getState().currentUserEmail).toBe('test@example.com');
    })
})