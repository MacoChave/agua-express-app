'use client';

import { useState, useEffect } from 'react';
import {
	Button,
	Card,
	DataTable,
	InputField,
	StatusChip,
} from '@/components/ui';
import type { Column } from '@/components/ui';
import AddCircle from '@/assets/icons/add_circle.svg';
import Search from '@/assets/icons/search.svg';

type UserProfile = {
	id: string;
	full_name: string;
	email: string;
	role: 'admin' | 'operator' | 'supervisor';
	created_at: string;
};

const columns: Column<UserProfile>[] = [
	{
		key: 'full_name',
		header: 'NOMBRE COMPLETO',
		render: (value, row) => (
			<div className='flex flex-col'>
				<span className='text-body-md font-semibold'>{value}</span>
				<span className='text-label-md text-on-surface-variant'>
					{row.email}
				</span>
			</div>
		),
	},
	{
		key: 'role',
		header: 'ROL',
		render: (value) => (
			<StatusChip
				status={
					value === 'admin'
						? 'operational'
						: value === 'supervisor'
							? 'info'
							: 'pending'
				}
				label={String(value).toUpperCase()}
			/>
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
		render: () => (
			<button className='px-2 py-1 rounded hover:bg-surface-container'>
				⋮
			</button>
		),
	},
];

export default function UsersPage() {
	const [users, setUsers] = useState<UserProfile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/users');
			if (!res.ok) throw new Error('Error al obtener usuarios');
			const data = await res.json();
			setUsers(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSaving(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const payload = {
			email: formData.get('email'),
			password: formData.get('password'),
			fullName: formData.get('fullName'),
			role: formData.get('role'),
		};

		try {
			const res = await fetch('/api/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await res.json();
			if (!res.ok)
				throw new Error(data.error || 'Error al crear usuario');

			setShowAddModal(false);
			fetchUsers();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='pt-8 px-4 md:px-8 max-w-7xl mx-auto space-y-6'>
			<section className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
				<div className='space-y-1'>
					<h1 className='text-headline-lg text-primary'>
						Gestión de Usuarios
					</h1>
					<p className='text-body-md text-on-surface-variant'>
						Administra los accesos y roles de tu equipo.
					</p>
				</div>
				<Button
					onClick={() => setShowAddModal(true)}
					className='rounded-xl'>
					<span>
						<AddCircle className='w-5 h-5' />
					</span>
					Nuevo Usuario
				</Button>
			</section>

			{error && (
				<div className='p-4 rounded-lg bg-error-container text-on-error-container text-body-sm'>
					{error}
				</div>
			)}

			<Card
				variant='default'
				padding='none'
				className='border border-surface-container overflow-hidden'>
				<div className='px-6 py-4 flex items-center justify-between border-b border-surface-container'>
					<h3 className='text-headline-sm text-primary'>
						Usuarios Registrados
					</h3>
					<div className='w-64'>
						<InputField
							id='search'
							name='search'
							placeholder='Buscar por nombre...'
							leadingIcon={<Search className='w-5 h-5' />}
						/>
					</div>
				</div>
				<div className='px-6 pb-6 pt-2'>
					{loading ? (
						<div className='py-20 text-center text-on-surface-variant'>
							Cargando usuarios...
						</div>
					) : (
						<DataTable<UserProfile>
							columns={columns}
							data={users}
							keyField='id'
							striped={false}
						/>
					)}
				</div>
			</Card>

			{/* Modal de Nuevo Usuario (Simulado con overlay fijo) */}
			{showAddModal && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50'>
					<Card className='w-full md:max-w-6/12 shadow-2xl animate-in fade-in zoom-in duration-200'>
						<h2 className='text-headline-sm text-primary mb-6'>
							Crear Nuevo Usuario
						</h2>
						<form onSubmit={handleAddUser} className='space-y-4'>
							<InputField
								id='fullName'
								name='fullName'
								label='Nombre Completo'
								placeholder='Ej. Pedro Picapiedra'
								required
							/>
							<InputField
								id='email'
								name='email'
								type='email'
								label='Correo Electrónico'
								placeholder='pedro@aguaexpress.com'
								required
							/>
							<InputField
								id='password'
								name='password'
								type='password'
								label='Contraseña Temporal'
								placeholder='••••••••'
								required
							/>
							<div className='flex flex-col gap-1'>
								<label className='text-label-md text-on-surface-variant'>
									Rol del Usuario
								</label>
								<select
									name='role'
									className='w-full bg-surface-container-low text-on-surface border border-outline-variant rounded-md px-3 py-2'
									defaultValue='operator'>
									<option value='operator'>Operador</option>
									<option value='supervisor'>
										Supervisor
									</option>
									<option value='admin'>Administrador</option>
								</select>
							</div>

							<div className='flex gap-3 pt-4'>
								<Button
									type='button'
									variant='ghost'
									fullWidth
									onClick={() => setShowAddModal(false)}>
									Cancelar
								</Button>
								<Button
									type='submit'
									fullWidth
									loading={isSaving}>
									Crear Usuario
								</Button>
							</div>
						</form>
					</Card>
				</div>
			)}
		</div>
	);
}
