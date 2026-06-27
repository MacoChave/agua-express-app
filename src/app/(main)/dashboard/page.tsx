'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from '@/components/ui';
import OrderApprove from '@/assets/icons/order_approve.svg';
import Build from '@/assets/icons/build.svg';
import Event from '@/assets/icons/event.svg';
import Download from '@/assets/icons/download.svg';
import AccountBalanceWallet from '@/assets/icons/account_balance_wallet.svg';
import TrendingUp from '@/assets/icons/trending_up.svg';
import WaterDrop from '@/assets/icons/water_drop.svg';

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

export default function DashboardPage() {
	const [dashboardData, setDashboardData] = useState<any>(null);

	useEffect(() => {
		fetch('/api/dashboard')
			.then((res) => res.json())
			.then((data) => {
				setDashboardData(data);
			})
			.catch((err) =>
				console.error('Failed to fetch dashboard data:', err),
			);
	}, []);

	return (
		<div>
			<div className='pt-8 px-4 md:px-8 max-w-7xl mx-auto space-y-6'>
				<section className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
					<div className='space-y-1'>
						<h1 className='text-headline-lg-mobile md:text-headline-lg text-primary'>
							Panel de Control
						</h1>
						<p className='text-body-md text-on-surface-variant'>
							Bienvenido, Planta Central. Aquí está el resumen de
							hoy.
						</p>
					</div>
					<div className='flex flex-wrap gap-3'>
						<Button className='rounded-xl'>
							<span>
								<OrderApprove className='w-5 h-5' />
							</span>
							Nuevo Pedido
						</Button>
						<Button variant='secondary' className='rounded-xl'>
							<span>
								<Build className='w-5 h-5' />
							</span>
							Registrar Mantenimiento
						</Button>
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
										? dashboardData.sales.total.toLocaleString(
												'es-MX',
												{ minimumFractionDigits: 2 },
											)
										: '12,450.00'}
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
									? new Date(
											dashboardData.maintenance.date,
										).toLocaleDateString('es-MX')
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
						{/* 
						<Card
							variant='flat'
							padding='md'
							className='relative overflow-hidden'>
							<h4 className='text-headline-sm text-primary mb-1'>
								Reportes
							</h4>
							<p className='text-body-sm text-on-surface-variant mb-4'>
								Descarga el reporte semanal de purificación.
							</p>
							<a
								href='/api/reports/pdf'
								download='reporte_dashboard.pdf'
								className='block w-full'>
								<Button variant='secondary' fullWidth>
									<span className='text-primary'>
										<Download className='w-5 h-5 mr-2' />
									</span>
									Generar PDF
								</Button>
							</a>
						</Card> */}
					</div>
				</div>
			</div>
		</div>
	);
}
