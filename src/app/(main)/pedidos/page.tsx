'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button, Card, InputField, StatusChip } from '@/components/ui';
import {
	type EstadoPedido,
	ESTADO_CONFIG,
	FILTROS_PEDIDO,
	PEDIDOS_MOCK,
} from '@/features/pedidos/types';
import Add from '@/assets/icons/add.svg';
import WaterDrop from '@/assets/icons/water_drop.svg';
import ArrowLeft from '@/assets/icons/arrow_left.svg';
import ArrowRight from '@/assets/icons/arrow_right.svg';

const PAGE_SIZE = 4;

/* ── Componente ─────────────────────────────────────────── */
export default function PedidosPage() {
	const [busqueda, setBusqueda] = useState('');
	const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | 'todos'>(
		'todos',
	);
	const [pagina, setPagina] = useState(1);

	const pedidosFiltrados = useMemo(() => {
		return PEDIDOS_MOCK.filter((p) => {
			const coincideBusqueda =
				p.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
				p.id.toLowerCase().includes(busqueda.toLowerCase());
			const coincideEstado =
				filtroEstado === 'todos' || p.estado === filtroEstado;
			return coincideBusqueda && coincideEstado;
		});
	}, [busqueda, filtroEstado]);

	const totalPaginas = Math.ceil(pedidosFiltrados.length / PAGE_SIZE);
	const pedidosPagina = pedidosFiltrados.slice(
		(pagina - 1) * PAGE_SIZE,
		pagina * PAGE_SIZE,
	);

	const stats = {
		totalSales: PEDIDOS_MOCK.length,
		totalShipping: PEDIDOS_MOCK.filter((p) => p.estado === 'en-camino')
			.length,
		totalBuys: PEDIDOS_MOCK.filter((p) => p.estado === 'entregado').length,
		balance: PEDIDOS_MOCK.filter((p) => p.estado === 'pendiente').length,
	};

	const handleFiltro = (valor: EstadoPedido | 'todos') => {
		setFiltroEstado(valor);
		setPagina(1);
	};

	const handleBusqueda = (valor: string) => {
		setBusqueda(valor);
		setPagina(1);
	};

	return (
		<div style={{ color: 'var(--color-on-surface)' }}>
			<main className='max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-8 space-y-6'>
				{/* ── Encabezado de sección ─────────────────── */}
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
					<div>
						<h2
							className='text-headline-lg'
							style={{ color: 'var(--color-primary)' }}>
							Gestión de Pedidos
						</h2>
						<p
							className='text-body-md mt-1'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Control centralizado de suministros activos y
							entregas.
						</p>
					</div>
					<Link href='/anadir-pedido'>
						<Button>
							<Add className='w-4 h-4 mr-2' /> Añadir Venta /
							Gasto
						</Button>
					</Link>
				</div>

				{/* ── Tarjetas de estadísticas ──────────────── */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					{[
						{
							label: 'Ventas totales (Unidades)',
							value: stats.totalSales,
							color: 'var(--color-primary)',
						},
						{
							label: 'Ingresos totales (Q)',
							value: stats.totalShipping,
							color: 'var(--color-secondary)',
						},
						{
							label: 'Gastos registrados (Q)',
							value: stats.totalBuys,
							color: 'var(--color-on-primary-container)',
						},
						{
							label: 'Balance neto',
							value: stats.balance,
							color: 'var(--color-error)',
						},
					].map(({ label, value, color }) => (
						<Card
							key={label}
							variant='outlined'
							padding='md'
							hoverable
							onClick={() =>
								handleFiltro(
									label === 'Total Hoy'
										? 'todos'
										: label === 'En camino'
											? 'en-camino'
											: label === 'Entregados'
												? 'entregado'
												: 'pendiente',
								)
							}>
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
								{String(value).padStart(2, '0')}
							</p>
						</Card>
					))}
				</div>

				{/* ── Tabla de pedidos ──────────────────────── */}
				<Card
					variant='default'
					padding='none'
					className='overflow-hidden'>
					{/* Tabla */}
					<div className='overflow-x-auto'>
						<table className='w-full text-left border-collapse'>
							<thead
								style={{
									backgroundColor:
										'var(--color-surface-container-low)',
								}}>
								<tr>
									{[
										'CLIENTE',
										'CANT. BOTELLONES',
										'TOTAL',
										'ESTADO',
										'ACCIONES',
									].map((h) => (
										<th
											key={h}
											className={`px-6 py-3 text-label-md border-b ${h === 'ACCIONES' ? 'text-right' : ''}`}
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
								{pedidosPagina.length === 0 ? (
									<tr>
										<td
											colSpan={5}
											className='text-center py-12 text-body-md'
											style={{
												color: 'var(--color-on-surface-variant)',
											}}>
											Sin pedidos que coincidan con la
											búsqueda.
										</td>
									</tr>
								) : (
									pedidosPagina.map((pedido) => {
										const cfg =
											ESTADO_CONFIG[pedido.estado];
										return (
											<tr
												key={pedido.id}
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
												{/* Cliente */}
												<td className='px-6 py-4'>
													<div className='flex items-center gap-3'>
														<div
															className='w-9 h-9 rounded-full grid place-items-center font-bold text-xs shrink-0'
															style={{
																backgroundColor:
																	pedido.avatarColor,
																color: 'var(--color-primary)',
															}}>
															{pedido.iniciales}
														</div>
														<div>
															<p
																className='text-body-md font-semibold'
																style={{
																	color: 'var(--color-on-surface)',
																}}>
																{pedido.cliente}
															</p>
															<p
																className='text-label-md'
																style={{
																	color: 'var(--color-on-surface-variant)',
																}}>
																ID: #{pedido.id}
															</p>
														</div>
													</div>
												</td>

												{/* Botellones */}
												<td className='px-6 py-4'>
													<div className='flex items-center gap-1 text-body-md'>
														<WaterDrop className='w-4 h-4 text-primary' />
														<span>
															{pedido.botellones}{' '}
															Unidades
														</span>
													</div>
												</td>

												{/* Total */}
												<td className='px-6 py-4'>
													<span
														className='text-body-md font-bold'
														style={{
															color: 'var(--color-on-surface)',
														}}>
														$
														{pedido.total.toLocaleString(
															'es-GT',
															{
																style: 'currency',
																currency: 'GTQ',
																minimumFractionDigits: 2,
															},
														)}
													</span>
												</td>

												{/* Estado */}
												<td className='px-6 py-4'>
													<StatusChip
														status={cfg.status}
														label={cfg.label}
													/>
												</td>

												{/* Acciones */}
												<td className='px-6 py-4 text-right'>
													<button
														className='p-2 rounded-full transition-colors'
														style={{
															color: 'var(--color-on-surface-variant)',
														}}
														onMouseEnter={(e) =>
															((
																e.currentTarget as HTMLButtonElement
															).style.backgroundColor =
																'var(--color-surface-variant)')
														}
														onMouseLeave={(e) =>
															((
																e.currentTarget as HTMLButtonElement
															).style.backgroundColor =
																'transparent')
														}
														aria-label={`Acciones para ${pedido.cliente}`}>
														⋮
													</button>
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
							Mostrando {pedidosPagina.length} de{' '}
							{pedidosFiltrados.length} pedidos
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
