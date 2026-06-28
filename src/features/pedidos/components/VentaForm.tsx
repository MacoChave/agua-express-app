'use client';

import { useState } from 'react';
import Remove from '@/assets/icons/remove.svg';
import Add from '@/assets/icons/add.svg';
import Save from '@/assets/icons/save.svg';
import { apiClient } from '@/lib/apiClient';
import { Button, InputField } from '@/components/ui';

interface VentaFormProps {
	onConfirm: () => void;
}

export default function VentaForm({ onConfirm }: VentaFormProps) {
	const [cantidad, setCantidad] = useState(0);
	const [total, setTotal] = useState(0);
	const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
	const [loading, setLoading] = useState(false);

	const handleCantidad = (delta: number) => {
		setCantidad((prev) => Math.max(1, prev + delta));
	};

	const handleSave = async () => {
		setLoading(true);
		try {
			// En un escenario real, estos IDs vendrían del contexto de usuario/sesión
			await apiClient.post('/inventory-movements', {
				move_type: 'VENTA',
				quantity: cantidad,
				price: total,
				move_date: fecha,
				notes: `Venta directa: ${cantidad} garrafones`,
			});
			onConfirm();
		} catch (error) {
			console.error('Error saving sale:', error);
			alert('Error al guardar el registro. Por favor, intente de nuevo.');
		} finally {
			setLoading(false);
		}
	};

	function isDataValidate(): boolean | undefined {
		return cantidad > 0 && total > 0 && fecha !== '';
	}

	return (
		<div className='space-y-6'>
			<div
				className='rounded-xl p-6 border space-y-6'
				style={{
					backgroundColor: 'var(--color-surface-container-lowest)',
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
					Resumen de Venta
				</h2>

				<div className='grid grid-cols-2 gap-4'>
					{/* Total garrafones */}
					<InputField
						type='number'
						value={cantidad === 0 ? '' : cantidad}
						onChange={(e) => {
							let val = parseInt(e.target.value);
							if (!isNaN(val) && val > 0) setCantidad(val);
							else setCantidad(0);
						}}
						label='Total garrafones'
						placeholder='50'
						leftAction={
							<Button
								variant='ghost'
								onClick={() => handleCantidad(-1)}>
								<Remove className='w-5 h-5' />
							</Button>
						}
						rightAction={
							<Button
								variant='ghost'
								onClick={() => handleCantidad(1)}>
								<Add className='w-5 h-5' />
							</Button>
						}
						fullWidth
					/>

					{/* Ingreso total */}
					<InputField
						type='number'
						value={total === 0 ? '' : total}
						onChange={(e) => {
							let val = parseInt(e.target.value);
							if (!isNaN(val) && val > 0) setTotal(val);
							else setTotal(0);
						}}
						label='Ingreso total'
						placeholder='350'
						prefixIcon='Q'
						fullWidth
					/>

					{/* Fecha de movimiento */}
					<div className='space-y-1 col-span-2'>
						<label
							className='text-label-md font-medium'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Fecha de movimiento
						</label>
						<input
							type='date'
							value={fecha}
							onChange={(e) => setFecha(e.target.value)}
							className='px-4 w-full border rounded-xl h-12 bg-transparent text-headline-sm font-semibold'
							style={{
								borderColor: 'var(--color-outline-variant)',
								color: 'var(--color-primary)',
							}}
						/>
					</div>
				</div>
			</div>

			{/* ── Botón confirmar ─────────────────────── */}
			<button
				onClick={handleSave}
				disabled={loading || !isDataValidate()}
				className='w-full h-16 rounded-xl text-headline-md font-semibold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70'
				style={{
					backgroundColor: 'var(--color-primary-container)',
					color: 'var(--color-on-primary)',
				}}>
				{loading ? (
					<span className='w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin' />
				) : (
					<Save />
				)}
				{loading ? 'Guardando...' : 'Guardar Registro'}
			</button>
		</div>
	);
}
