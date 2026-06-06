import type { StatusVariant } from '@/components/ui/StatusChip';

/* ── Dominio ─────────────────────────────────────────────── */
export type EstadoPedido = 'en-camino' | 'entregado' | 'pendiente';
export type TipoServicio = 'recarga' | 'nuevo';
export type EstadoPago = 'pendiente' | 'en-entrega' | 'pagado';

export interface Pedido {
	id: string;
	cliente: string;
	iniciales: string;
	avatarColor: string;
	botellones: number;
	total: number;
	estado: EstadoPedido;
}

export interface Cliente {
	iniciales: string;
	nombre: string;
	direccion: string;
}

/* ── Configuración visual ────────────────────────────────── */
export const ESTADO_CONFIG: Record<
	EstadoPedido,
	{ label: string; status: StatusVariant; chip: string }
> = {
	'en-camino': {
		label: 'En camino',
		status: 'info',
		chip: 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]',
	},
	entregado: {
		label: 'Entregado',
		status: 'operational',
		chip: 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]',
	},
	pendiente: {
		label: 'Pendiente',
		status: 'pending',
		chip: 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]',
	},
};

export const FILTROS_PEDIDO: {
	label: string;
	value: EstadoPedido | 'todos';
}[] = [
	{ label: 'Todos', value: 'todos' },
	{ label: 'En camino', value: 'en-camino' },
	{ label: 'Entregados', value: 'entregado' },
	{ label: 'Pendientes', value: 'pendiente' },
];

export const CLIENTES_MOCK: Cliente[] = [
	{
		iniciales: 'AR',
		nombre: 'Alejandro Rodríguez',
		direccion: 'Calle 15 #45-20, Edificio Mirador',
	},
	{
		iniciales: 'JR',
		nombre: 'Juan Rodríguez',
		direccion: 'Av. Principal #123',
	},
	{
		iniciales: 'MA',
		nombre: 'María Alarcón',
		direccion: 'Carrera 5 #20-10, Apto 301',
	},
	{
		iniciales: 'CP',
		nombre: 'Carlos Pérez',
		direccion: 'Calle 30 #8-50',
	},
];

export const PEDIDOS_MOCK: Pedido[] = [
	{
		id: 'ORD-9902',
		cliente: 'Juan Rodríguez',
		iniciales: 'JR',
		avatarColor: 'var(--color-primary-fixed)',
		botellones: 12,
		total: 156,
		estado: 'en-camino',
	},
	{
		id: 'ORD-9884',
		cliente: 'María Alarcón',
		iniciales: 'MA',
		avatarColor: 'var(--color-secondary-fixed)',
		botellones: 5,
		total: 65,
		estado: 'entregado',
	},
	{
		id: 'ORD-9877',
		cliente: 'Carlos Pérez',
		iniciales: 'CP',
		avatarColor: 'var(--color-tertiary-fixed)',
		botellones: 20,
		total: 260,
		estado: 'en-camino',
	},
	{
		id: 'ORD-9865',
		cliente: 'Lucía Gómez',
		iniciales: 'LG',
		avatarColor: 'var(--color-primary-fixed-dim)',
		botellones: 8,
		total: 104,
		estado: 'entregado',
	},
	{
		id: 'ORD-9851',
		cliente: 'Andrés Mendoza',
		iniciales: 'AM',
		avatarColor: 'var(--color-surface-container-high)',
		botellones: 3,
		total: 39,
		estado: 'pendiente',
	},
	{
		id: 'ORD-9840',
		cliente: 'Sofía Vargas',
		iniciales: 'SV',
		avatarColor: 'var(--color-secondary-container)',
		botellones: 15,
		total: 195,
		estado: 'pendiente',
	},
];

export const PRECIO_UNITARIO = 5.5;
export const CARGO_ENTREGA = 2.0;

export const FRANJAS_HORARIAS = [
	'08:00 - 10:00',
	'10:00 - 12:00',
	'14:00 - 16:00',
	'16:00 - 18:00',
];

export const ESTADOS_PAGO: { value: EstadoPago; label: string }[] = [
	{ value: 'pendiente', label: 'Pendiente' },
	{ value: 'en-entrega', label: 'En Entrega' },
	{ value: 'pagado', label: 'Pagado' },
];
