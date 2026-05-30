'use client';

import { useState } from 'react';

/* ─── Types ─────────────────────────────────────────── */
interface Transaction {
	id: number;
	concept: string;
	category: string;
	time: string;
	amount: number;
	icon: string;
}

/* ─── Static data ────────────────────────────────────── */
const TRANSACTIONS: Transaction[] = [
	{
		id: 1,
		concept: 'Venta de Bidones x20',
		category: 'Venta Directa',
		time: '14:25 PM',
		amount: 120.0,
		icon: 'water_drop',
	},
	{
		id: 2,
		concept: 'Repuesto Filtro UV',
		category: 'Mantenimiento',
		time: '11:40 AM',
		amount: -345.0,
		icon: 'build',
	},
	{
		id: 3,
		concept: 'Recarga Energía Planta',
		category: 'Servicios',
		time: '09:15 AM',
		amount: -150.25,
		icon: 'electric_bolt',
	},
];

/* Bar chart data: [label, heightPx, active] */
const BAR_DATA: [string, number, boolean][] = [
	['ENE', 128, false],
	['FEB', 160, false],
	['MAR', 96, false],
	['ABR', 208, true],
	['MAY', 144, false],
	['JUN', 192, false],
];

function fmt(n: number) {
	return new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(Math.abs(n));
}

/* ─── Page ───────────────────────────────────────────── */
export default function ReportesPage() {
	const [closingDay, setClosingDay] = useState(false);
	const [closed, setClosed] = useState(false);

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
								<span className='material-symbols-outlined text-xl'>
									trending_up
								</span>
							</div>
						</div>
						<div className='mt-2'>
							<h2 className='text-headline-lg font-semibold text-[var(--color-primary)]'>
								$4,250.00
							</h2>
							<p className='text-[var(--color-secondary)] text-body-sm flex items-center gap-1'>
								<span className='material-symbols-outlined text-sm'>
									arrow_upward
								</span>
								+12% vs ayer
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
								<span className='material-symbols-outlined text-xl'>
									trending_down
								</span>
							</div>
						</div>
						<div className='mt-2'>
							<h2 className='text-headline-lg font-semibold text-[var(--color-error)]'>
								$1,120.50
							</h2>
							<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
								Mantenimiento y Suministros
							</p>
						</div>
					</div>

					{/* Utilidad Neta */}
					<div className='bg-[var(--color-primary-container)] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,54,87,0.15)] flex flex-col gap-2 relative overflow-hidden'>
						<div className='absolute right-0 bottom-0 opacity-10 pointer-events-none'>
							<span
								className='material-symbols-outlined'
								style={{ fontSize: 120 }}>
								water_drop
							</span>
						</div>
						<div className='flex justify-between items-start'>
							<span className='text-label-md font-medium text-[var(--color-primary-fixed)] uppercase tracking-wider'>
								Utilidad Neta
							</span>
							<div className='p-1 bg-[var(--color-on-primary-container)] text-[var(--color-primary)] rounded-lg'>
								<span className='material-symbols-outlined text-xl'>
									account_balance_wallet
								</span>
							</div>
						</div>
						<div className='mt-2 z-10 relative'>
							<h2 className='text-headline-lg font-bold text-white'>
								$3,129.50
							</h2>
							<p className='text-body-sm text-[var(--color-primary-fixed)]'>
								Margen Operativo: 73.6%
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
									Resumen de flujo de caja 2024
								</p>
							</div>
							<div className='flex gap-2'>
								<button className='bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] px-4 py-1 rounded-lg text-label-md font-medium hover:bg-[var(--color-surface-variant)] transition-colors'>
									Este Año
								</button>
								<button className='bg-[var(--color-primary)] text-[var(--color-on-primary)] px-4 py-1 rounded-lg text-label-md font-medium flex items-center gap-1 hover:opacity-90 transition-opacity'>
									<span className='material-symbols-outlined text-base'>
										download
									</span>
									Exportar Reporte
								</button>
							</div>
						</div>

						{/* Bar Chart */}
						<div className='h-64 flex items-end justify-between gap-2 px-4 border-b border-[var(--color-outline-variant)] pb-2'>
							{BAR_DATA.map(([label, height, active]) => (
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
										title={`${label}: datos`}
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
							))}
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
								{[
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
								].map(({ label, pct, dot }) => (
									<li
										key={label}
										className='flex items-center justify-between'>
										<div className='flex items-center gap-4'>
											<span
												className={`w-3 h-3 rounded-full ${dot}`}
											/>
											<span className='text-body-md text-[var(--color-on-surface-variant)]'>
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
							<span className='material-symbols-outlined text-base'>
								chevron_right
							</span>
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
								{TRANSACTIONS.map((tx) => (
									<tr
										key={tx.id}
										className='hover:bg-[var(--color-surface-container-low)] transition-colors'>
										<td className='px-6 py-4'>
											<div className='flex items-center gap-4'>
												<span
													className={`material-symbols-outlined ${
														tx.amount > 0
															? 'text-[var(--color-secondary)]'
															: 'text-[var(--color-error)]'
													}`}>
													{tx.icon}
												</span>
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
											{fmt(tx.amount)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</main>
		</>
	);
}
