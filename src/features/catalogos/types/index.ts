export type CatalogType = 'gasto' | 'equipos' | 'mantenimiento';

export interface CatalogFormData {
	name: string;
	description?: string;
	warehouse_id?: number | string;
	company_id?: number;
	expense_type?: string;
}

export interface CatalogItem {
	id: string | number;
	name: string;
	description?: string;
	categoryLabel?: string; // e.g., Warehouse name or code
	originalData: Record<string, unknown>;
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
