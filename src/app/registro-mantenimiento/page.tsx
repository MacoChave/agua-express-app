'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import ArrowBack from '@/assets/icons/arrow_back.svg';
import Close from '@/assets/icons/close.svg';
import AddAPhoto from '@/assets/icons/add_a_photo.svg';

/* ─── Types ─────────────────────────────────────────── */
type Status = 'completed' | 'in-progress';

interface FormState {
	equipment: string;
	maintenanceType: string;
	datetime: string;
	status: Status;
	operator: string;
	notes: string;
	photo: File | null;
}

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

/* ─── Helpers ────────────────────────────────────────── */
function nowDatetimeLocal() {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ─── Page ───────────────────────────────────────────── */
export default function RegistroMantenimientoPage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [form, setForm] = useState<FormState>({
		equipment: EQUIPMENT_OPTIONS[0],
		maintenanceType: MAINTENANCE_TYPES[0],
		datetime: nowDatetimeLocal(),
		status: 'in-progress',
		operator: 'Ing. Ricardo Méndez',
		notes: '',
		photo: null,
	});

	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	function set<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((prev) => ({ ...prev, [key]: value }));
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		set('photo', file);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);
		await new Promise((r) => setTimeout(r, 1000));
		setSubmitting(false);
		setSuccess(true);
		setTimeout(() => router.push('/mantenimientos'), 1500);
	}

	return (
		<>
			{/* ── Top App Bar ──────────────────────────────── */}
			<header className='fixed top-0 left-0 w-full z-50 flex items-center px-4 h-16 bg-[var(--color-surface)] shadow-sm'>
				<Link
					href='/mantenimientos'
					className='mr-4 p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors active:scale-95'
					aria-label='Volver'>
					<ArrowBack className='w-5 h-5 text-[var(--color-primary)]' />
				</Link>
				<h1 className='text-headline-sm font-bold text-[var(--color-primary)]'>
					Nuevo Registro
				</h1>
				<div className='ml-auto'>
					<Link
						href='/mantenimientos'
						className='p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors block'
						aria-label='Historial'>
						<span className='material-symbols-outlined text-[var(--color-on-surface-variant)]'>
							history
						</span>
					</Link>
				</div>
			</header>

			{/* ── Main Form ────────────────────────────────── */}
			<main className='pt-20 pb-28 px-4 max-w-2xl mx-auto space-y-6'>
				<form className='space-y-6' onSubmit={handleSubmit}>
					{/* ── Identificación ───────────────────────── */}
					<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] space-y-4'>
						<div className='flex items-center gap-3 mb-2'>
							<span
								className='material-symbols-outlined text-[var(--color-primary)]'
								style={{ fontVariationSettings: "'FILL' 1" }}>
								precision_manufacturing
							</span>
							<h2 className='text-headline-sm font-semibold text-[var(--color-primary)]'>
								Identificación
							</h2>
						</div>

						{/* Equipo */}
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
								Equipo / Instalación
							</label>
							<div className='relative'>
								<select
									className='w-full bg-[var(--color-surface-container-low)] border-0 rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-[var(--color-secondary-container)] transition-all text-body-md text-[var(--color-on-surface)]'
									value={form.equipment}
									onChange={(e) =>
										set('equipment', e.target.value)
									}>
									{EQUIPMENT_OPTIONS.map((o) => (
										<option key={o}>{o}</option>
									))}
								</select>
								<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-on-surface-variant)]'>
									expand_more
								</span>
							</div>
						</div>

						{/* Tipo de Mantenimiento */}
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
								Tipo de Mantenimiento
							</label>
							<div className='relative'>
								<select
									className='w-full bg-[var(--color-surface-container-low)] border-0 rounded-xl py-3 pl-4 pr-10 appearance-none focus:ring-2 focus:ring-[var(--color-secondary-container)] transition-all text-body-md text-[var(--color-on-surface)]'
									value={form.maintenanceType}
									onChange={(e) =>
										set('maintenanceType', e.target.value)
									}>
									{MAINTENANCE_TYPES.map((t) => (
										<option key={t}>{t}</option>
									))}
								</select>
								<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-on-surface-variant)]'>
									build
								</span>
							</div>
						</div>
					</div>

					{/* ── Fecha/Hora + Estado ───────────────────── */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Fecha y Hora */}
						<div className='bg-[var(--color-surface-container-lowest)] p-5 rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] space-y-3'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase flex items-center gap-2'>
								<span className='material-symbols-outlined text-sm'>
									schedule
								</span>
								Fecha y Hora
							</label>
							<input
								type='datetime-local'
								className='w-full bg-transparent border-0 border-b-2 border-[var(--color-surface-container-high)] focus:border-[var(--color-secondary-container)] focus:ring-0 text-body-md text-[var(--color-on-surface)] py-1'
								value={form.datetime}
								onChange={(e) =>
									set('datetime', e.target.value)
								}
							/>
						</div>

						{/* Estado */}
						<div className='bg-[var(--color-surface-container-lowest)] p-5 rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] space-y-3'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase flex items-center gap-2'>
								<span className='material-symbols-outlined text-sm'>
									assignment_turned_in
								</span>
								Estado
							</label>
							<div className='flex gap-2'>
								{(
									[
										{
											value: 'completed',
											label: 'Completado',
										},
										{
											value: 'in-progress',
											label: 'En Progreso',
										},
									] as { value: Status; label: string }[]
								).map(({ value, label }) => (
									<button
										key={value}
										type='button'
										onClick={() => set('status', value)}
										className={`flex-1 py-2 rounded-lg text-label-md font-medium transition-all border-2 ${
											form.status === value
												? 'border-[var(--color-secondary-container)] bg-[var(--color-secondary-container)]/10 text-[var(--color-on-secondary-container)]'
												: 'border-transparent bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]'
										}`}>
										{label}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* ── Operador ─────────────────────────────── */}
					<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] space-y-4'>
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
								Técnico / Operador Responsable
							</label>
							<div className='relative'>
								<input
									type='text'
									className='w-full bg-[var(--color-surface-container-low)] border-0 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[var(--color-secondary-container)] transition-all text-body-md text-[var(--color-on-surface)]'
									placeholder='Nombre completo'
									value={form.operator}
									onChange={(e) =>
										set('operator', e.target.value)
									}
								/>
								<span className='material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]'>
									person
								</span>
							</div>
						</div>
					</div>

					{/* ── Evidencia Fotográfica ─────────────────── */}
					<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] space-y-4'>
						<div className='flex justify-between items-center'>
							<h3 className='text-headline-sm font-semibold text-[var(--color-primary)]'>
								Evidencia Fotográfica
							</h3>
							<span className='text-label-md text-[var(--color-on-surface-variant)]'>
								Máx. 5 MB
							</span>
						</div>

						<input
							ref={fileInputRef}
							type='file'
							accept='image/*'
							className='hidden'
							onChange={handleFileChange}
						/>

						<div
							onClick={() => fileInputRef.current?.click()}
							className='border-2 border-dashed border-[var(--color-outline-variant)] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:border-[var(--color-secondary-container)] hover:bg-[var(--color-secondary-container)]/5 transition-all'>
							{form.photo ? (
								<>
									<div className='w-16 h-16 bg-[var(--color-secondary-container)]/20 rounded-full flex items-center justify-center'>
										<span
											className='material-symbols-outlined text-3xl text-[var(--color-secondary)]'
											style={{
												fontVariationSettings:
													"'FILL' 1",
											}}>
											check_circle
										</span>
									</div>
									<div>
										<p className='text-body-md font-medium text-[var(--color-on-surface)]'>
											{form.photo.name}
										</p>
										<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
											{(form.photo.size / 1024).toFixed(
												0,
											)}{' '}
											KB · Toca para cambiar
										</p>
									</div>
								</>
							) : (
								<>
									<div className='w-16 h-16 bg-[var(--color-surface-container-high)] rounded-full flex items-center justify-center'>
										<span className='material-symbols-outlined text-3xl text-[var(--color-primary)]'>
											photo_camera
										</span>
									</div>
									<div>
										<p className='text-body-md font-medium text-[var(--color-on-surface)]'>
											Subir Comprobante
										</p>
										<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
											Toca para abrir la cámara o arrastra
											un archivo
										</p>
									</div>
								</>
							)}
						</div>
					</div>

					{/* ── Observaciones ────────────────────────── */}
					<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] space-y-4'>
						<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wider'>
							Observaciones y Notas
						</label>
						<textarea
							className='w-full bg-[var(--color-surface-container-low)] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[var(--color-secondary-container)] transition-all text-body-md text-[var(--color-on-surface)] resize-none'
							placeholder='Detalle los hallazgos o ajustes realizados durante el mantenimiento...'
							rows={4}
							value={form.notes}
							onChange={(e) => set('notes', e.target.value)}
						/>
					</div>

					{/* ── Submit ────────────────────────────────── */}
					<div className='pt-2 pb-8'>
						<button
							type='submit'
							disabled={submitting || success}
							className='w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-headline-sm font-semibold py-4 rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-60'>
							{success ? (
								<>
									<span
										className='material-symbols-outlined'
										style={{
											fontVariationSettings: "'FILL' 1",
										}}>
										check_circle
									</span>
									Registro Guardado
								</>
							) : submitting ? (
								<>
									<span className='material-symbols-outlined animate-spin'>
										progress_activity
									</span>
									Guardando…
								</>
							) : (
								<>
									<span className='material-symbols-outlined'>
										save
									</span>
									Guardar Registro
								</>
							)}
						</button>
					</div>
				</form>
			</main>

			{/* ── Bottom Nav ───────────────────────────────── */}
			<nav className='fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[var(--color-surface-container-lowest)] shadow-[0_-4px_12px_rgba(0,77,122,0.08)]'>
				<Link
					href='/pedidos'
					className='flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] px-3 py-1.5 hover:text-[var(--color-primary)] transition-colors active:scale-90'>
					<span className='material-symbols-outlined'>
						inventory_2
					</span>
					<span className='text-label-md mt-1'>Inventario</span>
				</Link>
				<Link
					href='/mantenimientos'
					className='flex flex-col items-center justify-center bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] rounded-xl px-3 py-1.5 active:scale-90'>
					<span
						className='material-symbols-outlined'
						style={{ fontVariationSettings: "'FILL' 1" }}>
						build
					</span>
					<span className='text-label-md mt-1'>Mant.</span>
				</Link>
				<Link
					href='/dashboard'
					className='flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] px-3 py-1.5 hover:text-[var(--color-primary)] transition-colors active:scale-90'>
					<span className='material-symbols-outlined'>warning</span>
					<span className='text-label-md mt-1'>Alertas</span>
				</Link>
				<Link
					href='/dashboard'
					className='flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] px-3 py-1.5 hover:text-[var(--color-primary)] transition-colors active:scale-90'>
					<span className='material-symbols-outlined'>settings</span>
					<span className='text-label-md mt-1'>Ajustes</span>
				</Link>
			</nav>
		</>
	);
}
