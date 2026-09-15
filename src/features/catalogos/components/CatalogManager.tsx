'use client';

import { useState, useEffect } from 'react';
import {
	CatalogType,
	CATALOG_METADATA,
	CatalogItem,
	CatalogFormData,
} from '../types';
import { catalogService } from '../services/catalogService';
import { CatalogForm } from './CatalogForm';
import { GastoTab, EquipoTab, MantenimientoTab } from './CatalogTabs';
import { Modal } from '@/components/ui';
import { useToast } from '@/components/ui/Toast/ToastContext';

export function CatalogManager() {
	const [activeTab, setActiveTab] = useState<CatalogType>('gasto');
	const [items, setItems] = useState<CatalogItem[]>([]);
	const [loading, setLoading] = useState(true);

	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		loadItems();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	async function loadItems() {
		setLoading(true);
		try {
			const data = await catalogService.getItems(activeTab);
			setItems(data);
		} catch (error: any) {
			console.error('Error loading catalog items:', error);
			toast({
				title: 'Error',
				type: 'error',
				message: error.message || 'Error al cargar los catálogos',
			});
		} finally {
			setLoading(false);
		}
	}

	const handleAdd = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const handleEdit = (item: CatalogItem) => {
		setEditingItem(item);
		setIsModalOpen(true);
	};

	const handleDelete = async (item: CatalogItem) => {
		if (confirm(`¿Está seguro de eliminar "${item.name}"?`)) {
			try {
				await catalogService.deleteItem(activeTab, item.id);
				setItems((prev) => prev.filter((i) => i.id !== item.id));
				toast({
					title: 'Eliminado',
					type: 'success',
					message: 'Elemento eliminado correctamente',
				});
			} catch (error: any) {
				console.error('Error deleting item:', error);
				toast({
					title: 'Error',
					type: 'error',
					message: error.message || 'Error al eliminar el elemento',
				});
			}
		}
	};

	const handleSubmit = async (formData: CatalogFormData) => {
		try {
			if (editingItem) {
				await catalogService.updateItem(
					activeTab,
					editingItem.id,
					formData,
				);
			} else {
				await catalogService.createItem(activeTab, formData);
			}
			setIsModalOpen(false);
			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Elemento guardado correctamente',
			});
			loadItems();
		} catch (error: any) {
			console.error('Error saving item:', error);
			toast({
				title: 'Error',
				type: 'error',
				message: error.message || 'Error al guardar el elemento',
			});
		}
	};

	const metadata = CATALOG_METADATA[activeTab];

	const commonProps = {
		items,
		loading,
		onAdd: handleAdd,
		onEdit: handleEdit,
		onDelete: handleDelete,
	};

	return (
		<div className='pb-24'>
			<main className='pt-8 px-8 md:px-12 max-w-7xl mx-auto'>
				{/* Tab Switcher */}
				<div className='flex overflow-x-auto overflow-y-hidden gap-6 border-b border-[var(--color-outline-variant)] mb-8 sticky top-16 bg-[var(--color-background)]/80 backdrop-blur-md z-40'>
					{(Object.keys(CATALOG_METADATA) as CatalogType[]).map(
						(tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`py-4 px-2 whitespace-nowrap text-label-md font-medium transition-all relative ${
									activeTab === tab
										? 'text-[var(--color-primary)]'
										: 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)]'
								}`}>
								{CATALOG_METADATA[tab].title}
								{activeTab === tab && (
									<div className='absolute bottom-[-2px] left-0 right-0 h-[3px] bg-[var(--color-primary)] rounded-full' />
								)}
							</button>
						),
					)}
				</div>

				{/* Content based on Tab */}
				{activeTab === 'gasto' && <GastoTab {...commonProps} />}
				{activeTab === 'equipos' && <EquipoTab {...commonProps} />}
				{activeTab === 'mantenimiento' && (
					<MantenimientoTab {...commonProps} />
				)}
			</main>

			{/* Modal Form */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={`${editingItem ? 'Editar' : 'Añadir'} ${metadata.entityName}`}
				maxWidth='md'>
				<CatalogForm
					entityName={metadata.entityName}
					initialData={
						editingItem
							? (editingItem.originalData as unknown as Partial<CatalogFormData>)
							: undefined
					}
					isEditing={!!editingItem}
					onSubmit={handleSubmit}
					onCancel={() => setIsModalOpen(false)}
				/>
			</Modal>
		</div>
	);
}
