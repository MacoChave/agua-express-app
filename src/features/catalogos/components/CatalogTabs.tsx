'use client';

import { CatalogList } from './CatalogList';
import { CatalogItem } from '../types';

interface TabProps {
	items: CatalogItem[];
	loading: boolean;
	onAdd: () => void;
	onEdit: (item: CatalogItem) => void;
	onDelete: (item: CatalogItem) => void;
}

export function GastoTab(props: TabProps) {
	return <CatalogList type='gasto' {...props} />;
}

export function EquipoTab(props: TabProps) {
	return <CatalogList type='equipos' {...props} />;
}

export function MantenimientoTab(props: TabProps) {
	return <CatalogList type='mantenimiento' {...props} />;
}
