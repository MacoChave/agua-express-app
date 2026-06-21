'use client';

import { useState, useEffect } from 'react';
import { Button, InputField } from '@/components/ui';
import { catalogService } from '../services/catalogService';
import { Warehouse } from '@/types/database';

interface CatalogFormProps {
	initialData?: any;
	onSubmit: (data: any) => Promise<void>;
	onCancel: () => void;
	entityName: string;
	isEditing?: boolean;
}

export function CatalogForm({
	initialData,
	onSubmit,
	onCancel,
	entityName,
	isEditing,
}: CatalogFormProps) {
	const [name, setName] = useState(initialData?.name || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const [warehouseId, setWarehouseId] = useState(initialData?.warehouse_id || '');
	const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function loadWarehouses() {
			try {
				const data = await catalogService.getWarehouses();
				setWarehouses(data);
				if (!warehouseId && data.length > 0) {
					setWarehouseId(data[0].id);
				}
			} catch (error) {
				console.error('Error loading warehouses:', error);
			}
		}
		loadWarehouses();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit({
				name,
				description,
				warehouse_id: Number(warehouseId),
				company_id: 1, // Mocked for now
				...(initialData?.expense_type && { expense_type: initialData.expense_type }),
			});
		} catch (error) {
			console.error('Error submitting form:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-6 p-1'>
			<InputField
				label={`Nombre del ${entityName}`}
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				placeholder={`Ej: ${entityName} A`}
			/>

			<div className='space-y-1'>
				<label className='text-label-md font-medium text-[var(--color-on-surface-variant)] uppercase tracking-wide'>
					Bodega / Sucursal
				</label>
				<select
					className='w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-[var(--radius-md)] px-3 py-2 text-body-md focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 outline-none transition-all'
					value={warehouseId}
					onChange={(e) => setWarehouseId(e.target.value)}
					required>
					{warehouses.map((w) => (
						<option key={w.id} value={w.id}>
							{w.name}
						</option>
					))}
				</select>
			</div>

			<InputField
				as='textarea'
				label='Descripción'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				rows={3}
				placeholder='Detalle breve de este registro...'
			/>

			<div className='flex gap-4 pt-4'>
				<Button
					type='button'
					variant='ghost'
					className='flex-1'
					onClick={onCancel}>
					Cancelar
				</Button>
				<Button type='submit' className='flex-1' loading={loading}>
					{isEditing ? 'Guardar Cambios' : 'Crear Registro'}
				</Button>
			</div>
		</form>
	);
}
