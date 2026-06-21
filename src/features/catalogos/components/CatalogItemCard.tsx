'use client';

import { CatalogItem } from '../types';
import MoreVert from '@/assets/icons/more_vert.svg';
import Edit from '@/assets/icons/edit.svg';
import Delete from '@/assets/icons/delete.svg';

interface CatalogItemCardProps {
	item: CatalogItem;
	onEdit: (item: CatalogItem) => void;
	onDelete: (item: CatalogItem) => void;
}

export function CatalogItemCard({
	item,
	onEdit,
	onDelete,
}: CatalogItemCardProps) {
	return (
		<div className='bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-card border border-transparent hover:border-[var(--color-primary-container)] transition-all group'>
			<div className='flex justify-between items-start mb-4'>
				<span className='bg-[var(--color-secondary-fixed)] text-[var(--color-on-secondary-fixed)] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase'>
					{item.categoryLabel}
				</span>
				<div className='relative'>
					<button className='p-1 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors'>
						<MoreVert className='w-5 h-5 text-[var(--color-outline)]' />
					</button>
				</div>
			</div>
			<h3 className='text-headline-sm font-bold text-[var(--color-primary)] mb-2'>
				{item.name}
			</h3>
			<p className='text-body-sm text-[var(--color-on-surface-variant)] line-clamp-2 mb-6'>
				{item.description || 'Sin descripción disponible.'}
			</p>
			<div className='flex items-center gap-4 border-t border-[var(--color-outline-variant)] pt-4 opacity-60 group-hover:opacity-100 transition-opacity'>
				<button
					onClick={() => onEdit(item)}
					className='flex items-center gap-1 text-label-md font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)]'>
					<Edit className='w-5 h-5' /> Editar
				</button>
				<button
					onClick={() => onDelete(item)}
					className='flex items-center gap-1 text-label-md font-medium text-[var(--color-outline)] hover:text-[var(--color-error)]'>
					<Delete className='w-5 h-5' /> Borrar
				</button>
			</div>
		</div>
	);
}
