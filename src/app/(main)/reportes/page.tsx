'use client';

import { useEffect, useState } from 'react';
import { TRANSACTIONS, BAR_DATA } from '@/features/reportes/types';
import { formatCurrency } from '@/lib/utils';
import TrendingUp from '@/assets/icons/trending_up.svg';
import TrendingDown from '@/assets/icons/trending_down.svg';
import WaterDrop from '@/assets/icons/water_drop.svg';
import AccountBalanceWallet from '@/assets/icons/account_balance_wallet.svg';
import Payments from '@/assets/icons/payments.svg';
import ShoppingCart from '@/assets/icons/shopping_cart.svg';
import ChevronRight from '@/assets/icons/chevron_right.svg';
import ArrowUpward from '@/assets/icons/arrow_upward.svg';
import ArrowDownward from '@/assets/icons/arrow_downward.svg';
import Download from '@/assets/icons/download.svg';

/* ─── Page ───────────────────────────────────────────── */
export default function ReportesPage() {
	const [closingDay, setClosingDay] = useState(false);
	const [closed, setClosed] = useState(false);
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/reportes/dashboard')
			.then((res) => res.json())
			.then((json) => {
				setData(json);
				setLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	}, []);

	async function handleClose() {
		setClosingDay(true);
		await new Promise((r) => setTimeout(r, 1000));
		setClosingDay(false);
		setClosed(true);
	}

	return (
		<>
			<main className='pt-8 pb-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8'>
				{/* ── KPI Hero Cards ───────────────────────── */}
				<section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* Ingresos */}
					<div className='bg-[var(--color-surface-container-lowest)] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,77,122,0.08)] border border-[var(--color-surface-container)] flex flex-col gap-2'>
						<div className='flex justify-between items-start'>
							<span className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
								Ingresos Diarios
							</span>
							<div className='p-1 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] rounded-lg'>
								<TrendingUp className='w-5 h-5' />
							</div>
						</div>
						<div className='mt-2'>
							<h2 className='text-headline-lg font-semibold text-[var(--color-primary)]'>
								{data
									? formatCurrency(data.daily.income)
									: '$...'}
							</h2>
							<p
								className={`text-body-sm flex items-center gap-1 ${data && data.daily.incomeIncrease >= 0 ? 'text-[var(--color-secondary)]' : 'text-[var(--color-error)]'}`}>
								{data && data.daily.incomeIncrease >= 0 ? (
									<ArrowUpward className='w-4 h-4' />
								) : (
									<ArrowDownward className='w-4 h-4' />
								)}
								{data
									? `${data.daily.incomeIncrease > 0 ? '+' : ''}${data.daily.incomeIncrease.toFixed(1)}% vs ayer`
									: '...'}
							</p>
						</div>
					</div>

					{/* Gastos */}
					<div className='bg-[var(--color-surface-container-lowest)] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,77,122,0.08)] border border-[var(--color-surface-container)] flex flex-col gap-2'>
						<div className='flex justify-between items-start'>
							<span className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
								Gastos Diarios
							</span>
							<div className='p-1 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] rounded-lg'>
								<TrendingDown className='w-5 h-5' />
							</div>
						</div>
						<div className='mt-2'>
							<h2 className='text-headline-lg font-semibold text-[var(--color-error)]'>
								{data
									? formatCurrency(data.daily.expense)
									: '$...'}
							</h2>
							<p className='text-body-sm text-[var(--color-on-surface-variant)] flex items-center gap-1'>
								{data && data.daily.expenseIncrease >= 0 ? (
									<ArrowUpward className='w-4 h-4' />
								) : (
									<ArrowDownward className='w-4 h-4' />
								)}
								{data
									? `${data.daily.expenseIncrease > 0 ? '+' : ''}${data.daily.expenseIncrease.toFixed(1)}% vs ayer`
									: '...'}
							</p>
						</div>
					</div>

					{/* Utilidad Neta */}
					<div className='bg-[var(--color-primary-container)] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,54,87,0.15)] flex flex-col gap-2 relative overflow-hidden'>
						<div className='absolute right-0 bottom-0 opacity-10 pointer-events-none'>
							<WaterDrop className='w-32 h-32' />
						</div>
						<div className='flex justify-between items-start'>
							<span className='text-label-md font-medium text-[var(--color-primary-fixed)] uppercase tracking-wider'>
								Utilidad Neta
							</span>
							<div className='p-1 bg-[var(--color-on-primary-container)] text-[var(--color-primary)] rounded-lg'>
								<AccountBalanceWallet className='w-5 h-5' />
							</div>
						</div>
						<div className='mt-2 z-10 relative'>
							<h2 className='text-headline-lg font-bold text-white'>
								{data
									? formatCurrency(data.daily.netProfit)
									: '$...'}
							</h2>
							<p className='text-body-sm text-[var(--color-primary-fixed)]'>
								Margen Operativo:{' '}
								{data
									? data.daily.profitMargin.toFixed(1)
									: '...'}
								%
							</p>
						</div>
					</div>
				</section>

				{/* ── Bento: Chart + Distribution ──────────── */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
					{/* Monthly Bar Chart */}
					<section className='lg:col-span-8 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,77,122,0.08)] border border-[var(--color-surface-container)]'>
						<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
							<div>
								<h3 className='text-headline-sm font-semibold text-[var(--color-on-surface)]'>
									Reportes Mensuales
								</h3>
								<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
									Resumen de flujo de caja
								</p>
							</div>
							<div className='flex gap-2'>
								<button className='bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] px-4 py-1 rounded-lg text-label-md font-medium hover:bg-[var(--color-surface-variant)] transition-colors'>
									Este Año
								</button>
								<button className='bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-1 rounded-lg text-label-md font-medium flex items-center gap-1 hover:opacity-90 transition-opacity'>
									<Download className='w-4 h-4' />
									Exportar Reporte
								</button>
							</div>
						</div>

						{/* Bar Chart */}
						<div className='h-64 flex items-end justify-between gap-2 px-4 border-b border-[var(--color-outline-variant)] pb-2'>
							{(data?.barData || BAR_DATA).map(
								([label, height, active, rawValue]: any) => (
									<div
										key={label}
										className='flex flex-col items-center flex-1 gap-2'>
										<div
											className={`w-full rounded-t-lg transition-colors ${
												active
													? 'bg-[var(--color-secondary)]'
													: 'bg-[var(--color-secondary-fixed)] hover:bg-[var(--color-secondary)]'
											}`}
											style={{ height }}
											title={`${label}: ${rawValue ? formatCurrency(rawValue) : 'datos'}`}
										/>
										<span
											className={`text-label-md font-medium ${
												active
													? 'text-[var(--color-primary)] font-bold'
													: 'text-[var(--color-on-surface-variant)]'
											}`}>
											{label}
										</span>
									</div>
								),
							)}
						</div>
					</section>

					{/* Right Side */}
					<section className='lg:col-span-4 flex flex-col gap-6'>
						{/* Distribución */}
						<div className='bg-[var(--color-surface-container-lowest)] rounded-xl p-6 shadow-[0_4px_12px_rgba(0,77,122,0.08)] border border-[var(--color-surface-container)] flex-1'>
							<h3 className='text-headline-sm font-semibold text-[var(--color-on-surface)] mb-4'>
								Distribución
							</h3>
							<ul className='space-y-4'>
								{(
									data?.distribution || [
										{
											label: 'Venta Agua',
											pct: '65%',
											dot: 'bg-[var(--color-secondary)]',
										},
										{
											label: 'Servicios',
											pct: '25%',
											dot: 'bg-[var(--color-secondary-container)]',
										},
										{
											label: 'Otros',
											pct: '10%',
											dot: 'bg-[var(--color-surface-variant)]',
										},
									]
								).map(({ label, pct, dot }: any) => (
									<li
										key={label}
										className='flex items-center justify-between'>
										<div className='flex items-center gap-4'>
											<span
												className={`w-3 h-3 rounded-full ${dot}`}
											/>
											<span className='text-body-md text-[var(--color-on-surface-variant)] truncate max-w-[150px]'>
												{label}
											</span>
										</div>
										<span className='text-label-md font-bold text-[var(--color-on-surface)]'>
											{pct}
										</span>
									</li>
								))}
							</ul>
							<div className='mt-8 pt-6 border-t border-[var(--color-outline-variant)]'>
								<button className='w-full py-2 border border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-xl text-label-md font-medium hover:bg-[var(--color-secondary-fixed)] transition-colors'>
									Ver Desglose Completo
								</button>
							</div>
						</div>

						{/* Cierre de Caja */}
						<div className='bg-[var(--color-surface-container-high)] rounded-xl p-6 border border-[var(--color-primary-fixed-dim)] relative overflow-hidden group hover:shadow-md transition-all'>
							<h4 className='text-headline-sm font-semibold text-[var(--color-primary)] mb-1'>
								Cierre de Caja
							</h4>
							<p className='text-body-sm text-[var(--color-on-surface-variant)] mb-4'>
								Confirma los totales del día antes de finalizar.
							</p>
							<button
								onClick={handleClose}
								disabled={closingDay || closed}
								className='bg-[var(--color-primary)] text-white w-full py-4 rounded-xl text-headline-sm font-semibold shadow-lg active:scale-95 transition-all disabled:opacity-60'>
								{closed
									? '✓ Día Cerrado'
									: closingDay
										? 'Procesando…'
										: 'Cerrar Día Actual'}
							</button>
						</div>
					</section>
				</div>

				{/* ── Recent Transactions Table ─────────────── */}
				<section className='bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] border border-[var(--color-surface-container)] overflow-hidden'>
					<div className='p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center'>
						<h3 className='text-headline-sm font-semibold text-[var(--color-on-surface)]'>
							Últimos Movimientos
						</h3>
						<button className='text-[var(--color-secondary)] text-label-md font-medium flex items-center gap-1 hover:underline'>
							Ver todos
							<ChevronRight className='w-4 h-4' />
						</button>
					</div>
					<div className='overflow-x-auto'>
						<table className='w-full text-left border-collapse'>
							<thead className='bg-[var(--color-surface-container-low)]'>
								<tr>
									{[
										'Concepto',
										'Categoría',
										'Hora',
										'Monto',
									].map((h) => (
										<th
											key={h}
											className={`px-6 py-4 text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider ${
												h === 'Monto'
													? 'text-right'
													: ''
											}`}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody className='divide-y divide-[var(--color-outline-variant)]'>
								{(data?.lastMovements || TRANSACTIONS).map(
									(tx: any) => (
										<tr
											key={tx.id}
											className='hover:bg-[var(--color-surface-container-low)] transition-colors'>
											<td className='px-6 py-4'>
												<div className='flex items-center gap-4'>
													{tx.icon === 'payments' ? (
														<Payments className='w-6 h-6 text-[var(--color-secondary)]' />
													) : (
														<ShoppingCart className='w-6 h-6 text-[var(--color-secondary)]' />
													)}
													<span className='text-body-md text-[var(--color-on-surface)]'>
														{tx.concept}
													</span>
												</div>
											</td>
											<td className='px-6 py-4 text-body-sm text-[var(--color-on-surface-variant)]'>
												{tx.category}
											</td>
											<td className='px-6 py-4 text-body-sm text-[var(--color-on-surface-variant)]'>
												{tx.time}
											</td>
											<td
												className={`px-6 py-4 text-body-md font-bold text-right ${
													tx.amount > 0
														? 'text-[var(--color-secondary)]'
														: 'text-[var(--color-error)]'
												}`}>
												{tx.amount > 0 ? '+' : '-'}
												{formatCurrency(tx.amount)}
											</td>
										</tr>
									),
								)}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</>
	);
}
