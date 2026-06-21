'use client';

/**
 * Screen ID: 1bb66d4b32c54147aad0a94d4a8f7ce0
 * Description: Componente para programar tareas de mantenimiento.
 */

import { useState, useEffect } from 'react';
import { Button, InputField } from '@/components/ui';
import Close from '@/assets/icons/close.svg';
import Event from '@/assets/icons/event.svg';
import Build from '@/assets/icons/build.svg';
import KeyboardArrowDown from '@/assets/icons/keyboard_arrow_down.svg';

/* ─── Options ────────────────────────────────────────── */
const EQUIPMENT_OPTIONS = [
	'Planta Central - Unidad 04',
	'Sector Norte - Bomba 12',
	'Tanque Sedimentación A',
	'Módulo Osmosis Inversa 02',
];

const MAINTENANCE_TYPES = [
	'Backwash (Retrolavado)',
	'Cambio de Filtro',
	'Análisis de Calidad de Agua',
	'Reemplazo de Lámpara UV',
];

export interface ProgramarMantenimientoProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ProgramarMantenimiento({
	isOpen,
	onClose,
}: ProgramarMantenimientoProps) {
	const [form, setForm] = useState({
		equipment: EQUIPMENT_OPTIONS[0],
		type: MAINTENANCE_TYPES[0],
		quantity: 1,
		recurrence: 'monthly',
	});

	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		// Simulamos llamada a API
		await new Promise((r) => setTimeout(r, 1200));
		setSubmitting(false);
		onClose();
	};

	return (
		<div
			className='fixed inset-0 z-[60] flex items-center justify-center p-4  backdrop-blur-sm'
			style={{ backgroundColor: 'rgba(11,28,48,0.4)' }}
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div className='bg-[var(--color-surface-container-lowest)] w-full h-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden'>
				<header className='p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-primary)] text-[var(--color-on-primary)]'>
					<div>
						<h1 className='text-headline-md font-semibold'>
							Programar Tarea
						</h1>
						<p className='text-label-md'>
							Planificación de mantenimiento preventivo
						</p>
					</div>
					<button
						onClick={onClose}
						className='p-2 hover:bg-white/10 rounded-full transition-colors'
						aria-label='Cerrar'>
						<Close className='w-6 h-6' />
					</button>
				</header>

				<form onSubmit={handleSubmit} className='space-y-8'>
					{/* Card: Equipo y Tipo */}
					<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-card space-y-5 border border-[var(--color-outline-variant)]/30'>
						<div className='flex items-center gap-3 mb-2'>
							<div className='w-10 h-10 bg-[var(--color-primary-container)]/10 rounded-lg flex items-center justify-center text-[var(--color-primary)]'>
								<Build className='w-5 h-5' />
							</div>
							<h2 className='text-headline-sm font-semibold text-[var(--color-primary)]'>
								Identificación del Equipo
							</h2>
						</div>

						<div className='grid grid-cols-1 gap-5'>
							<div className='space-y-1'>
								<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
									Equipo / Instalación
								</label>
								<div className='relative'>
									<select
										name='equipment'
										value={form.equipment}
										onChange={handleChange}
										className='w-full bg-[var(--color-surface-container-low)] border-none rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-[var(--color-secondary-container)] transition-all text-body-md text-[var(--color-on-surface)] h-12'>
										{EQUIPMENT_OPTIONS.map((opt) => (
											<option key={opt} value={opt}>
												{opt}
											</option>
										))}
									</select>
									<KeyboardArrowDown className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-on-surface-variant)]' />
								</div>
							</div>

							<div className='space-y-1'>
								<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
									Tipo de Mantenimiento
								</label>
								<div className='relative'>
									<select
										name='type'
										value={form.type}
										onChange={handleChange}
										className='w-full bg-[var(--color-surface-container-low)] border-none rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-[var(--color-secondary-container)] transition-all text-body-md text-[var(--color-on-surface)] h-12'>
										{MAINTENANCE_TYPES.map((opt) => (
											<option key={opt} value={opt}>
												{opt}
											</option>
										))}
									</select>
									<KeyboardArrowDown className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-on-surface-variant)]' />
								</div>
							</div>
						</div>
					</div>

					{/* Card: Programación */}
					<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-2xl shadow-card space-y-5 border border-[var(--color-outline-variant)]/30'>
						<div className='flex items-center gap-3 mb-2'>
							<div className='w-10 h-10 bg-[var(--color-secondary-container)]/10 rounded-lg flex items-center justify-center text-[var(--color-secondary)]'>
								<Event className='w-5 h-5' />
							</div>
							<h2 className='text-headline-sm font-semibold text-[var(--color-primary)]'>
								Programación
							</h2>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
							<InputField
								label='Cantidad'
								name='quantity'
								type='number'
								value={form.quantity}
								onChange={handleChange}
								required
							/>
							<div className='space-y-1'>
								<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
									Recurrencia
								</label>
								<select
									name='recurrence'
									value={form.recurrence}
									onChange={handleChange}
									className='w-full bg-[var(--color-surface-container-low)] border-none rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-[var(--color-secondary-container)] transition-all text-body-md text-[var(--color-on-surface)] h-12'>
									<option value='daily'>Diaria</option>
									<option value='weekly'>Semanal</option>
									<option value='monthly'>Mensual</option>
								</select>
							</div>
						</div>
					</div>

					<div className='pt-4'>
						<Button
							type='submit'
							fullWidth
							size='lg'
							loading={submitting}
							className='h-14 text-headline-sm shadow-lg shadow-[var(--color-primary)]/20'>
							Confirmar Programación
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
