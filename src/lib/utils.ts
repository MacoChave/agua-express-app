/**
 * Utilidades globales de Tailwind / clases CSS.
 *
 * Instalar dependencias (opcional):
 *   pnpm add clsx tailwind-merge
 */

// Ejemplo con clsx + tailwind-merge (descomenta si instalas las deps):
// import { clsx, type ClassValue } from 'clsx';
// import { twMerge } from 'tailwind-merge';
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

/** Concatenador de clases condicional sin dependencias externas */
export function cn(
	...inputs: (string | undefined | null | false | 0)[]
): string {
	return inputs.filter(Boolean).join(' ');
}

/** Formatea moneda en USD (es-MX) */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
	}).format(Math.abs(amount));
}

/** Retorna la fecha actual en formato ISO (YYYY-MM-DD) */
export function todayISO(): string {
	return new Date().toISOString().split('T')[0];
}
