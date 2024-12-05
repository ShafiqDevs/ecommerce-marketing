import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export async function getmyOrders(userId: string) {
	if (!userId) throw new Error('User ID is required');

	//Defind the query to get orders based on user ID, sorte dby orderDate descending
	const MY_ORDERS_QUERY = defineQuery(`
        *[
            _type == "order"
            && clerkUserId == $userId
        ] | order(orderDate desc){
            ...,
            products[]{
                ...,
                product->
            }
        }
        `);

	try {
		const orders = await sanityFetch({
			query: MY_ORDERS_QUERY,
			params: { userId },
		});
		//Return the list of orders, or an empty array if none are found
		return orders.data || [];
	} catch (error) {
		console.error('Error fetching orders:', error);
		return [];
	}
}
