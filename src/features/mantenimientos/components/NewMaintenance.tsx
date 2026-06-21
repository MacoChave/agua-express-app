'use client';

import { useState, useEffect } from 'react';
import type { Priority, TaskStatus } from '@/features/mantenimientos/types';

import Close from '@/assets/icons/close.svg';
import AddAPhoto from '@/assets/icons/add_a_photo.svg';

/* ── StatusBadge ─────────────────────────────────────────── */
export function StatusBadge({ status }: { status: TaskStatus }) {
	const map: Record<TaskStatus, { label: string; cls: string }> = {
		completed: { label: 'Completado', cls: 'bg-green-100 text-green-700' },
		pending: {
			label: 'Pendiente',
			cls: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
		},
		'in-progress': {
			label: 'En progreso',
			cls: 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]',
		},
	};
	const { label, cls } = map[status];
	return (
		<span
			className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest ${cls}`}>
			{label}
		</span>
	);
}

/* ── NewMaintenanceModal ─────────────────────────────────── */
export interface NewMaintenanceModalProps {
	open: boolean;
	onClose: () => void;
}

export function NewMaintenanceModal({
	open,
	onClose,
}: NewMaintenanceModalProps) {
	const [equipment, setEquipment] = useState('Purificadora');
	const [taskType, setTaskType] = useState('Retro-lavado');
	const [notes, setNotes] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [onClose]);

	if (!open) return null;

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		await new Promise((r) => setTimeout(r, 800));
		setSubmitting(false);
		onClose();
	}

	return (
		<div
			className='fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm'
			style={{ backgroundColor: 'rgba(11,28,48,0.4)' }}
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div className='bg-[var(--color-surface-container-lowest)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden'>
				{/* Header */}
				<div className='p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-primary)] text-[var(--color-on-primary)]'>
					<h3 className='text-headline-sm font-semibold'>
						Registrar Nuevo Mantenimiento
					</h3>
					<button
						onClick={onClose}
						className='p-2 hover:bg-white/10 rounded-full transition-colors'
						aria-label='Cerrar'>
						<Close className='w-5 h-5' />
					</button>
				</div>

				{/* Form */}
				<form className='p-6 space-y-6' onSubmit={handleSubmit}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Equipo */}
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
								Equipo
							</label>
							<select
								className='w-full bg-[var(--color-surface-container)] border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] h-12 px-3 text-body-md text-[var(--color-on-surface)]'
								value={equipment}
								onChange={(e) => setEquipment(e.target.value)}>
								<option>Purificadora</option>
								<option>Cisterna</option>
								<option>Vehiculo</option>
							</select>
						</div>

						{/* Tipo de Mantenimiento */}
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
								Tipo de Mantenimiento
							</label>
							<select
								className='w-full bg-[var(--color-surface-container)] border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] h-12 px-3 text-body-md text-[var(--color-on-surface)]'
								value={taskType}
								onChange={(e) => setTaskType(e.target.value)}>
								<option>Retro-lavado</option>
								<option>Cambio de Filtros</option>
								<option>Limpieza de Tanques</option>
								<option>Calibración de Sensores</option>
							</select>
						</div>
					</div>

					{/* Fecha y Hora */}
					<div className='space-y-1'>
						<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
							Fecha y Hora
						</label>
						<input
							type='datetime-local'
							className='w-full bg-[var(--color-surface-container)] border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] h-12 px-3 text-body-md text-[var(--color-on-surface)]'
							defaultValue={new Date().toISOString().slice(0, 16)}
						/>
					</div>

					{/* Observaciones */}
					<div className='space-y-1'>
						<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
							Observaciones del Técnico
						</label>
						<textarea
							className='w-full bg-[var(--color-surface-container)] border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] p-4 text-body-md text-[var(--color-on-surface)] resize-none'
							placeholder='Detalle cualquier anomalía detectada durante el proceso...'
							rows={3}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
					</div>

					{/* Evidencia Fotográfica */}
					<div className='space-y-1'>
						<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
							Evidencia Fotográfica
						</label>
						<div className='border-2 border-dashed border-[var(--color-outline-variant)] rounded-xl p-8 flex flex-col items-center justify-center hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer group'>
							<AddAPhoto className='w-8 h-8 text-[var(--color-outline-variant)] mb-2' />
							<p className='text-body-md text-[var(--color-on-surface-variant)]'>
								Subir imagen de prueba
							</p>
							<p className='text-label-md text-[var(--color-outline)]'>
								JPG, PNG hasta 5MB
							</p>
						</div>
					</div>

					{/* Actions */}
					<div className='pt-2 flex gap-4'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 py-3 font-bold border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl hover:bg-[var(--color-surface-container)] transition-all'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={submitting}
							className='flex-1 py-3 font-bold bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl hover:opacity-90 shadow-lg transition-all disabled:opacity-60'>
							{submitting ? 'Guardando…' : 'Guardar Registro'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
