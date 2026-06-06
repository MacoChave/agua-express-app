import type { Pedido, EstadoPedido } from '@/features/pedidos/types';
import { PEDIDOS_MOCK } from '@/features/pedidos/types';

/**
 * Servicio de pedidos.
 * Reemplazar las implementaciones mock por llamadas reales a la API.
 */
export const pedidosService = {
	/** Obtener todos los pedidos */
	getAll: async (): Promise<Pedido[]> => {
		// TODO: return apiClient.get('/pedidos')
		return Promise.resolve(PEDIDOS_MOCK);
	},

	/** Obtener pedidos filtrados por estado */
	getByEstado: async (estado: EstadoPedido): Promise<Pedido[]> => {
		return Promise.resolve(PEDIDOS_MOCK.filter((p) => p.estado === estado));
	},

	/** Crear un nuevo pedido */
	create: async (data: Omit<Pedido, 'id'>): Promise<Pedido> => {
		// TODO: return apiClient.post('/pedidos', data)
		const newPedido: Pedido = {
			...data,
			id: `ORD-${Date.now()}`,
		};
		return Promise.resolve(newPedido);
	},

	/** Actualizar estado de un pedido */
	updateEstado: async (id: string, estado: EstadoPedido): Promise<Pedido> => {
		// TODO: return apiClient.patch(`/pedidos/${id}`, { estado })
		const pedido = PEDIDOS_MOCK.find((p) => p.id === id);
		if (!pedido) throw new Error(`Pedido ${id} no encontrado`);
		return Promise.resolve({ ...pedido, estado });
	},
};
