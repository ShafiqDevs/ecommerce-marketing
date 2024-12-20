import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import { SanityLive } from '@/sanity/lib/live';
import { DisableDraftMode } from '@/components/DisableDraftMode';
import { VisualEditing } from 'next-sanity';
import { draftMode } from 'next/headers';
import { Toaster } from '@/components/ui/toaster';

const geistSans = localFont({
	src: '../fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: '../fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Shoppr marketplace',
	description:
		'Exclusive offers with Black Friday deals. use #BFRIDAY now for 25%',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider dynamic>
			<html lang='en'>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<main>
						<Header />
						{children}
					</main>
					<Toaster />
					<SanityLive />
					{(await draftMode()).isEnabled && (
						<>
							<DisableDraftMode />
							<VisualEditing />
						</>
					)}
				</body>
			</html>
		</ClerkProvider>
	);
}
