import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const salesType = defineType({
	name: 'sale',
	title: 'Sale',
	type: 'document',
	icon: TagIcon,
	fields: [
		defineField({
			name: 'title',
			title: 'Sale Title',
			type: 'string',
		}),
		defineField({
			name: 'description',
			title: 'Sales Description',
			type: 'text',
		}),
		defineField({
			name: 'discountAmount',
			title: 'Discount Amount',
			type: 'number',
			description: 'Amount of in percentage or fixed value',
		}),
		defineField({
			name: 'couponCode',
			title: 'Coupon Code',
			type: 'string',
		}),
		defineField({
			name: 'validFrom',
			title: 'Valid From',
			type: 'datetime',
		}),
		defineField({
			name: 'validUntil',
			title: 'Valid Until',
			type: 'datetime',
		}),
		defineField({
			name: 'isActive',
			title: 'Is Active?',
			type: 'boolean',
			description: 'toggle to activate/deactivate the sale',
		}),
	],
	preview: {
		select: {
			title: 'title',
			discountAmount: 'discountAmount',
			couponCode: 'couponCode',
			isActive: 'isActive',
		},
		prepare(selection) {
			const { couponCode, discountAmount, isActive, title } =
				selection;
			const status = isActive ? 'Active' : 'Inactive';
			return {
				title,
				subtitle: `${discountAmount}% off - Code: ${couponCode} - ${status}}`,
			};
		},
	},
});
