'use client';
import { useState } from 'react';
import { Button, InputField } from '@/components/ui';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { Warehouse } from './EmpresaManager';

interface BranchFormProps {
    editingBranch: Warehouse | null;
    onClose: () => void;
    onSuccess: () => void;
}

export function BranchForm({ editingBranch, onClose, onSuccess }: BranchFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

	const handleAddOrUpdateBranch = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setIsSaving(true);
		const formData = new FormData(e.currentTarget);

		try {
			let res;
			if (editingBranch) {
				res = await fetch('/api/warehouses', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: editingBranch.id,
						name: formData.get('name'),
						address: formData.get('address'),
						is_active: editingBranch.is_active !== false,
					}),
				});
			} else {
				res = await fetch('/api/warehouses', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: formData.get('name'),
						address: formData.get('address'),
					}),
				});
			}
			if (!res.ok) throw new Error('Error al guardar sucursal');
			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Sucursal guardada correctamente',
			});
            onSuccess();
			onClose();
		} catch (err: any) {
			toast({
				title: 'Error',
				type: 'error',
				message: err.message,
			});
		} finally {
			setIsSaving(false);
		}
	};

    return (
        <form
            onSubmit={handleAddOrUpdateBranch}
            className='space-y-4'>
            <InputField
                id='branch_name'
                name='name'
                label='Nombre de la Sucursal'
                placeholder='Ej. Central, Norte, etc.'
                defaultValue={editingBranch?.name || ''}
                required
            />
            <div className='flex flex-col gap-1'>
                <label
                    className='text-label-md text-on-surface-variant'
                    htmlFor='branch_address'>
                    Dirección
                </label>
                <textarea
                    id='branch_address'
                    name='address'
                    className='w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-md px-3 py-2 min-h-[100px]'
                    placeholder='Dirección completa'
                    defaultValue={
                        editingBranch?.address || ''
                    }></textarea>
            </div>
            <div className='flex gap-3 pt-4'>
                <Button
                    type='button'
                    variant='ghost'
                    fullWidth
                    onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    type='submit'
                    fullWidth
                    loading={isSaving}>
                    {editingBranch
                        ? 'Guardar Cambios'
                        : 'Crear Sucursal'}
                </Button>
            </div>
        </form>
    );
}
