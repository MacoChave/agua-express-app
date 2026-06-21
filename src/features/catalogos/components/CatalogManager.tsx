'use client';

import { useState, useEffect } from 'react';
import { CatalogType, CATALOG_METADATA, CatalogItem } from '../types';
import { catalogService } from '../services/catalogService';
import { CatalogForm } from './CatalogForm';
import { CatalogModal } from './CatalogModal';
import { GastoTab, EquipoTab, MantenimientoTab } from './CatalogTabs';

export function CatalogManager() {
	const [activeTab, setActiveTab] = useState<CatalogType>('gasto');
	const [items, setItems] = useState<CatalogItem[]>([]);
	const [loading, setLoading] = useState(true);

	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

	useEffect(() => {
		loadItems();
	}, [activeTab]);

	async function loadItems() {
		setLoading(true);
		try {
			const data = await catalogService.getItems(activeTab);
			setItems(data);
		} catch (error) {
			console.error('Error loading catalog items:', error);
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
			} catch (error) {
				console.error('Error deleting item:', error);
			}
		}
	};

	const handleSubmit = async (formData: any) => {
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
			loadItems();
		} catch (error) {
			console.error('Error saving item:', error);
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
			<main className='pt-20 px-4 md:px-12 max-w-7xl mx-auto'>
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
			<CatalogModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={`${editingItem ? 'Editar' : 'Añadir'} ${metadata.entityName}`}>
				<CatalogForm
					entityName={metadata.entityName}
					initialData={editingItem ? editingItem.originalData : null}
					isEditing={!!editingItem}
					onSubmit={handleSubmit}
					onCancel={() => setIsModalOpen(false)}
				/>
			</CatalogModal>
		</div>
	);
}
