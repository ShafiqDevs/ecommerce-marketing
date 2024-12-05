import { MetaData } from '@/actions/createCheckoutSession';
import stripe from '@/lib/stripe';
import { Order } from '@/sanity.types';
import { client } from '@/sanity/lib/backendClient';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
	const body = await req.text();
	const headersList = await headers();
	const sig = headersList.get('stripe-signature');

	if (!sig) {
		return NextResponse.json(
			{ error: 'No signature' },
			{ status: 400 }
		);
	}
	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
	if (!webhookSecret) {
		console.log('⚠️ Stripe webhook secret is not set.');
		return NextResponse.json(
			{
				error: 'Stripe webhook secret is not set',
			},
			{ status: 400 }
		);
	}

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (error) {
		console.error('Webhook signature verification failed:', error);
		return NextResponse.json(
			{ error: `Webhook Error: ${error}` },
			{ status: 400 }
		);
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;
		console.log('1️⃣ session meta data>>>>', session.metadata);
		try {
			const order = await createOrderInSanity(session);
			console.log('Orer created in sanity:', order);
			return NextResponse.json(
				{
					order,
				},
				{ status: 200 }
			);
		} catch (error) {
			console.error('Error creating order in Sanity:', error);
			return NextResponse.json(
				{ error: `Error creating order in Sanity: ${error}` },
				{ status: 500 }
			);
		}
	}
	return NextResponse.json({ received: true }, { status: 200 });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
	const {
		id,
		amount_total,
		currency,
		metadata,
		payment_intent,
		customer,
		total_details,
	} = session;
	console.log('SESSION METADATA>>>', session.metadata);

	const { orderNumber, customerName, customerEmail, clerkUserId } =
		metadata as MetaData;
	const lineItemsWithProduct =
		await stripe.checkout.sessions.listLineItems(id, {
			expand: ['data.price.product'],
		});

	const sanityProducts = lineItemsWithProduct.data.map((item) => ({
		_key: crypto.randomUUID(),
		product: {
			_type: 'reference',
			_ref: (item.price?.product as Stripe.Product)?.metadata?.id,
		},
		quantity: item.quantity || 0,
	}));
	const order = await client.create({
		_type: 'order',
		orderNumber,
		stripeCheckoutSessionId: id,
		stripePaymentIntentId: payment_intent,
		customerName,
		stripeCustomerId: customer,
		clerkUserId: clerkUserId,
		email: customerEmail,
		currency,
		amountDiscount: total_details?.amount_discount
			? total_details?.amount_discount / 100
			: 0,
		products: sanityProducts,
		totalPrice: amount_total ? amount_total / 100 : 0,
		status: 'paid',
		orderDate: new Date().toISOString(),
	});
	return order;
}