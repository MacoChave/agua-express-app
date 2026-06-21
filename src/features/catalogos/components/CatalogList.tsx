'use client';

import { CatalogItem, CatalogType, CATALOG_METADATA } from '../types';
import { CatalogItemCard } from './CatalogItemCard';
import { Button } from '@/components/ui';
import Add from '@/assets/icons/add.svg';

interface CatalogListProps {
	type: CatalogType;
	items: CatalogItem[];
	loading: boolean;
	onAdd: () => void;
	onEdit: (item: CatalogItem) => void;
	onDelete: (item: CatalogItem) => void;
}

export function CatalogList({
	type,
	items,
	loading,
	onAdd,
	onEdit,
	onDelete,
}: CatalogListProps) {
	const metadata = CATALOG_METADATA[type];

	return (
		<div className='space-y-8 animate-in fade-in duration-500'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h2 className='text-headline-md font-bold text-[var(--color-primary)]'>
						{metadata.title}
					</h2>
					<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
						{metadata.subtitle}
					</p>
				</div>
				<Button className='rounded-xl h-12 px-6' onClick={onAdd}>
					<Add className='w-5 h-5' />
					Añadir Nuevo
				</Button>
			</div>

			{/* Grid */}
			{loading ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className='h-48 bg-[var(--color-surface-container-low)] animate-pulse rounded-xl shadow-sm border border-[var(--color-outline-variant)]/20'
						/>
					))}
				</div>
			) : items.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{items.map((item) => (
						<CatalogItemCard
							key={item.id}
							item={item}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</div>
			) : (
				<div className='text-center py-20 bg-[var(--color-surface-container-low)] rounded-2xl border-2 border-dashed border-[var(--color-outline-variant)]'>
					<p className='text-body-lg text-[var(--color-on-surface-variant)]'>
						No se encontraron registros en este catálogo.
					</p>
					<Button
						variant='secondary'
						className='mt-4'
						onClick={onAdd}>
						Crear el primer {metadata.entityName}
					</Button>
				</div>
			)}
		</div>
	);
}
