import { Category, Product } from '@/sanity.types';
import React from 'react';
import ProductGrid from './ProductGrid';
import CategorySelector from './CategorySelector';

type Props = {
	products: Product[];
	categories: Category[];
};

export default function ProductsView({
	products,
	categories,
}: Props) {
	return (
		<div className='flex flex-col'>
			{/* categories */}
			<div className='w-full sm:w-[200px]'>
				<CategorySelector categories={categories} />
			</div>
			{/* products */}
			<div className='flex-1'>
				<div>
					<ProductGrid products={products} />
					<hr className='w-1/2 sm:w-3/4' />
				</div>
			</div>
		</div>
	);
}
