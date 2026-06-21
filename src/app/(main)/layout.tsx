'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Notifications from '@/assets/icons/notifications.svg';
import Dashboard from '@/assets/icons/dashboard.svg';
import OrderApprove from '@/assets/icons/order_approve.svg';
import Build from '@/assets/icons/build.svg';
import Analitics from '@/assets/icons/analitics.svg';
import Event from '@/assets/icons/event.svg';
import Person from '@/assets/icons/person.svg';
import Logout from '@/assets/icons/logout.svg';
import ManageAccounts from '@/assets/icons/manage_accounts.svg';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

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
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const supabase = createClient();

	useEffect(() => {
		async function checkRole() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data: profile } = await supabase
					.from('profiles')
					.select('role')
					.eq('id', user.id)
					.single();
				setIsAdmin(profile?.role === 'admin');
			}
		}
		checkRole();

		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [supabase]);

	const handleLogout = async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			router.push('/login');
			router.refresh();
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

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
							<Notifications className='w-6 h-6' />
						</span>
						<span
							className='absolute top-2 right-2 w-2 h-2 rounded-full'
							style={{ backgroundColor: 'var(--color-error)' }}
						/>
					</button>

					{/* Profile Dropdown Container */}
					<div className='relative' ref={menuRef}>
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className='w-10 h-10 rounded-full border-2 flex items-center justify-center text-label-md font-bold overflow-hidden transition-transform active:scale-95'
							style={{
								borderColor: 'var(--color-primary-container)',
								backgroundColor:
									'var(--color-surface-container)',
								color: 'var(--color-primary)',
							}}>
							TC
						</button>

						{/* Dropdown Menu */}
						{menuOpen && (
							<div className='absolute right-0 mt-2 w-56 bg-[var(--color-surface-container-lowest)] rounded-xl shadow-2xl border border-[var(--color-outline-variant)] py-2 z-[60] animate-in fade-in zoom-in-95 duration-200'>
								<div className='px-4 py-3 border-b border-[var(--color-outline-variant)] mb-1'>
									<p className='text-label-md text-[var(--color-on-surface-variant)] uppercase'>
										Usuario
									</p>
									<p className='text-body-md font-bold truncate'>
										Técnico de Control
									</p>
								</div>

								<Link
									href='/profile'
									onClick={() => setMenuOpen(false)}
									className='flex items-center gap-3 px-4 py-2 text-body-md text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors'>
									<Person className='w-5 h-5' />
									Mi Perfil
								</Link>

								{isAdmin && (
									<Link
										href='/users'
										onClick={() => setMenuOpen(false)}
										className='flex items-center gap-3 px-4 py-2 text-body-md text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)] transition-colors'>
										<ManageAccounts className='w-5 h-5' />
										Gestión de Usuarios
									</Link>
								)}

								<button
									onClick={() => {
										setMenuOpen(false);
										handleLogout();
									}}
									className='w-full flex items-center gap-3 px-4 py-2 text-body-md text-[var(--color-error)] hover:bg-[var(--color-error-container)]/10 transition-colors border-t border-[var(--color-outline-variant)] mt-1'>
									<Logout className='w-5 h-5' />
									Cerrar Sesión
								</button>
							</div>
						)}
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
