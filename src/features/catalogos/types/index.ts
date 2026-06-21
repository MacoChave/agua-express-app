import { Equipment, ExpenseType, MaintenanceType } from '@/types/database';

export type CatalogType = 'gasto' | 'equipos' | 'mantenimiento';

export interface CatalogItem {
	id: string | number;
	name: string;
	description?: string;
	categoryLabel?: string; // e.g., Warehouse name or code
	originalData: any;
}

export interface CatalogMetadata {
	title: string;
	subtitle: string;
	entityName: string;
}

export const CATALOG_METADATA: Record<CatalogType, CatalogMetadata> = {
	gasto: {
		title: 'Tipos de Gasto',
		subtitle: 'Gestione las categorías financieras del sistema.',
		entityName: 'Tipo de Gasto',
	},
	equipos: {
		title: 'Equipos',
		subtitle: 'Inventario de maquinaria y herramientas activas.',
		entityName: 'Equipo',
	},
	mantenimiento: {
		title: 'Tipos de Mantenimiento',
		subtitle: 'Clasificación de protocolos de servicio técnico.',
		entityName: 'Tipo de Mantenimiento',
	},
};
