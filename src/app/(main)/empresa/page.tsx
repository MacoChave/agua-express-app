'use client';

import { useState, useEffect } from 'react';
import { Button, Card, DataTable, InputField } from '@/components/ui';
import type { Column } from '@/components/ui';
import AddCircle from '@/assets/icons/add_circle.svg';
import Edit from '@/assets/icons/edit.svg';
import { useToast } from '@/components/ui/Toast/ToastContext';

type Company = {
	id: number;
	name: string;
	tax_id: string;
	legal_name: string;
	currency: string;
};

type Warehouse = {
	id: number;
	name: string;
	address: string;
	is_active: boolean;
	created_at: string;
};

export default function EmpresaPage() {
	const [company, setCompany] = useState<Company | null>(null);
	const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
	const [loading, setLoading] = useState(true);
	// const [error, setError] = useState<string | null>(null);
	const [isSavingCompany, setIsSavingCompany] = useState(false);
	const { toast } = useToast();

	const [showBranchModal, setShowBranchModal] = useState(false);
	const [editingBranch, setEditingBranch] = useState<Warehouse | null>(null);
	const [isSavingBranch, setIsSavingBranch] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		try {
			const [companyRes, warehouseRes] = await Promise.all([
				fetch('/api/companies'),
				fetch('/api/warehouses'),
			]);

			if (!companyRes.ok) throw new Error('Error al cargar empresa');
			if (!warehouseRes.ok) throw new Error('Error al cargar sucursales');

			const companyData = await companyRes.json();
			const warehouseData = await warehouseRes.json();

			setCompany(companyData);
			setWarehouses(warehouseData || []);
		} catch (err: any) {
			toast({
				title: 'Error',
				type: 'error',
				message: err.message,
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleSaveCompany = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSavingCompany(true);
		const formData = new FormData(e.currentTarget);

		try {
			const res = await fetch('/api/companies', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.get('name'),
					legal_name: formData.get('legal_name'),
					tax_id: formData.get('tax_id'),
					currency: formData.get('currency'),
				}),
			});
			if (!res.ok)
				throw new Error('Error al guardar datos de la empresa');
			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Datos de la empresa guardados correctamente',
			});
			fetchData();
		} catch (err: any) {
			toast({
				title: 'Error',
				type: 'error',
				message: err.message,
			});
		} finally {
			setIsSavingCompany(false);
		}
	};

	const handleAddOrUpdateBranch = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setIsSavingBranch(true);
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
			setShowBranchModal(false);
			setEditingBranch(null);
			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Sucursal guardada correctamente',
			});
			fetchData();
		} catch (err: any) {
			toast({
				title: 'Error',
				type: 'error',
				message: err.message,
			});
		} finally {
			setIsSavingBranch(false);
		}
	};

	const handleToggleStatus = async (branch: Warehouse) => {
		try {
			const res = await fetch('/api/warehouses', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: branch.id,
					name: branch.name,
					address: branch.address,
					is_active: !(branch.is_active !== false),
				}),
			});
			if (!res.ok) throw new Error('Error al actualizar estado');
			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Estado de la sucursal actualizado correctamente',
			});
			fetchData();
		} catch (err: any) {
			toast({
				title: 'Error',
				type: 'error',
				message: err.message,
			});
		}
	};

	const columns: Column<Warehouse>[] = [
		{
			key: 'name',
			header: 'NOMBRE',
			render: (value) => (
				<span className='text-body-md font-medium'>
					{value as string}
				</span>
			),
		},
		{
			key: 'address',
			header: 'DIRECCIÓN',
		},
		{
			key: 'is_active',
			header: 'ESTADO',
			render: (value, row) => (
				<label className='relative inline-flex items-center cursor-pointer'>
					<input
						type='checkbox'
						className='sr-only peer'
						checked={value !== false}
						onChange={() => handleToggleStatus(row)}
					/>
					<div className="w-11 h-6 bg-[var(--color-surface-container-high)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
				</label>
			),
		},
		{
			key: 'created_at',
			header: 'FECHA REGISTRO',
			render: (value) => new Date(String(value)).toLocaleDateString(),
		},
		{
			key: 'acciones',
			header: 'ACCIONES',
			render: (_, row) => (
				<button
					onClick={() => {
						setEditingBranch(row);
						setShowBranchModal(true);
					}}
					className='p-2 rounded-full hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors'>
					<Edit className='w-5 h-5' />
				</button>
			),
		},
	];

	if (loading) {
		return (
			<div className='p-8 text-center text-on-surface-variant'>
				Cargando datos...
			</div>
		);
	}

	return (
		<div className='pt-8 px-8 md:px-8 max-w-7xl mx-auto space-y-6'>
			<section className='space-y-1'>
				<h1 className='text-headline-lg text-primary'>
					Configuración de Empresa
				</h1>
				<p className='text-body-md text-on-surface-variant'>
					Administra los datos de la empresa y gestiona las
					sucursales.
				</p>
			</section>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-1'>
					<Card
						variant='default'
						className='border border-surface-container'>
						<h3 className='text-headline-sm text-primary mb-6'>
							Datos de la Empresa
						</h3>
						<form
							onSubmit={handleSaveCompany}
							className='space-y-4'>
							<InputField
								id='name'
								name='name'
								label='Nombre Comercial'
								defaultValue={company?.name}
								required
							/>
							<InputField
								id='legal_name'
								name='legal_name'
								label='Razón Social'
								defaultValue={company?.legal_name}
								required
							/>
							<InputField
								id='tax_id'
								name='tax_id'
								label='NIT / RFC'
								defaultValue={company?.tax_id}
								required
							/>
							<InputField
								id='currency'
								name='currency'
								label='Moneda'
								defaultValue={company?.currency}
								required
							/>
							<Button
								type='submit'
								fullWidth
								loading={isSavingCompany}>
								Guardar Datos
							</Button>
						</form>
					</Card>
				</div>

				<div className='lg:col-span-2'>
					<Card
						variant='default'
						padding='none'
						className='border border-surface-container overflow-hidden h-full flex flex-col'>
						<div className='px-6 py-4 flex items-center justify-between border-b border-surface-container'>
							<h3 className='text-headline-sm text-primary'>
								Sucursales
							</h3>
							<Button
								onClick={() => {
									setEditingBranch(null);
									setShowBranchModal(true);
								}}
								className='rounded-xl'>
								<span>
									<AddCircle className='w-5 h-5' />
								</span>
								Nueva Sucursal
							</Button>
						</div>
						<div className='px-6 pb-6 pt-2 flex-grow'>
							<DataTable<Warehouse>
								columns={columns}
								data={warehouses}
								keyField='id'
								striped={false}
							/>
						</div>
					</Card>
				</div>
			</div>

			{showBranchModal && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50'>
					<Card className='w-full md:max-w-1/2 shadow-2xl animate-in fade-in zoom-in duration-200'>
						<h2 className='text-headline-sm text-primary mb-6'>
							{editingBranch
								? 'Editar Sucursal'
								: 'Nueva Sucursal'}
						</h2>
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
									onClick={() => {
										setShowBranchModal(false);
										setEditingBranch(null);
									}}>
									Cancelar
								</Button>
								<Button
									type='submit'
									fullWidth
									loading={isSavingBranch}>
									{editingBranch
										? 'Guardar Cambios'
										: 'Crear Sucursal'}
								</Button>
							</div>
						</form>
					</Card>
				</div>
			)}
		</div>
	);
}
