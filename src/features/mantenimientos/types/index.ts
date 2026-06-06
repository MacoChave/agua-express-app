/* ── Dominio ─────────────────────────────────────────────── */
export type TaskStatus = 'completed' | 'pending' | 'in-progress';
export type Priority = 'baja' | 'alta';

export interface MaintenanceTask {
	id: number;
	title: string;
	operator: string;
	time: string;
	status: TaskStatus;
	icon: string;
	iconBg: string;
	iconColor: string;
}

/* ── Datos estáticos ─────────────────────────────────────── */
export const TASKS: MaintenanceTask[] = [
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
