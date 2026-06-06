'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─── Nav items ─────────────────────────────────────── */
const NAV_ITEMS = [
	{
		href: '/dashboard',
		icon: 'dashboard',
		label: 'Dashboard',
	},
	{
		href: '/pedidos',
		icon: 'receipt_long',
		label: 'Pedidos',
	},
	{
		href: '/mantenimientos',
		icon: 'build',
		label: 'Mant.',
	},
	{
		href: '/reportes',
		icon: 'analytics',
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
			{/* ── Top App Bar ──────────────────────────── */}
			<header
				className='fixed top-0 left-0 right-0 z-50 h-16 flex justify-between items-center px-4 md:px-12 border-b'
				style={{
					backgroundColor: 'var(--color-surface)',
					borderColor: 'var(--color-outline-variant)',
				}}>
				{/* Brand */}
				<Link href='/dashboard' className='flex items-center gap-3'>
					<span
						className='material-symbols-outlined text-2xl'
						style={{ color: 'var(--color-primary)' }}>
						water_drop
					</span>
					<span
						className='text-headline-md font-bold'
						style={{ color: 'var(--color-primary)' }}>
						AquaFlow Manager
					</span>
				</Link>

				{/* Actions */}
				<div className='flex items-center gap-3'>
					<button
						className='relative p-2 rounded-full transition-colors'
						style={{ color: 'var(--color-on-surface-variant)' }}
						aria-label='Notificaciones'
						onMouseEnter={(e) =>
							((
								e.currentTarget as HTMLElement
							).style.backgroundColor =
								'var(--color-surface-container)')
						}
						onMouseLeave={(e) =>
							((
								e.currentTarget as HTMLElement
							).style.backgroundColor = 'transparent')
						}>
						<span className='material-symbols-outlined'>
							notifications
						</span>
						<span
							className='absolute top-2 right-2 w-2 h-2 rounded-full'
							style={{ backgroundColor: 'var(--color-error)' }}
						/>
					</button>

					<div
						className='w-10 h-10 rounded-full border-2 flex items-center justify-center text-label-md font-bold overflow-hidden'
						style={{
							borderColor: 'var(--color-primary-container)',
							backgroundColor: 'var(--color-surface-container)',
							color: 'var(--color-primary)',
						}}>
						TC
					</div>
				</div>
			</header>

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
				{NAV_ITEMS.map(({ href, icon, label }) => {
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
												'var(--color-secondary-container)',
											color: 'var(--color-on-secondary-container)',
										}
									: {
											color: 'var(--color-on-surface-variant)',
										}
							}>
							<span
								className='material-symbols-outlined'
								style={
									active
										? { fontVariationSettings: "'FILL' 1" }
										: {}
								}>
								{icon}
							</span>
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
				{NAV_ITEMS.map(({ href, icon, label }) => {
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
												'var(--color-secondary-container)',
											color: 'var(--color-on-secondary-container)',
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
							<span
								className='material-symbols-outlined shrink-0'
								style={
									active
										? { fontVariationSettings: "'FILL' 1" }
										: {}
								}>
								{icon}
							</span>
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
