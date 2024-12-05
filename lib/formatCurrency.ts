export function formatCurrency(
	amount: number,
	currency: string = 'GBP'
) {
	try {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: currency,
		}).format(amount);
	} catch (error) {
		// Fallback formatting if currency code is invalid
		console.error('Invalid currency code:', currency, error);
		return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
	}
}
