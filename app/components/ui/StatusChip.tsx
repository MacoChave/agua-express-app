export type StatusVariant =
	| 'operational'
	| 'alert'
	| 'pending'
	| 'maintenance'
	| 'inactive'
	| 'info';

interface StatusChipProps {
	status: StatusVariant;
	label?: string;
	size?: 'sm' | 'md';
	dot?: boolean;
	className?: string;
}

const statusConfig: Record<
	StatusVariant,
	{ label: string; bg: string; text: string; dot: string }
> = {
	operational: {
		label: 'Operacional',
		bg: 'bg-emerald-100',
		text: 'text-emerald-800',
		dot: 'bg-emerald-500',
	},
	alert: {
		label: 'Alerta',
		bg: 'bg-[var(--color-error-container)]',
		text: 'text-[var(--color-on-error-container)]',
		dot: 'bg-[var(--color-error)]',
	},
	pending: {
		label: 'Pendiente',
		bg: 'bg-amber-100',
		text: 'text-amber-800',
		dot: 'bg-amber-500',
	},
	maintenance: {
		label: 'Mantenimiento',
		bg: 'bg-[var(--color-surface-container-high)]',
		text: 'text-[var(--color-on-surface-variant)]',
		dot: 'bg-[var(--color-outline)]',
	},
	inactive: {
		label: 'Inactivo',
		bg: 'bg-[var(--color-surface-container)]',
		text: 'text-[var(--color-on-surface-variant)]',
		dot: 'bg-[var(--color-outline-variant)]',
	},
	info: {
		label: 'Info',
		bg: 'bg-[var(--color-secondary-fixed)]',
		text: 'text-[var(--color-on-secondary-fixed-variant)]',
		dot: 'bg-[var(--color-secondary)]',
	},
};

const sizeStyles = {
	sm: 'text-xs px-2 py-0.5 gap-1',
	md: 'text-label-md px-3 py-1 gap-1.5',
};

export default function StatusChip({
	status,
	label,
	size = 'md',
	dot = true,
	className = '',
}: StatusChipProps) {
	const config = statusConfig[status];
	const displayLabel = label ?? config.label;

	return (
		<span
			className={[
				'inline-flex items-center font-medium rounded-[var(--radius-full)]',
				config.bg,
				config.text,
				sizeStyles[size],
				className,
			]
				.filter(Boolean)
				.join(' ')}>
			{dot && (
				<span
					className={[
						'rounded-full shrink-0',
						config.dot,
						size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
					].join(' ')}
					aria-hidden='true'
				/>
			)}
			{displayLabel}
		</span>
	);
}
