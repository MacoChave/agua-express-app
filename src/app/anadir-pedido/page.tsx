'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	type TipoServicio,
	type EstadoPago,
	type Cliente,
	CLIENTES_MOCK,
	PRECIO_UNITARIO,
	CARGO_ENTREGA,
	FRANJAS_HORARIAS,
	ESTADOS_PAGO,
} from '@/features/pedidos/types';
import { todayISO } from '@/lib/utils';

/* ── Componente ─────────────────────────────────────────── */
export default function AnadirPedidoPage() {
	const router = useRouter();

	// Estado del formulario
	const [busqueda, setBusqueda] = useState('Alejandro Rodríguez');
	const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente>(
		CLIENTES_MOCK[0],
	);
	const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
	const [cantidad, setCantidad] = useState(3);
	const [tipoServicio, setTipoServicio] = useState<TipoServicio>('recarga');
	const [fechaEntrega, setFechaEntrega] = useState(todayISO());
	const [franjaHoraria, setFranjaHoraria] = useState('10:00 - 12:00');
	const [estadoPago, setEstadoPago] = useState<EstadoPago>('pendiente');
	const [confirmado, setConfirmado] = useState(false);

	// Cálculos
	const subtotal = cantidad * PRECIO_UNITARIO;
	const total = subtotal + CARGO_ENTREGA;

	// Clientes filtrados
	const clientesFiltrados = CLIENTES_MOCK.filter((c) =>
		c.nombre.toLowerCase().includes(busqueda.toLowerCase()),
	);

	const handleCantidad = (delta: number) => {
		setCantidad((prev) => Math.max(1, prev + delta));
	};

	const handleSeleccionarCliente = (cliente: Cliente) => {
		setClienteSeleccionado(cliente);
		setBusqueda(cliente.nombre);
		setMostrarSugerencias(false);
	};

	const handleConfirmar = () => {
		setConfirmado(true);
		setTimeout(() => router.push('/pedidos'), 1500);
	};

	/* ── Estilos por estado de pago ── */
	const estadoPagoStyle = (v: EstadoPago) => {
		const activo = estadoPago === v;
		if (v === 'pendiente')
			return activo
				? 'bg-error-container text-on-error-container border-2 border-error-container'
				: 'bg-surface-container-high text-on-surface-variant border-2 border-transparent';
		if (v === 'en-entrega')
			return activo
				? 'bg-secondary-container text-on-secondary-container border-2 border-secondary'
				: 'bg-surface-container-high text-on-surface-variant border-2 border-transparent';
		return activo
			? 'bg-primary-container text-on-primary-container border-2 border-primary-container'
			: 'bg-surface-container-high text-on-surface-variant border-2 border-transparent';
	};

	return (
		<div
			className='min-h-screen pb-28'
			style={{ backgroundColor: 'var(--color-background)' }}>
			{/* ── Top App Bar ───────────────────────────── */}
			<header
				className='fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 border-b'
				style={{
					backgroundColor: 'var(--color-surface)',
					borderColor: 'var(--color-outline-variant)',
				}}>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => router.back()}
						className='w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-surface-container active:scale-90'
						aria-label='Volver'>
						<span
							className='material-symbols-outlined'
							style={{ color: 'var(--color-primary)' }}>
							arrow_back
						</span>
					</button>
					<h1
						className='text-headline-sm font-semibold'
						style={{ color: 'var(--color-primary)' }}>
						Nuevo Pedido
					</h1>
				</div>
				<div
					className='w-8 h-8 rounded-full grid place-items-center font-bold text-xs border'
					style={{
						backgroundColor: 'var(--color-surface-container-high)',
						borderColor: 'var(--color-outline-variant)',
						color: 'var(--color-primary)',
					}}>
					TC
				</div>
			</header>

			{/* ── Contenido ─────────────────────────────── */}
			<main className='pt-20 pb-8 px-4 max-w-full mx-auto space-y-6 md:max-w-6/12'>
				{/* ── Selección de cliente ────────────────── */}
				<section className='space-y-2'>
					<label
						className='text-label-md font-medium uppercase tracking-wider flex items-center gap-1'
						style={{ color: 'var(--color-on-surface-variant)' }}>
						<span className='material-symbols-outlined text-base'>
							person
						</span>
						Cliente
					</label>

					{/* Buscador */}
					<div className='relative'>
						<input
							type='text'
							placeholder='Buscar cliente...'
							value={busqueda}
							onChange={(e) => {
								setBusqueda(e.target.value);
								setMostrarSugerencias(true);
							}}
							onFocus={() => setMostrarSugerencias(true)}
							className='w-full h-14 rounded-xl px-4 pr-12 text-body-md border outline-none transition-all'
							style={{
								backgroundColor:
									'var(--color-surface-container-lowest)',
								borderColor: 'var(--color-outline-variant)',
								color: 'var(--color-on-surface)',
							}}
						/>
						<span
							className='absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined'
							style={{ color: 'var(--color-outline)' }}>
							search
						</span>

						{/* Dropdown sugerencias */}
						{mostrarSugerencias && clientesFiltrados.length > 0 && (
							<div
								className='absolute top-full left-0 w-full mt-1 rounded-xl border overflow-hidden z-20 shadow-lg'
								style={{
									backgroundColor:
										'var(--color-surface-container-lowest)',
									borderColor: 'var(--color-outline-variant)',
								}}>
								{clientesFiltrados.map((c) => (
									<button
										key={c.nombre}
										onClick={() =>
											handleSeleccionarCliente(c)
										}
										className='w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-container'
										style={{
											color: 'var(--color-on-surface)',
										}}>
										<div
											className='w-8 h-8 rounded-full grid place-items-center font-bold text-xs shrink-0'
											style={{
												backgroundColor:
													'var(--color-primary-container)',
												color: 'var(--color-on-primary-container)',
											}}>
											{c.iniciales}
										</div>
										<div>
											<p className='text-body-md font-medium'>
												{c.nombre}
											</p>
											<p
												className='text-body-sm'
												style={{
													color: 'var(--color-on-surface-variant)',
												}}>
												{c.direccion}
											</p>
										</div>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Tarjeta cliente seleccionado */}
					<div
						className='flex items-center gap-3 p-3 rounded-xl border'
						style={{
							backgroundColor: 'var(--color-surface-container)',
							borderColor:
								'color-mix(in srgb, var(--color-outline-variant) 30%, transparent)',
						}}>
						<div
							className='w-10 h-10 rounded-full grid place-items-center font-bold shrink-0'
							style={{
								backgroundColor:
									'var(--color-primary-container)',
								color: 'var(--color-on-primary-container)',
							}}>
							{clienteSeleccionado.iniciales}
						</div>
						<div>
							<p
								className='text-body-md font-semibold'
								style={{ color: 'var(--color-on-surface)' }}>
								{clienteSeleccionado.nombre}
							</p>
							<p
								className='text-body-sm'
								style={{
									color: 'var(--color-on-surface-variant)',
								}}>
								{clienteSeleccionado.direccion}
							</p>
						</div>
					</div>
				</section>

				{/* ── Detalles de compra ──────────────────── */}
				<div
					className='rounded-xl p-6 border space-y-6'
					style={{
						backgroundColor:
							'var(--color-surface-container-lowest)',
						borderColor:
							'color-mix(in srgb, var(--color-outline-variant) 20%, transparent)',
						boxShadow: '0 4px 12px rgba(0,77,122,0.08)',
					}}>
					<h2
						className='text-headline-sm font-semibold border-b pb-2'
						style={{
							color: 'var(--color-primary)',
							borderColor: 'var(--color-outline-variant)',
						}}>
						Detalles de Compra
					</h2>

					<div className='grid grid-cols-2 gap-4'>
						{/* Cantidad */}
						<div className='space-y-1'>
							<label
								className='text-label-md font-medium'
								style={{
									color: 'var(--color-on-surface-variant)',
								}}>
								Cantidad
							</label>
							<div
								className='flex items-center border rounded-xl overflow-hidden h-12'
								style={{
									borderColor: 'var(--color-outline-variant)',
								}}>
								<button
									onClick={() => handleCantidad(-1)}
									className='w-12 h-full flex items-center justify-center transition-colors hover:bg-surface-container-low active:bg-surface-container'
									style={{
										color: 'var(--color-on-surface)',
									}}>
									<span className='material-symbols-outlined'>
										remove
									</span>
								</button>
								<input
									type='number'
									readOnly
									value={cantidad}
									className='w-full text-center border-none focus:ring-0 bg-transparent text-headline-sm font-semibold'
									style={{ color: 'var(--color-primary)' }}
								/>
								<button
									onClick={() => handleCantidad(1)}
									className='w-12 h-full flex items-center justify-center transition-colors hover:bg-surface-container-low active:bg-surface-container'
									style={{
										color: 'var(--color-on-surface)',
									}}>
									<span className='material-symbols-outlined'>
										add
									</span>
								</button>
							</div>
						</div>

						{/* Precio unitario */}
						<div className='space-y-1'>
							<label
								className='text-label-md font-medium'
								style={{
									color: 'var(--color-on-surface-variant)',
								}}>
								Precio Unitario
							</label>
							<div
								className='h-12 flex items-center px-4 rounded-xl text-headline-sm font-semibold'
								style={{
									backgroundColor:
										'var(--color-surface-container-low)',
									color: 'var(--color-primary)',
								}}>
								${PRECIO_UNITARIO.toFixed(2)}
							</div>
						</div>
					</div>

					{/* Tipo de servicio */}
					<div className='space-y-2'>
						<label
							className='text-label-md font-medium uppercase tracking-wider'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Tipo de Servicio
						</label>
						<div className='grid grid-cols-2 gap-2'>
							<button
								onClick={() => setTipoServicio('recarga')}
								className='flex items-center justify-center gap-2 h-12 rounded-xl text-body-md font-medium transition-all'
								style={
									tipoServicio === 'recarga'
										? {
												borderWidth: 2,
												borderStyle: 'solid',
												borderColor:
													'var(--color-secondary)',
												backgroundColor:
													'var(--color-secondary-container)',
												color: 'var(--color-on-secondary-container)',
											}
										: {
												borderWidth: 1,
												borderStyle: 'solid',
												borderColor:
													'var(--color-outline-variant)',
												backgroundColor:
													'var(--color-surface-container-lowest)',
												color: 'var(--color-on-surface-variant)',
											}
								}>
								<span className='material-symbols-outlined text-lg'>
									recycling
								</span>
								Recarga
							</button>
							<button
								onClick={() => setTipoServicio('nuevo')}
								className='flex items-center justify-center gap-2 h-12 rounded-xl text-body-md font-medium transition-all'
								style={
									tipoServicio === 'nuevo'
										? {
												borderWidth: 2,
												borderStyle: 'solid',
												borderColor:
													'var(--color-secondary)',
												backgroundColor:
													'var(--color-secondary-container)',
												color: 'var(--color-on-secondary-container)',
											}
										: {
												borderWidth: 1,
												borderStyle: 'solid',
												borderColor:
													'var(--color-outline-variant)',
												backgroundColor:
													'var(--color-surface-container-lowest)',
												color: 'var(--color-on-surface-variant)',
											}
								}>
								<span className='material-symbols-outlined text-lg'>
									nest_eco_leaf
								</span>
								Nuevo
							</button>
						</div>
					</div>
				</div>

				{/* ── Entrega y pago ──────────────────────── */}
				<div className='space-y-4'>
					{/* Programación de entrega */}
					<section className='space-y-2'>
						<label
							className='text-label-md font-medium uppercase tracking-wider'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Programación de Entrega
						</label>
						<div className='grid grid-cols-2 gap-4'>
							<input
								type='date'
								value={fechaEntrega}
								onChange={(e) =>
									setFechaEntrega(e.target.value)
								}
								className='h-14 rounded-xl px-4 border outline-none transition-all text-body-md'
								style={{
									backgroundColor:
										'var(--color-surface-container-lowest)',
									borderColor: 'var(--color-outline-variant)',
									color: 'var(--color-on-surface)',
								}}
							/>
							<div className='relative'>
								<select
									value={franjaHoraria}
									onChange={(e) =>
										setFranjaHoraria(e.target.value)
									}
									className='w-full h-14 rounded-xl px-4 pr-10 border outline-none transition-all text-body-md appearance-none'
									style={{
										backgroundColor:
											'var(--color-surface-container-lowest)',
										borderColor:
											'var(--color-outline-variant)',
										color: 'var(--color-on-surface)',
									}}>
									{FRANJAS_HORARIAS.map((f) => (
										<option key={f} value={f}>
											{f}
										</option>
									))}
								</select>
								<span
									className='absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none'
									style={{
										color: 'var(--color-outline)',
									}}>
									expand_more
								</span>
							</div>
						</div>
					</section>

					{/* Estado de pago */}
					<section className='space-y-2'>
						<label
							className='text-label-md font-medium uppercase tracking-wider'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Estado de Pago
						</label>
						<div className='flex gap-2 overflow-x-auto pb-1 scrollbar-none'>
							{ESTADOS_PAGO.map(({ value, label }) => (
								<button
									key={value}
									onClick={() => setEstadoPago(value)}
									className={`px-6 py-3 rounded-full text-label-md whitespace-nowrap transition-all ${estadoPagoStyle(value)}`}>
									{label}
								</button>
							))}
						</div>
					</section>
				</div>

				{/* ── Resumen ─────────────────────────────── */}
				<div
					className='rounded-2xl p-6 space-y-2'
					style={{
						backgroundColor: 'var(--color-primary)',
						color: 'var(--color-on-primary)',
						boxShadow: '0 4px 12px rgba(0,77,122,0.08)',
					}}>
					<div className='flex justify-between items-center'>
						<span className='text-body-md' style={{ opacity: 0.8 }}>
							Subtotal
						</span>
						<span className='text-headline-sm font-semibold'>
							${subtotal.toFixed(2)}
						</span>
					</div>
					<div className='flex justify-between items-center'>
						<span className='text-body-md' style={{ opacity: 0.8 }}>
							Cargo Entrega
						</span>
						<span className='text-headline-sm font-semibold'>
							${CARGO_ENTREGA.toFixed(2)}
						</span>
					</div>
					<div
						className='pt-2 flex justify-between items-center border-t'
						style={{
							borderColor:
								'color-mix(in srgb, var(--color-on-primary) 20%, transparent)',
						}}>
						<span className='text-headline-md font-semibold'>
							Total
						</span>
						<span
							className='text-headline-md font-semibold'
							style={{
								color: 'var(--color-secondary-container)',
							}}>
							${total.toFixed(2)}
						</span>
					</div>
				</div>

				{/* ── Botón confirmar ─────────────────────── */}
				<button
					onClick={handleConfirmar}
					disabled={confirmado}
					className='w-full h-16 rounded-xl text-headline-md font-semibold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70'
					style={{
						backgroundColor: confirmado
							? 'var(--color-primary)'
							: 'var(--color-primary-container)',
						color: confirmado
							? 'var(--color-on-primary)'
							: 'var(--color-on-primary-container)',
					}}>
					<span
						className='material-symbols-outlined'
						style={{
							fontVariationSettings: "'FILL' 1",
						}}>
						{confirmado ? 'check_circle' : 'check_circle'}
					</span>
					{confirmado ? 'Pedido Confirmado ✓' : 'Confirmar Pedido'}
				</button>
			</main>
		</div>
	);
}
