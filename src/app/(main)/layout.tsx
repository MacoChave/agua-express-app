'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Dashboard from '@/assets/icons/dashboard.svg';
import OrderApprove from '@/assets/icons/order_approve.svg';
import Build from '@/assets/icons/build.svg';
import Analitics from '@/assets/icons/analitics.svg';
import Event from '@/assets/icons/event.svg';
import AppBar from '@/components/ui/AppBar/AppBar';

/* ─── Nav items ─────────────────────────────────────── */
const NAV_ITEMS = [
	{
		href: '/dashboard',
		icon: Dashboard,
		label: 'Dashboard',
	},
	{
		href: '/catalogos',
		icon: Event,
		label: 'Catálogos',
	},
	{
		href: '/pedidos',
		icon: OrderApprove,
		label: 'Pedidos',
	},
	{
		href: '/mantenimientos',
		icon: Build,
		label: 'Mant.',
	},
	{
		href: '/reportes',
		icon: Analitics,
		label: 'Reportes',
	},
] as const;

/* ─── Layout ─────────────────────────────────────────── */
export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<div
			className='min-h-screen'
			style={{
				backgroundColor: 'var(--color-background)',
				color: 'var(--color-on-surface)',
			}}>
			<AppBar />

			{/* ── Page content ────────────────────────── */}
			<main className='pt-16 pb-24 md:pb-0 md:pl-20 lg:pl-56'>
				{children}
			</main>
			{/* ── Bottom Nav (all screens on mobile, sidebar on desktop) ── */}
			{/* Mobile bottom nav */}
			<nav
				className='md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 h-20 rounded-t-xl'
				style={{
					backgroundColor: 'var(--color-surface-container-lowest)',
					boxShadow: '0 -4px 12px rgba(0,77,122,0.08)',
				}}>
				{NAV_ITEMS.map(({ href, icon: Icon, label }) => {
					const active =
						pathname === href || pathname.startsWith(href + '/');
					return (
						<Link
							key={href}
							href={href}
							className='flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all active:scale-90'
							style={
								active
									? {
											backgroundColor:
												'var(--color-primary-container)',
											color: 'var(--color-on-primary-container)',
										}
									: {
											color: 'var(--color-on-surface-variant)',
										}
							}>
							<Icon
								className='w-6 h-6 shrink-0'
								fill={
									active
										? 'var(--color-on-primary-container)'
										: 'var(--color-primary)'
								}
							/>
							<span className='text-label-md mt-0.5'>
								{label}
							</span>
						</Link>
					);
				})}
			</nav>

			{/* Desktop sidebar nav */}
			<aside
				className='hidden md:flex flex-col fixed left-0 top-16 bottom-0 w-20 lg:w-56 z-40 border-r py-6'
				style={{
					backgroundColor: 'var(--color-surface)',
					borderColor: 'var(--color-outline-variant)',
				}}>
				{NAV_ITEMS.map(({ href, icon: Icon, label }) => {
					const active =
						pathname === href || pathname.startsWith(href + '/');
					return (
						<Link
							key={href}
							href={href}
							className='flex items-center gap-3 mx-3 px-3 py-3 rounded-xl transition-all mb-1'
							style={
								active
									? {
											backgroundColor:
												'var(--color-primary-container)',
											color: 'var(--color-on-primary-container)',
											fontWeight: 600,
										}
									: {
											color: 'var(--color-on-surface-variant)',
										}
							}
							onMouseEnter={(e) => {
								if (!active)
									(
										e.currentTarget as HTMLElement
									).style.backgroundColor =
										'var(--color-surface-container)';
							}}
							onMouseLeave={(e) => {
								if (!active)
									(
										e.currentTarget as HTMLElement
									).style.backgroundColor = 'transparent';
							}}>
							<Icon
								className='w-6 h-6 shrink-0'
								fill={
									active
										? 'var(--color-on-primary-container)'
										: 'var(--color-primary)'
								}
							/>
							<span className='hidden lg:block text-body-md'>
								{label}
							</span>
						</Link>
					);
				})}
			</aside>
		</div>
	);
}
