import { apiClient } from '@/lib/apiClient';
import {
	Equipment,
	ExpenseType,
	MaintenanceType,
	Warehouse,
} from '@/types/database';
import { CatalogItem, CatalogType, CatalogFormData } from '../types';

export const catalogService = {
	async getWarehouses(): Promise<Warehouse[]> {
		return await apiClient.get<Warehouse[]>('/warehouses');
	},

	async getItems(type: CatalogType): Promise<CatalogItem[]> {
		switch (type) {
			case 'gasto': {
				const data =
					await apiClient.get<ExpenseType[]>('/expense-types');
				return data.map(
					(item: ExpenseType): CatalogItem => ({
						id: item.expense_type,
						name: item.name,
						description: item.description,
						categoryLabel: `Bodega ${item.warehouse_id}`,
						originalData: item as unknown as Record<
							string,
							unknown
						>,
					}),
				);
			}
			case 'equipos': {
				const data = await apiClient.get<Equipment[]>('/equipment');
				return data.map(
					(item: Equipment): CatalogItem => ({
						id: item.id,
						name: item.name,
						description: item.description,
						categoryLabel: `Bodega ${item.warehouse_id}`,
						originalData: item as unknown as Record<
							string,
							unknown
						>,
					}),
				);
			}
			case 'mantenimiento': {
				const data =
					await apiClient.get<MaintenanceType[]>(
						'/maintenance-types',
					);
				return data.map(
					(item: MaintenanceType): CatalogItem => ({
						id: item.id,
						name: item.name,
						description: item.description,
						categoryLabel: `Bodega ${item.warehouse_id}`,
						originalData: item as unknown as Record<
							string,
							unknown
						>,
					}),
				);
			}
			default:
				return [];
		}
	},

	async deleteItem(type: CatalogType, id: string | number): Promise<void> {
		const endpoint =
			type === 'gasto'
				? '/expense-types'
				: type === 'equipos'
					? '/equipment'
					: '/maintenance-types';
		await apiClient.delete(`${endpoint}/${id}`);
	},

	async createItem(
		type: CatalogType,
		data: CatalogFormData,
	): Promise<unknown> {
		const endpoint =
			type === 'gasto'
				? '/expense-types'
				: type === 'equipos'
					? '/equipment'
					: '/maintenance-types';
		return apiClient.post(endpoint, data);
	},

	async updateItem(
		type: CatalogType,
		id: string | number,
		data: CatalogFormData,
	): Promise<unknown> {
		const endpoint =
			type === 'gasto'
				? '/expense-types'
				: type === 'equipos'
					? '/equipment'
					: '/maintenance-types';
		return apiClient.patch(`${endpoint}/${id}`, data);
	},
};
