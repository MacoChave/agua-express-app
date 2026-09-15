'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, Card, StatusChip } from '@/components/ui';
import { apiClient } from '@/lib/apiClient';
import { formatCurrency, formatDate } from '@/lib/utils';
import Add from '@/assets/icons/add.svg';
import ArrowLeft from '@/assets/icons/arrow_left.svg';
import ArrowRight from '@/assets/icons/arrow_right.svg';
import DatePicker, {
	DatePickerValue,
} from '@/components/ui/DatePicker/DatePicker';
import { AnadirPedidoManager } from '@/features/pedidos/components/AnadirPedidoManager';

const PAGE_SIZE = 10;

export interface InventoryMovement {
	move_type: 'VENTA' | 'COMPRA';
	quantity?: number | string;
	price?: number | string;
	expense_type_id?: string | number;
	notes?: string;
	move_date: string;
}

export function PedidosManager() {
	const [showAdd, setShowAdd] = useState(false);
	const [movements, setMovements] = useState<InventoryMovement[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagina, setPagina] = useState(1);
	const [dateRange, setDateRange] = useState(() => {
		const today = new Date();
		const day = today.getDay();
		const diff = today.getDate() - day + (day === 0 ? -6 : 1);
		const monday = new Date(today);
		monday.setDate(diff);
		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);
		return {
			startDate: monday.toISOString().split('T')[0],
			endDate: sunday.toISOString().split('T')[0],
		};
	});

	useEffect(() => {
		async function fetchMovements() {
			try {
				setLoading(true);
				const data = await apiClient.get<InventoryMovement[]>(
					`/inventory-movements?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
				);
				setMovements(data);
			} catch (error) {
				console.error('Error fetching inventory movements:', error);
			} finally {
				setLoading(false);
			}
		}
		fetchMovements();
	}, [dateRange.startDate, dateRange.endDate, showAdd]);

	const stats = useMemo(() => {
		let totalSales = 0;
		let totalIncome = 0;
		let totalExpenses = 0;

		movements.forEach((m) => {
			if (m.move_type === 'VENTA') {
				totalSales += Number(m.quantity || 0);
				totalIncome += Number(m.price || 0);
			} else if (m.move_type === 'COMPRA') {
				totalExpenses += Number(m.price || 0);
			}
		});

		return {
			totalSales,
			totalIncome,
			totalExpenses,
			balance: totalIncome - totalExpenses,
		};
	}, [movements]);

	const totalPaginas = Math.ceil(movements.length / PAGE_SIZE);
	const paginatedMovements = movements.slice(
		(pagina - 1) * PAGE_SIZE,
		pagina * PAGE_SIZE,
	);

	if (showAdd) {
		return <AnadirPedidoManager onClose={() => setShowAdd(false)} />;
	}

	return (
		<div style={{ color: 'var(--color-on-surface)' }}>
			<main className='max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-8 space-y-6'>
				{/* ── Encabezado de sección ─────────────────── */}
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
					<div>
						<h2
							className='text-headline-lg'
							style={{ color: 'var(--color-primary)' }}>
							Movimientos de Inventario
						</h2>
						<p
							className='text-body-md mt-1'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Registro general de ventas y gastos de la bodega.
						</p>
					</div>

					<div className='flex flex-wrap items-center gap-4'>
						<DatePicker
							mode='date'
							selectionType='range'
							value={[dateRange.startDate, dateRange.endDate]}
							placeholder='Selecciona un rango'
							onChange={(e: DatePickerValue) => {
								if (Array.isArray(e) && e.length === 2) {
									const [start, end] = e;
									if (start && end) {
										const s = typeof start === 'string' ? start : start.toISOString().split('T')[0];
										const ev = typeof end === 'string' ? end : end.toISOString().split('T')[0];
										setDateRange({ startDate: s, endDate: ev });
									}
								}
							}}
						/>

						<Button onClick={() => setShowAdd(true)}>
							<Add className='w-4 h-4 mr-2' /> Añadir Venta / Gasto
						</Button>
					</div>
				</div>

				{/* ── Tarjetas de estadísticas ──────────────── */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					{[
						{
							label: 'Ventas totales (Unidades)',
							value: stats.totalSales,
							isCurrency: false,
							color: 'var(--color-primary)',
						},
						{
							label: 'Ingresos totales (Q)',
							value: stats.totalIncome,
							isCurrency: true,
							color: 'var(--color-secondary)',
						},
						{
							label: 'Gastos registrados (Q)',
							value: stats.totalExpenses,
							isCurrency: true,
							color: 'var(--color-on-primary-container)',
						},
						{
							label: 'Balance neto',
							value: stats.balance,
							isCurrency: true,
							color:
								stats.balance >= 0
									? 'var(--color-primary)'
									: 'var(--color-error)',
						},
					].map(({ label, value, color, isCurrency }) => (
						<Card key={label} variant='outlined' padding='md'>
							<p
								className='text-label-md'
								style={{
									color: 'var(--color-on-surface-variant)',
								}}>
								{label}
							</p>
							<p
								className='text-headline-sm mt-1'
								style={{ color }}>
								{isCurrency ? (
									<span className='font-bold'>
										{formatCurrency(value as number)}
									</span>
								) : (
									String(value)
								)}
							</p>
						</Card>
					))}
				</div>

				{/* ── Tabla de movimientos ──────────────────────── */}
				<Card
					variant='default'
					padding='none'
					className='overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='w-full text-left border-collapse'>
							<thead
								style={{
									backgroundColor:
										'var(--color-surface-container-low)',
								}}>
								<tr>
									{[
										'FECHA',
										'TIPO',
										'DETALLE',
										'CANTIDAD',
										'TOTAL',
									].map((h) => (
										<th
											key={h}
											className={`px-6 py-3 text-label-md border-b ${h === 'TOTAL' ? 'text-right' : ''}`}
											style={{
												color: 'var(--color-on-surface-variant)',
												borderColor:
													'var(--color-outline-variant)',
											}}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan={5}
											className='text-center py-12 text-body-md'
											style={{
												color: 'var(--color-on-surface-variant)',
											}}>
											Cargando movimientos...
										</td>
									</tr>
								) : paginatedMovements.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className='text-center py-12 text-body-md'
											style={{
												color: 'var(--color-on-surface-variant)',
											}}>
											No hay movimientos registrados.
										</td>
									</tr>
								) : (
									paginatedMovements.map((move, i) => {
										const isExpense =
											move.move_type === 'COMPRA';
										const detailText = isExpense
											? move.expense_type_id
												? `Gasto: ${move.expense_type_id}`
												: 'Gasto General'
											: move.notes || 'Venta de producto';

										return (
											<tr
												key={`${move.move_date}-${i}`}
												className='border-b last:border-0 transition-colors'
												style={{
													borderColor:
														'var(--color-outline-variant)',
												}}
												onMouseEnter={(e) => {
													(
														e.currentTarget as HTMLTableRowElement
													).style.backgroundColor =
														'var(--color-surface-bright)';
												}}
												onMouseLeave={(e) => {
													(
														e.currentTarget as HTMLTableRowElement
													).style.backgroundColor =
														'transparent';
												}}>
												{/* Fecha */}
												<td className='px-6 py-4'>
													<span className='text-body-md font-medium'>
														{formatDate(move.move_date, {
															month: 'short',
															timeZone: 'UTC',
														})}
													</span>
												</td>

												{/* Tipo */}
												<td className='px-6 py-4'>
													<StatusChip
														status={
															isExpense
																? 'alert'
																: 'operational'
														}
														label={move.move_type}
													/>
												</td>

												{/* Detalle */}
												<td className='px-6 py-4 max-w-[200px] truncate text-body-md'>
													{detailText}
												</td>

												{/* Cantidad */}
												<td className='px-6 py-4'>
													<span className='text-body-md font-medium'>
														{move.quantity}{' '}
														{isExpense
															? 'und.'
															: 'botellones'}
													</span>
												</td>

												{/* Total */}
												<td className='px-6 py-4 text-right'>
													<span
														className='text-body-md font-bold'
														style={{
															color: isExpense
																? 'var(--color-error)'
																: 'var(--color-primary)',
														}}>
														{isExpense ? '-' : '+'}
														{formatCurrency(Number(move.price))}
													</span>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>

					{/* Paginación */}
					<div
						className='px-6 py-3 flex items-center justify-between border-t'
						style={{
							backgroundColor:
								'var(--color-surface-container-low)',
							borderColor: 'var(--color-outline-variant)',
						}}>
						<p
							className='text-label-md'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Mostrando {paginatedMovements.length} de{' '}
							{movements.length} movimientos
						</p>
						<div className='flex items-center gap-2'>
							<button
								onClick={() =>
									setPagina((p) => Math.max(1, p - 1))
								}
								disabled={pagina === 1}
								className='w-8 h-8 flex items-center justify-center rounded-full border transition-colors disabled:opacity-40'
								style={{
									borderColor: 'var(--color-outline-variant)',
									color: 'var(--color-on-surface-variant)',
								}}>
								<ArrowLeft className='w-3 h-3' />
							</button>

							{Array.from(
								{ length: totalPaginas },
								(_, i) => i + 1,
							).map((n) => (
								<button
									key={n}
									onClick={() => setPagina(n)}
									className='w-8 h-8 flex items-center justify-center rounded-full text-label-md transition-colors'
									style={
										n === pagina
											? {
													backgroundColor:
														'var(--color-primary)',
													color: 'var(--color-on-primary)',
												}
											: {
													border: '1px solid var(--color-outline-variant)',
													color: 'var(--color-on-surface-variant)',
												}
									}>
									{n}
								</button>
							))}

							<button
								onClick={() =>
									setPagina((p) =>
										Math.min(totalPaginas, p + 1),
									)
								}
								disabled={
									pagina === totalPaginas ||
									totalPaginas === 0
								}
								className='w-8 h-8 flex items-center justify-center rounded-full border transition-colors disabled:opacity-40'
								style={{
									borderColor: 'var(--color-outline-variant)',
									color: 'var(--color-on-surface-variant)',
								}}>
								<ArrowRight className='w-3 h-3' />
							</button>
						</div>
					</div>
				</Card>
			</main>
		</div>
	);
}
