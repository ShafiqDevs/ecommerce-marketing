'use server';

import { imageUrl } from '@/lib/ImageUrl';
import stripe from '@/lib/stripe';
import { BasketItem } from '@/store/store';

export type MetaData = {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	clerkUserId: string;
};

export type GroupedBasketItem = {
	product: BasketItem['product'];
	quantity: number;
};

export async function createCheckoutUrl(
	items: GroupedBasketItem[],
	metadata: MetaData
) {
	try {
		// check if any grouped items dont have a price
		const itemsWithoutPrice = items.filter(
			(item) => !item.product.price
		);
		if (itemsWithoutPrice.length > 0) {
			throw new Error('Some items in the basket have no price');
		}

		// check if user already exists in stripe
		const customers = await stripe.customers.list({
			email: metadata.customerEmail,
			limit: 1,
		});
		let customerId: string | undefined;
		if (customers.data.length > 0) {
			customerId = customers.data[0].id;
		}

		console.log(
			'success url >>>>>',
			`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`
		);

		// create stripe checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			customer_creation: customerId ? undefined : 'always',
			customer_email: !customerId
				? metadata.customerEmail
				: undefined,
			mode: 'payment',
			allow_promotion_codes: true,
			success_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
			cancel_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/basket`,
			line_items: items.map((item) => ({
				price_data: {
					currency: 'gbp',
					unit_amount: Math.round(item.product.price! * 100),
					product_data: {
						name: item.product.name || 'Unnamed Product',
						description: `Product ID: ${item.product._id}`,
						metadata: { id: item.product._id },
						images: item.product.image
							? [imageUrl(item.product.image).url()]
							: undefined,
					},
				},
				quantity: item.quantity,
			})),
			metadata,
		});
		return session.url;
	} catch (error) {
		console.error('Error creating checkout session:', error);
		throw error;
	} finally {
	}
}
