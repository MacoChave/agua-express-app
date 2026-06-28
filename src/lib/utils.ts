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

import dayjs from 'dayjs';

/** Concatenador de clases condicional sin dependencias externas */
export function cn(
	...inputs: (string | undefined | null | false | 0)[]
): string {
	return inputs.filter(Boolean).join(' ');
}

/** Formatea moneda en GTQ (es-GT) */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('es-GT', {
		style: 'currency',
		currency: 'GTQ',
		minimumFractionDigits: 2,
	}).format(Math.abs(amount));
}

/** Formatea fecha en GTQ (es-GT) */
export function formatDate(date: Date | string): string {
	return new Intl.DateTimeFormat('es-GT', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date(date));
}

/**
 * Convierte una fecha a formato estándar YYYY-MM-DD para uso en APIs y backend
 */
export function formatToAPIDate(date: Date | string | null): string | null {
	if (!date) return null;
	return dayjs(date).format('YYYY-MM-DD');
}
