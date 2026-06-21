'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/apiClient';

import Close from '@/assets/icons/close.svg';
import AddAPhoto from '@/assets/icons/add_a_photo.svg';
import type { TaskStatus } from '@/features/mantenimientos/types';

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

export interface NewMaintenanceModalProps {
	open: boolean;
	onClose: () => void;
}

export function NewMaintenanceModal({
	open,
	onClose,
}: NewMaintenanceModalProps) {
	const [equipments, setEquipments] = useState<any[]>([]);
	const [maintenanceTypes, setMaintenanceTypes] = useState<any[]>([]);
	const [loadingData, setLoadingData] = useState(true);

	const [equipment, setEquipment] = useState('');
	const [taskType, setTaskType] = useState('');
	const [notes, setNotes] = useState('');
	const [date, setDate] = useState(new Date().toISOString().slice(0, 16));

	const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
	const [evidencePreview, setEvidencePreview] = useState<string | null>(null);

	const [submitting, setSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				const [eqRes, typeRes] = await Promise.all([
					apiClient.get<any[]>('/equipment'),
					apiClient.get<any[]>('/maintenance-types'),
				]);
				setEquipments(eqRes);
				setMaintenanceTypes(typeRes);

				if (eqRes.length > 0 && typeRes.length > 0) {
					setEquipment(String(eqRes[0].id));
					setTaskType(String(typeRes[0].id));
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoadingData(false);
			}
		}

		if (open) {
			fetchData();
			const handler = (e: KeyboardEvent) => {
				if (e.key === 'Escape') onClose();
			};
			window.addEventListener('keydown', handler);
			return () => window.removeEventListener('keydown', handler);
		}
	}, [open, onClose]);

	if (!open) return null;

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setEvidenceFile(file);
			const url = URL.createObjectURL(file);
			setEvidencePreview(url);
		}
	};

	const uploadEvidence = async (file: File) => {
		const fileExt = file.name.split('.').pop();
		const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
		const filePath = `${fileName}`;

		const { error: uploadError } = await supabase.storage
			.from('evidence')
			.upload(filePath, file);

		if (uploadError) {
			throw uploadError;
		}

		const { data } = supabase.storage
			.from('evidence')
			.getPublicUrl(filePath);
		return data.publicUrl;
	};

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);

		try {
			let evidenceUrl = null;
			if (evidenceFile) {
				evidenceUrl = await uploadEvidence(evidenceFile);
			}

			await apiClient.post('/maintenance-tasks/complete', {
				equipment_id: Number(equipment),
				maintenance_type_id: Number(taskType),
				date: date.split('T')[0], // Enviar solo la fecha si así se requiere, o completa si la base de datos lo soporta
				notes,
				evidence: evidenceUrl,
			});

			onClose();
			// Reset form
			setNotes('');
			setEvidenceFile(null);
			setEvidencePreview(null);
		} catch (error) {
			console.error('Error saving maintenance:', error);
			alert('Ocurrió un error al guardar el registro de mantenimiento.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div
			className='fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm'
			style={{ backgroundColor: 'rgba(11,28,48,0.4)' }}
			onClick={(e) => e.target === e.currentTarget && onClose()}>
			<div
				className='bg-[var(--color-surface-container-lowest)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden'
				onClick={(e) => e.stopPropagation()}>
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
								className='w-full bg-[var(--color-surface-container)] border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] h-12 px-3 text-body-md text-[var(--color-on-surface)] disabled:opacity-50'
								value={equipment}
								onChange={(e) => setEquipment(e.target.value)}
								disabled={
									loadingData || equipments.length === 0
								}>
								{loadingData ? (
									<option value=''>Cargando...</option>
								) : equipments.length === 0 ? (
									<option value=''>No hay equipos</option>
								) : (
									equipments.map((eq) => (
										<option key={eq.id} value={eq.id}>
											{eq.name}
										</option>
									))
								)}
							</select>
						</div>

						{/* Tipo de Mantenimiento */}
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
								Tipo de Mantenimiento
							</label>
							<select
								className='w-full bg-[var(--color-surface-container)] border-none rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] h-12 px-3 text-body-md text-[var(--color-on-surface)] disabled:opacity-50'
								value={taskType}
								onChange={(e) => setTaskType(e.target.value)}
								disabled={
									loadingData || maintenanceTypes.length === 0
								}>
								{loadingData ? (
									<option value=''>Cargando...</option>
								) : maintenanceTypes.length === 0 ? (
									<option value=''>No hay tipos</option>
								) : (
									maintenanceTypes.map((type) => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))
								)}
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
							value={date}
							onChange={(e) => setDate(e.target.value)}
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

						<input
							type='file'
							accept='image/*'
							capture='environment'
							ref={fileInputRef}
							className='hidden'
							onChange={handleFileChange}
						/>

						{evidencePreview ? (
							<div className='relative rounded-xl overflow-hidden border-2 border-[var(--color-outline-variant)]'>
								<img
									src={evidencePreview}
									alt='Evidencia'
									className='w-full h-48 object-cover'
								/>
								<button
									type='button'
									onClick={() => {
										setEvidenceFile(null);
										setEvidencePreview(null);
									}}
									className='absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors'>
									<Close className='w-4 h-4' />
								</button>
							</div>
						) : (
							<div
								onClick={() => fileInputRef.current?.click()}
								className='border-2 border-dashed border-[var(--color-outline-variant)] rounded-xl p-8 flex flex-col items-center justify-center hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer group'>
								<AddAPhoto className='w-8 h-8 text-[var(--color-outline-variant)] mb-2' />
								<p className='text-body-md text-[var(--color-on-surface-variant)]'>
									Tomar foto o subir imagen
								</p>
								<p className='text-label-md text-[var(--color-outline)]'>
									JPG, PNG hasta 5MB
								</p>
							</div>
						)}
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
							disabled={
								submitting ||
								equipments.length === 0 ||
								maintenanceTypes.length === 0
							}
							className='flex-1 py-3 font-bold bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-xl hover:opacity-90 shadow-lg transition-all disabled:opacity-60'>
							{submitting ? 'Guardando…' : 'Guardar Registro'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
