import type { Transaction } from '@/features/reportes/types';
import { TRANSACTIONS } from '@/features/reportes/types';

/**
 * Servicio de reportes.
 * Reemplazar las implementaciones mock por llamadas reales a la API.
 */
export const reportesService = {
	/** Obtener transacciones del período actual */
	getTransactions: async (): Promise<Transaction[]> => {
		// TODO: return apiClient.get('/reportes/transacciones')
		return Promise.resolve(TRANSACTIONS);
	},

	/** Obtener resumen financiero */
	getSummary: async () => {
		// TODO: return apiClient.get('/reportes/resumen')
		const ingresos = TRANSACTIONS.filter((t) => t.amount > 0).reduce(
			(sum, t) => sum + t.amount,
			0,
		);
		const egresos = TRANSACTIONS.filter((t) => t.amount < 0).reduce(
			(sum, t) => sum + Math.abs(t.amount),
			0,
		);
		return Promise.resolve({ ingresos, egresos, neto: ingresos - egresos });
	},
};
