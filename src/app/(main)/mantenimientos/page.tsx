'use client';

import {
	NewMaintenanceModal,
	StatusBadge,
} from '@/features/mantenimientos/components/NewMaintenance';
import { TASKS } from '@/features/mantenimientos/types';
import { useState } from 'react';

import AddCircle from '@/assets/icons/add_circle.svg';
import ArrowForward from '@/assets/icons/arrow_forward.svg';
import CheckCircle from '@/assets/icons/check_circle.svg';
import Event from '@/assets/icons/event.svg';
import MoreVert from '@/assets/icons/more_vert.svg';
import Notifications from '@/assets/icons/notifications.svg';
import { ProgramarMantenimiento } from '@/features/mantenimientos/components/ProgramarMantenimiento';

/* ─── Page ───────────────────────────────────────────── */
export default function MantenimientosPage() {
	const [modalOpen, setModalOpen] = useState(false);
	const [scheduleOpen, setScheduleOpen] = useState(false);

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
						<div className='bg-[var(--color-surface-container-lowest)] rounded-xl shadow-[0_4px_12px_rgba(0,77,122,0.08)] overflow-hidden'>
							{/* Table Header */}
							<div className='p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-white'>
								<h3 className='text-headline-sm font-semibold text-[var(--color-on-surface)]'>
									Tareas Recientes
								</h3>
								<button className='text-[var(--color-primary)] text-label-md font-medium flex items-center gap-1 hover:underline'>
									Ver historial completo
									<ArrowForward className='w-4 h-4' />
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
												<MoreVert className='w-5 h-5 text-[var(--color-on-surface-variant)]' />
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
			<ProgramarMantenimiento
				isOpen={scheduleOpen}
				onClose={() => setScheduleOpen(false)}
			/>
		</>
	);
}
