'use client';

import { useState } from 'react';
import Remove from '@/assets/icons/remove.svg';
import Add from '@/assets/icons/add.svg';
import Save from '@/assets/icons/save.svg';
import { apiClient } from '@/lib/apiClient';

interface VentaFormProps {
	onConfirm: () => void;
}

export default function VentaForm({ onConfirm }: VentaFormProps) {
	const [cantidad, setCantidad] = useState(50);
	const [total, setTotal] = useState(350);
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
				move_date: new Date().toISOString().split('T')[0],
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
					<div className='space-y-1'>
						<label
							className='text-label-md font-medium'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Total garrafones
						</label>
						<div
							className='flex items-center border rounded-xl overflow-hidden h-12'
							style={{
								borderColor: 'var(--color-outline-variant)',
							}}>
							<button
								type='button'
								onClick={() => handleCantidad(-1)}
								className='w-12 h-full flex items-center justify-center transition-colors hover:bg-surface-container-low active:bg-surface-container'
								style={{
									color: 'var(--color-on-surface)',
								}}>
								<Remove className='w-5 h-5' />
							</button>
							<input
								type='number'
								value={cantidad}
								onChange={(e) =>
									setCantidad(
										Math.max(
											1,
											parseInt(e.target.value) || 1,
										),
									)
								}
								className='w-full text-center border-none focus:ring-0 bg-transparent text-headline-sm font-semibold'
								style={{ color: 'var(--color-primary)' }}
							/>
							<button
								type='button'
								onClick={() => handleCantidad(1)}
								className='w-12 h-full flex items-center justify-center transition-colors hover:bg-surface-container-low active:bg-surface-container'
								style={{
									color: 'var(--color-on-surface)',
								}}>
								<Add className='w-5 h-5' />
							</button>
						</div>
					</div>

					{/* Ingreso total */}
					<div className='space-y-1'>
						<label
							className='text-label-md font-medium'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Ingreso total
						</label>
						<input
							type='number'
							value={total}
							onChange={(e) => {
								const val = Math.max(
									1,
									parseInt(e.target.value) || 1,
								);
								setTotal(val);
							}}
							className='w-full text-center border rounded-xl h-12 bg-transparent text-headline-sm font-semibold'
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
				disabled={loading}
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
