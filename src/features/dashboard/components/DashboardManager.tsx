'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import OrderApprove from '@/assets/icons/order_approve.svg';
import Build from '@/assets/icons/build.svg';
import Event from '@/assets/icons/event.svg';
import AccountBalanceWallet from '@/assets/icons/account_balance_wallet.svg';
import TrendingUp from '@/assets/icons/trending_up.svg';
import WaterDrop from '@/assets/icons/water_drop.svg';
import { useToast } from '@/components/ui/Toast/ToastContext';

function Progress({
	label,
	value,
	tone = 'bg-secondary-container',
}: {
	label: string;
	value: string;
	tone?: string;
}) {
	return (
		<div>
			<div className='flex justify-between text-label-md mb-1'>
				<span>{label}</span>
				<span>{value}</span>
			</div>
			<div className='w-full bg-surface-container h-2 rounded-full overflow-hidden'>
				<div className={`${tone} h-full`} style={{ width: value }} />
			</div>
		</div>
	);
}

export function DashboardManager() {
	const { toast } = useToast();
	const [dashboardData, setDashboardData] = useState<any>(null);
	const router = useRouter();

	const [isAdmin, setIsAdmin] = useState(false);
	const [warehouses, setWarehouses] = useState<any[]>([]);
	const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('');

	useEffect(() => {
		const match = document.cookie.match(
			/(^| )selected_warehouse_id=([^;]+)/,
		);
		if (match) {
			setSelectedWarehouseId(match[2]);
		}

		const supabase = createClient();
		async function checkRole() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data: profile } = await supabase
					.from('profiles')
					.select('role, warehouse_id')
					.eq('id', user.id)
					.single();
				if ((profile as any)?.role === 'admin') {
					setIsAdmin(true);
					if (!match && (profile as any)?.warehouse_id) {
						setSelectedWarehouseId(
							String((profile as any).warehouse_id),
						);
					}
					fetch('/api/warehouses')
						.then((res) => res.json())
						.then((data) => {
							setWarehouses(data || []);
						});
				}
			}
		}
		checkRole();
	}, []);

	const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newId = e.target.value;
		setSelectedWarehouseId(newId);
		document.cookie = `selected_warehouse_id=${newId}; path=/`;
		window.location.reload();
	};

	useEffect(() => {
		fetch('/api/dashboard')
			.then((res) => res.json())
			.then((data) => {
				if (data.error === 'Unauthorized') {
					toast({
						title: 'No se encontró sesión',
						message: 'Redirigiendo al login...',
						type: 'error',
					});
					router.push('/login');
				} else {
					setDashboardData(data);
				}
			})
			.catch((err) =>
				toast({
					title: 'Error al cargar datos',
					message:
						'No se pudo obtener la información del panel de control.',
					type: 'error',
				}),
			);
	}, [router]);

	return (
		<div>
			<div className='pt-8 pb-8 px-4 md:px-8 max-w-7xl mx-auto space-y-6'>
				<section className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
					<div className='space-y-1'>
						<h1 className='text-headline-lg-mobile md:text-headline-lg text-primary'>
							Panel de Control
						</h1>
						<p className='text-body-md text-on-surface-variant'>
							Bienvenido. Aquí está el resumen de hoy.
						</p>
					</div>
					<div className='flex flex-wrap gap-3 items-center'>
						{isAdmin && warehouses.length > 0 && (
							<div className='flex items-center gap-2 mr-2'>
								<span className='text-label-md text-on-surface-variant'>
									Sucursal:
								</span>
								<select
									className='bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-md px-3 py-1.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/50'
									value={selectedWarehouseId}
									onChange={handleWarehouseChange}>
									{warehouses.map((w) => (
										<option key={w.id} value={w.id}>
											{w.name}
										</option>
									))}
								</select>
							</div>
						)}
					</div>
				</section>

				<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					<Card
						variant='default'
						padding='lg'
						className='md:col-span-2 lg:col-span-2 border border-surface-container'>
						<div className='flex justify-between items-start mb-6'>
							<div>
								<span className='text-label-md text-on-surface-variant block mb-1'>
									CUADRE DEL DÍA
								</span>
								<h2 className='text-headline-md text-primary'>
									Ventas Totales
								</h2>
							</div>
							<div className='p-2 bg-secondary-container/20 rounded-lg text-secondary'>
								<AccountBalanceWallet className='w-6 h-6' />
							</div>
						</div>
						<div className='flex items-end justify-between'>
							<div className='space-y-1'>
								<span className='text-headline-xl text-primary'>
									$
									{dashboardData
										? formatCurrency(dashboardData.sales.total)
										: formatCurrency(0)}
								</span>
								<div
									className={`flex items-center gap-1 text-label-md ${dashboardData && dashboardData.sales.increase < 0 ? 'text-red-600' : 'text-green-600'}`}>
									<span>
										<TrendingUp
											className={`w-5 h-5 ${dashboardData && dashboardData.sales.increase < 0 ? 'rotate-180' : ''}`}
										/>
									</span>{' '}
									{dashboardData
										? (dashboardData.sales.increase > 0
												? '+'
												: '') +
											dashboardData.sales.increase.toFixed(
												1,
											) +
											'%'
										: '+12.5%'}{' '}
									vs ayer
								</div>
							</div>
							<div className='h-16 w-32 flex items-end gap-1'>
								<div className='bg-secondary-container w-full h-1/2 rounded-t-sm' />
								<div className='bg-secondary-container w-full h-3/4 rounded-t-sm' />
								<div className='bg-secondary-container w-full h-2/3 rounded-t-sm' />
								<div className='bg-primary w-full h-full rounded-t-sm' />
							</div>
						</div>
					</Card>

					<Card
						variant='default'
						padding='lg'
						className='bg-primary text-on-primary border-0 relative overflow-hidden'>
						<div className='absolute -right-4 -top-4 opacity-10 text-[120px]'>
							<WaterDrop className='w-32 h-32' />
						</div>
						<div className='relative z-10'>
							<span className='text-label-md opacity-80 block mb-1 uppercase tracking-wider'>
								Próximo Mantenimiento
							</span>
							<h2 className='text-headline-sm'>
								{dashboardData?.maintenance
									? dashboardData.maintenance.equipmentName
									: 'Filtro de Arena #4'}
							</h2>
						</div>
						<div className='mt-8 relative z-10'>
							<div className='flex items-center gap-2 mb-4 text-body-md'>
								<span>
									<Event className='w-5 h-5' />
								</span>{' '}
								{dashboardData?.maintenance
									? formatDate(
											dashboardData.maintenance.date,
											{ timeZone: 'UTC' },
										)
									: 'Mañana, 09:00 AM'}
							</div>
							<span className='inline-block px-4 py-1 bg-error text-on-error rounded-full text-label-md animate-pulse'>
								ALERTA CRÍTICA
							</span>
						</div>
					</Card>

					<div className='md:col-span-3 lg:col-span-1 space-y-6'>
						{(!dashboardData || dashboardData.systemHealth) && (
							<Card
								variant='default'
								padding='md'
								className='border border-surface-container'>
								<h4 className='text-label-md text-on-surface-variant mb-4 uppercase'>
									Salud del Sistema
								</h4>
								<div className='space-y-4'>
									{dashboardData?.systemHealth ? (
										dashboardData.systemHealth.map(
											(health: any, i: number) => (
												<Progress
													key={i}
													label={health.label}
													value={health.value}
													tone={health.tone}
												/>
											),
										)
									) : (
										<>
											<Progress
												label='Capacidad del Tanque A'
												value='82%'
											/>
											<Progress
												label='Presión de Bombeo'
												value='95%'
												tone='bg-green-500'
											/>
										</>
									)}
								</div>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
