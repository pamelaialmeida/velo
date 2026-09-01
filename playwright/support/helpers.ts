export function generateOrderCode() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    return 'VLO-' + Array.from({ length: 6 }, () =>
        caracteres[Math.floor(Math.random() * caracteres.length)]
    ).join('');
}