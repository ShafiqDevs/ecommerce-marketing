'use client';
import React from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Props = {
	text: string;
};

export default function CopyToClipBoard({ text }: Props) {
	const { toast } = useToast();

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					onClick={() => {
						navigator.clipboard.writeText(text);
						toast({
							variant: 'default',
							description: 'Order number copied to clipboard',
							duration: 3000,
						});
					}}
					className='flex items-center justify-between gap-2 border border-slate-50 p-2 rounded-md shadow-sm hover:scale-[103%] transition-transform duration-200'>
					<span>{text}</span>
					<Copy />
				</TooltipTrigger>
				<TooltipContent>
					<p>click to copy order number</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
