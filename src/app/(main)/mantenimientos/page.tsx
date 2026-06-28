'use client';

import {
	NewMaintenanceModal,
	StatusBadge,
} from '@/features/mantenimientos/components/NewMaintenance';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import dayjs from 'dayjs';

import AddCircle from '@/assets/icons/add_circle.svg';
import ArrowForward from '@/assets/icons/arrow_forward.svg';
import CheckCircle from '@/assets/icons/check_circle.svg';
import Event from '@/assets/icons/event.svg';
import MoreVert from '@/assets/icons/more_vert.svg';
import Notifications from '@/assets/icons/notifications.svg';
import { ProgramarMantenimiento } from '@/features/mantenimientos/components/ProgramarMantenimiento';
import DatePicker, {
	DatePickerValue,
	RangeValue,
} from '@/components/ui/DatePicker/DatePicker';
import { formatDate, formatToAPIDate } from '@/lib/utils';

/* ─── Page ───────────────────────────────────────────── */
export default function MantenimientosPage() {
	const [modalOpen, setModalOpen] = useState(false);
	const [scheduleOpen, setScheduleOpen] = useState(false);
	const [tasks, setTasks] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
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

	const toDateString = (value: string | Date | null) => {
		return formatToAPIDate(value);
	};

	useEffect(() => {
		async function fetchTasks() {
			try {
				setLoading(true);
				const data = await apiClient.get<any[]>(
					`/maintenance-tasks?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
				);
				setTasks(data);
			} catch (error) {
				console.error('Error fetching maintenance tasks:', error);
			} finally {
				setLoading(false);
			}
		}
		fetchTasks();
	}, [modalOpen, scheduleOpen, dateRange.startDate, dateRange.endDate]); // Refresh when modals close or date changes

	return (
		<>
			{/* ── Top App Bar ──────────────────────────────── */}
			<header className='fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 h-16 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)]'>
				<div className='flex items-center gap-3'>
					<h1 className='text-headline-md font-bold text-[var(--color-primary)]'>
						AquaFlow Manager
					</h1>
				</div>
				<div className='flex items-center gap-4'>
					<button className='p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors relative'>
						<Notifications className='w-6 h-6 text-[var(--color-primary)]' />
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
									<CheckCircle className='w-4 h-4' />
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
							<AddCircle />
							<span className='text-headline-sm font-semibold'>
								Registrar Nuevo Mantenimiento
							</span>
						</button>

						{/* Schedule Maintenance Button */}
						<button
							onClick={() => setScheduleOpen(true)}
							className='w-full bg-[var(--color-secondary)] text-[var(--color-on-secondary)] p-6 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-lg group'>
							<Event className='w-6 h-6 shrink-0' />
							<span className='text-headline-sm font-semibold'>
								Programar Mantenimiento
							</span>
						</button>
					</div>

					{/* ── Right Column ────────────────────── */}
					<div className='lg:col-span-8'>
						<div className='bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)]'>
							{/* Table Header */}
							<div className='p-6 border-b border-[var(--color-outline-variant)] flex flex-wrap justify-between items-center gap-4 bg-white'>
								<h3 className='text-headline-sm font-semibold text-[var(--color-on-surface)]'>
									Tareas Recientes
								</h3>
								<div className='flex items-center gap-4'>
									<DatePicker
										mode='date'
										selectionType='range'
										placeholder='Selecciona las fechas'
										value={[
											dateRange.startDate,
											dateRange.endDate,
										]}
										onChange={(e: DatePickerValue) => {
											console.log(e);

											if (!Array.isArray(e)) return;

											const [start, end] = e;
											let startDate = toDateString(start);
											let endDate = toDateString(end);

											if (startDate && endDate)
												setDateRange({
													startDate,
													endDate,
												});
										}}
									/>

									<button className='text-[var(--color-primary)] text-label-md font-medium flex items-center gap-1 hover:underline'>
										Ver historial completo
										<ArrowForward className='w-4 h-4' />
									</button>
								</div>
							</div>

							{/* Task List */}
							<div className='divide-y divide-[var(--color-outline-variant)]'>
								{loading ? (
									<div className='p-6 text-center text-body-md text-[var(--color-on-surface-variant)]'>
										Cargando tareas...
									</div>
								) : tasks.length === 0 ? (
									<div className='p-6 text-center text-body-md text-[var(--color-on-surface-variant)]'>
										No hay tareas registradas.
									</div>
								) : (
									tasks.map((task) => {
										// Inferir status basado en la presencia de evidencia o notas,
										// o si la fecha es en el futuro.
										const taskDate = new Date(task.date);
										const today = new Date();
										let inferredStatus:
											| 'completed'
											| 'pending'
											| 'in-progress' = 'pending';

										if (
											task.evidence ||
											task.notes ||
											taskDate <= today
										) {
											inferredStatus = 'completed';
											// Si la fecha es pasada o de hoy y NO tiene notas/evidencia, asumiremos que se completó igual para no dejarlo colgado, o podríamos usar 'pending' si prefieren. Por ahora usaremos la lógica: si tiene evidencia o notas, o si la fecha ya pasó, está completed.
											// Ajuste fino: si no tiene notas ni evidencia, y es a futuro, pending.
											if (
												!task.evidence &&
												!task.notes &&
												taskDate > today
											) {
												inferredStatus = 'pending';
											}
										}

										const title = task.equipment?.name
											? `${task.maintenance_types?.name || 'Mantenimiento'} - ${task.equipment.name}`
											: `Tarea #${task.serial_number}`;

										return (
											<div
												key={`${task.equipment_id}-${task.maintenance_type_id}-${task.serial_number}`}
												className='p-6 hover:bg-[var(--color-surface-container-low)] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4'>
												{/* Left: icon + info */}
												<div className='flex gap-4'>
													<div>
														<h4 className='text-body-lg font-bold text-[var(--color-on-surface)]'>
															{title}
														</h4>
														<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
															Fecha:{' '}
															{new Date(
																task.date,
															).toLocaleDateString(
																'es-GT',
																{
																	day: '2-digit',
																	month: 'short',
																	year: 'numeric',
																},
															)}
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
																inferredStatus ===
																'completed'
																	? 'text-green-600'
																	: 'text-[var(--color-error)]'
															}`}>
															{inferredStatus ===
															'completed'
																? 'Completado'
																: 'Pendiente'}
														</span>
													</div>
													{/* Mobile: badge */}
													<div className='md:hidden'>
														<StatusBadge
															status={
																inferredStatus
															}
														/>
													</div>
													<button className='p-2 hover:bg-[var(--color-surface-variant)] rounded-full transition-all'>
														<MoreVert className='w-5 h-5 text-[var(--color-on-surface-variant)]' />
													</button>
												</div>
											</div>
										);
									})
								)}
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
			<ProgramarMantenimiento
				isOpen={scheduleOpen}
				onClose={() => setScheduleOpen(false)}
			/>
		</>
	);
}
