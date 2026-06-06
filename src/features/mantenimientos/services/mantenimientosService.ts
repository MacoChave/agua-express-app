import type {
	MaintenanceTask,
	TaskStatus,
} from '@/features/mantenimientos/types';
import { TASKS } from '@/features/mantenimientos/types';

/**
 * Servicio de mantenimientos.
 * Reemplazar las implementaciones mock por llamadas reales a la API.
 */
export const mantenimientosService = {
	/** Obtener todas las tareas */
	getAll: async (): Promise<MaintenanceTask[]> => {
		// TODO: return apiClient.get('/mantenimientos')
		return Promise.resolve(TASKS);
	},

	/** Filtrar por estado */
	getByStatus: async (status: TaskStatus): Promise<MaintenanceTask[]> => {
		return Promise.resolve(TASKS.filter((t) => t.status === status));
	},

	/** Registrar un nuevo mantenimiento */
	create: async (
		data: Omit<MaintenanceTask, 'id'>,
	): Promise<MaintenanceTask> => {
		// TODO: return apiClient.post('/mantenimientos', data)
		const newTask: MaintenanceTask = {
			...data,
			id: Date.now(),
		};
		return Promise.resolve(newTask);
	},
};
