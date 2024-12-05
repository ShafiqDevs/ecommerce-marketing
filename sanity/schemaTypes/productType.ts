import { TrolleyIcon } from '@sanity/icons';
import { Subtitles } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const productType = defineType({
	name: 'product',
	title: 'Products',
	type: 'document',
	icon: TrolleyIcon,
	fields: [
		defineField({
			name: 'name',
			title: 'Product Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'name', maxLength: 96 },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Product Image',
			type: 'image',
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: 'description',
			type: 'blockContent',
			title: 'Description',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'price',
			title: 'Product Price',
			type: 'number',
			validation: (Rule) => Rule.required().min(0),
		}),
		defineField({
			name: 'categories',
			title: 'Categories',
			type: 'array',
			of: [{ type: 'reference', to: { type: 'category' } }],
		}),
		defineField({
			name: 'stock',
			title: 'Stock',
			type: 'number',
			validation: (Rule) => Rule.required().min(0),
		}),
	],
	preview: {
		select: {
			title: 'name',
			media: 'image',
			price: 'price',
		},
		prepare(select) {
			return {
				title: select.title,
				subtitle: `$${select.price}`,
				media: select.media,
			};
		},
	},
});