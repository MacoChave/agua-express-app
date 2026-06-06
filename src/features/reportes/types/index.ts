/* ── Dominio ─────────────────────────────────────────────── */
export interface Transaction {
	id: number;
	concept: string;
	category: string;
	time: string;
	amount: number;
	icon: string;
}

/* Bar chart: [label, heightPx, active] */
export type BarEntry = [string, number, boolean];

/* ── Datos estáticos ─────────────────────────────────────── */
export const TRANSACTIONS: Transaction[] = [
	{
		id: 1,
		concept: 'Venta de Bidones x20',
		category: 'Venta Directa',
		time: '14:25 PM',
		amount: 120.0,
		icon: 'water_drop',
	},
	{
		id: 2,
		concept: 'Repuesto Filtro UV',
		category: 'Mantenimiento',
		time: '11:40 AM',
		amount: -345.0,
		icon: 'build',
	},
	{
		id: 3,
		concept: 'Recarga Energía Planta',
		category: 'Servicios',
		time: '09:15 AM',
		amount: -150.25,
		icon: 'electric_bolt',
	},
];

export const BAR_DATA: BarEntry[] = [
	['ENE', 128, false],
	['FEB', 160, false],
	['MAR', 96, false],
	['ABR', 208, true],
	['MAY', 144, false],
	['JUN', 192, false],
];
