'use client';

import { useState, useEffect } from 'react';

/* ─── Types ─────────────────────────────────────────── */
type TaskStatus = 'completed' | 'pending' | 'in-progress';
type Priority = 'baja' | 'alta';

interface MaintenanceTask {
	id: number;
	title: string;
	operator: string;
	time: string;
	status: TaskStatus;
	icon: string;
	iconBg: string;
	iconColor: string;
}

/* ─── Static data ────────────────────────────────────── */
const TASKS: MaintenanceTask[] = [
	{
		id: 1,
		title: 'Retro-lavado de Filtro de Carbón',
		operator: 'Carlos Méndez',
		time: '14:30 PM',
		status: 'completed',
		icon: 'refresh',
		iconBg: 'bg-[var(--color-primary-container)]',
		iconColor: 'text-[var(--color-on-primary-container)]',
	},
	{
		id: 2,
		title: 'Cambio de Filtros de Sedimento',
		operator: '',
		time: 'Programado para: 17:00 PM',
		status: 'pending',
		icon: 'filter_alt',
		iconBg: 'bg-[var(--color-secondary-container)]',
		iconColor: 'text-[var(--color-on-secondary-container)]',
	},
	{
		id: 3,
		title: 'Análisis de Calidad de Agua (Post-Filtro)',
		operator: 'Elena Ruiz',
		time: '09:15 AM',
		status: 'completed',
		icon: 'biotech',
		iconBg: 'bg-[var(--color-surface-container-highest)]',
		iconColor: 'text-[var(--color-primary)]',
	},
];

/* ─── Helpers ────────────────────────────────────────── */
function StatusBadge({ status }: { status: TaskStatus }) {
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

/* ─── Modal ──────────────────────────────────────────── */
interface ModalProps {
	open: boolean;
	onClose: () => void;
}

function NewMaintenanceModal({ open, onClose }: ModalProps) {
	const [priority, setPriority] = useState<Priority>('alta');
	const [taskType, setTaskType] = useState('Retro-lavado');
	const [notes, setNotes] = useState('');
	const [submitting, setSubmitting] = useState(false);

	// Close on Escape
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
						<span className='material-symbols-outlined'>close</span>
					</button>
				</div>

				{/* Form */}
				<form className='p-6 space-y-6' onSubmit={handleSubmit}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Tipo de Tarea */}
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
								Tipo de Tarea
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

						{/* Prioridad */}
						<div className='space-y-1'>
							<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
								Prioridad
							</label>
							<div className='flex gap-2'>
								{(['baja', 'alta'] as Priority[]).map((p) => (
									<button
										key={p}
										type='button'
										onClick={() => setPriority(p)}
										className={`flex-1 py-2 rounded-xl text-label-md font-bold uppercase transition-all ${
											priority === p
												? 'border-2 border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]'
												: 'border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface)]'
										}`}>
										{p}
									</button>
								))}
							</div>
						</div>
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
							<span className='material-symbols-outlined text-5xl text-[var(--color-outline-variant)] group-hover:text-[var(--color-primary)] mb-2 transition-colors'>
								add_a_photo
							</span>
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

/* ─── Page ───────────────────────────────────────────── */
export default function MantenimientosPage() {
	const [modalOpen, setModalOpen] = useState(false);

	return (
		<>
			{/* ── Top App Bar ──────────────────────────────── */}
			<header className='fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-16 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)]'>
				<div className='flex items-center gap-3'>
					<span className='material-symbols-outlined text-[var(--color-primary)] text-2xl'>
						water_drop
					</span>
					<h1 className='text-headline-md font-bold text-[var(--color-primary)]'>
						AquaFlow Manager
					</h1>
				</div>
				<div className='flex items-center gap-4'>
					<button className='p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors relative'>
						<span className='material-symbols-outlined text-[var(--color-on-surface-variant)]'>
							notifications
						</span>
						<span className='absolute top-2 right-2 w-2 h-2 bg-[var(--color-error)] rounded-full' />
					</button>
					<div className='w-10 h-10 rounded-full overflow-hidden border-2 border-[var(--color-primary-container)] bg-[var(--color-surface-container)] flex items-center justify-center'>
						<span className='material-symbols-outlined text-[var(--color-primary)]'>
							person
						</span>
					</div>
				</div>
			</header>

			{/* ── Main Content ─────────────────────────────── */}
			<main className='pt-24 pb-28 px-4 md:px-12 max-w-7xl mx-auto'>
				{/* Welcome */}
				<section className='mb-8'>
					<h2 className='text-headline-lg font-semibold text-[var(--color-on-surface)] mb-1'>
						Control de Mantenimiento
					</h2>
					<p className='text-body-md text-[var(--color-on-surface-variant)]'>
						Gestión técnica y supervisión de filtros y purificación.
					</p>
				</section>

				{/* Bento Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
					{/* ── Left Column ─────────────────────── */}
					<div className='lg:col-span-4 space-y-6'>
						{/* System Status Card */}
						<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)]'>
							<div className='flex items-center justify-between mb-4'>
								<span className='text-label-md font-medium text-[var(--color-outline)] uppercase tracking-wider'>
									Estado del Sistema
								</span>
								<span className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
									<span
										className='material-symbols-outlined text-sm'
										style={{
											fontVariationSettings: "'FILL' 1",
										}}>
										check_circle
									</span>
									ÓPTIMO
								</span>
							</div>

							{/* Plant image placeholder */}
							<div className='relative h-48 w-full rounded-lg overflow-hidden mb-4 bg-[var(--color-surface-container)]'>
								<div className='absolute inset-0 flex items-center justify-center'>
									<span className='material-symbols-outlined text-[80px] text-[var(--color-primary-container)]'>
										water
									</span>
								</div>
								<div className='absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/60 to-transparent flex items-end p-4'>
									<p className='text-[var(--color-on-primary)] text-label-md font-medium'>
										Planta Central — Unidad 04
									</p>
								</div>
							</div>

							{/* Stats */}
							<div className='grid grid-cols-2 gap-2'>
								<div className='bg-[var(--color-surface-container)] p-4 rounded-lg'>
									<p className='text-label-md text-[var(--color-on-surface-variant)]'>
										Último Retro-lavado
									</p>
									<p className='text-headline-sm font-semibold text-[var(--color-primary)]'>
										Hace 4h
									</p>
								</div>
								<div className='bg-[var(--color-surface-container)] p-4 rounded-lg'>
									<p className='text-label-md text-[var(--color-on-surface-variant)]'>
										Vida de Filtros
									</p>
									<p className='text-headline-sm font-semibold text-[var(--color-secondary)]'>
										82%
									</p>
								</div>
							</div>
						</div>

						{/* Quick Register Button */}
						<button
							onClick={() => setModalOpen(true)}
							className='w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] p-6 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-lg group'>
							<span className='material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform'>
								add_circle
							</span>
							<span className='text-headline-sm font-semibold'>
								Registrar Nuevo Mantenimiento
							</span>
						</button>
					</div>

					{/* ── Right Column ────────────────────── */}
					<div className='lg:col-span-8'>
						<div className='bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] overflow-hidden'>
							{/* Table Header */}
							<div className='p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-white'>
								<h3 className='text-headline-sm font-semibold text-[var(--color-on-surface)]'>
									Tareas Recientes
								</h3>
								<button className='text-[var(--color-primary)] text-label-md font-medium flex items-center gap-1 hover:underline'>
									Ver historial completo
									<span className='material-symbols-outlined text-base'>
										arrow_forward
									</span>
								</button>
							</div>

							{/* Task List */}
							<div className='divide-y divide-[var(--color-outline-variant)]'>
								{TASKS.map((task) => (
									<div
										key={task.id}
										className='p-6 hover:bg-[var(--color-surface-container-low)] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4'>
										{/* Left: icon + info */}
										<div className='flex gap-4'>
											<div
												className={`w-12 h-12 ${task.iconBg} rounded-lg flex items-center justify-center ${task.iconColor} shrink-0`}>
												<span className='material-symbols-outlined'>
													{task.icon}
												</span>
											</div>
											<div>
												<h4 className='text-body-lg font-bold text-[var(--color-on-surface)]'>
													{task.title}
												</h4>
												<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
													{task.operator
														? `Operador: ${task.operator} • `
														: ''}
													{task.time}
												</p>
											</div>
										</div>

										{/* Right: status + menu */}
										<div className='flex items-center justify-between md:justify-end gap-6'>
											{/* Desktop: text status */}
											<div className='text-right hidden md:block'>
												<p className='text-label-md text-[var(--color-outline)]'>
													Estado
												</p>
												<span
													className={`font-bold text-body-sm ${
														task.status ===
														'completed'
															? 'text-green-600'
															: 'text-[var(--color-error)]'
													}`}>
													{task.status === 'completed'
														? 'Completado'
														: 'Pendiente'}
												</span>
											</div>
											{/* Mobile: badge */}
											<div className='md:hidden'>
												<StatusBadge
													status={task.status}
												/>
											</div>
											<button className='p-2 hover:bg-[var(--color-surface-variant)] rounded-full transition-all'>
												<span className='material-symbols-outlined text-[var(--color-on-surface-variant)]'>
													more_vert
												</span>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* ── Modal ────────────────────────────────────── */}
			<NewMaintenanceModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
}
