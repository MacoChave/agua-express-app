'use client';

import { useState, useEffect } from 'react';
import {
	Button,
	Card,
	DataTable,
	InputField,
	StatusChip,
	Modal,
} from '@/components/ui';
import type { Column } from '@/components/ui';
import AddCircle from '@/assets/icons/add_circle.svg';
import Search from '@/assets/icons/search.svg';
import Edit from '@/assets/icons/edit.svg';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast/ToastContext';

type UserProfile = {
	id: string;
	full_name: string;
	email: string;
	role: 'admin' | 'operator' | 'supervisor';
	created_at: string;
	is_active?: boolean;
	warehouse_id?: number;
};

type Warehouse = {
	id: number;
	name: string;
};

const getColumns = (
	currentUserId: string | null,
	onEdit: (user: UserProfile) => void,
	onToggleStatus: (user: UserProfile) => void,
): Column<UserProfile>[] => [
	{
		key: 'full_name',
		header: 'NOMBRE COMPLETO',
		render: (value, row) => (
			<div className='flex flex-col'>
				<span className='text-body-md font-semibold'>
					{value as string}
				</span>
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
		key: 'is_active',
		header: 'ESTADO',
		render: (value, row) => (
			<label className='relative inline-flex items-center cursor-pointer'>
				<input
					type='checkbox'
					className='sr-only peer'
					checked={value !== false}
					onChange={() => onToggleStatus(row)}
					disabled={row.id === currentUserId}
				/>
				<div className="w-11 h-6 bg-[var(--color-surface-container-high)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] opacity-100 disabled:opacity-50"></div>
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
		render: (_, row) =>
			row.id !== currentUserId ? (
				<button
					onClick={() => onEdit(row)}
					className='p-2 rounded-full hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors'>
					<Edit className='w-5 h-5' />
				</button>
			) : (
				<span className='text-body-sm text-[var(--color-on-surface-variant)] italic'>
					Tú
				</span>
			),
	},
];

export default function UsersPage() {
	const { toast } = useToast();
	const [users, setUsers] = useState<UserProfile[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const limit = 10;

	const [branches, setBranches] = useState<Warehouse[]>([]);

	useEffect(() => {
		const supabase = createClient();
		supabase.auth
			.getUser()
			.then(({ data: { user } }) => setCurrentUserId(user?.id || null));

		fetch('/api/warehouses')
			.then((res) => res.json())
			.then((data) => setBranches(data || []))
			.catch((err) => console.error('Error fetching branches:', err));
	}, []);

	useEffect(() => {
		const delay = setTimeout(() => {
			setSearchQuery(searchTerm);
			setPage(1);
		}, 500);
		return () => clearTimeout(delay);
	}, [searchTerm]);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/users?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
			);
			if (!res.ok) throw new Error('Error al obtener usuarios');
			const data = await res.json();
			setUsers(data.users || []);
			setTotalPages(Math.ceil((data.count || 0) / limit));
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
		fetchUsers();
	}, [page, searchQuery]);

	const handleAddOrUpdateUser = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setIsSaving(true);
		setError(null);

		const formData = new FormData(e.currentTarget);

		try {
			let res;
			if (editingUser) {
				res = await fetch('/api/users', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: editingUser.id,
						fullName: formData.get('fullName'),
						role: formData.get('role'),
						isActive: editingUser.is_active !== false,
						warehouseId: formData.get('warehouseId'),
					}),
				});
			} else {
				res = await fetch('/api/users', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: formData.get('email'),
						password: formData.get('password'),
						fullName: formData.get('fullName'),
						role: formData.get('role'),
						warehouseId: formData.get('warehouseId'),
					}),
				});
			}

			const data = await res.json();
			if (!res.ok)
				throw new Error(data.error || 'Error al guardar usuario');

			setShowAddModal(false);
			setEditingUser(null);
			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Usuario guardado correctamente',
			});
			fetchUsers();
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

	const handleToggleStatus = async (user: UserProfile) => {
		try {
			const res = await fetch('/api/users', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: user.id,
					fullName: user.full_name,
					role: user.role,
					isActive: !(user.is_active !== false),
				}),
			});
			if (!res.ok) throw new Error('Error al actualizar estado');
			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Estado del usuario actualizado correctamente',
			});
			fetchUsers();
		} catch (err: any) {
			toast({
				title: 'Error',
				type: 'error',
				message: err.message,
			});
		}
	};

	const columns = getColumns(
		currentUserId,
		(user) => {
			setEditingUser(user);
			setShowAddModal(true);
		},
		handleToggleStatus,
	);

	return (
		<div className='pt-8 px-8 md:px-8 max-w-7xl mx-auto space-y-6'>
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
					onClick={() => {
						setEditingUser(null);
						setShowAddModal(true);
					}}
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
							value={searchTerm}
							onChange={(e: any) => setSearchTerm(e.target.value)}
							prefixIcon={<Search className='w-5 h-5' />}
						/>
					</div>
				</div>
				<div className='px-6 pb-6 pt-2'>
					{loading ? (
						<div className='py-20 text-center text-on-surface-variant'>
							Cargando usuarios...
						</div>
					) : (
						<>
							<DataTable<UserProfile>
								columns={columns}
								data={users}
								keyField='id'
								striped={false}
							/>
							{/* Pagination Controls */}
							{totalPages > 1 && (
								<div className='flex justify-between items-center mt-4 border-t border-[var(--color-outline-variant)] pt-4'>
									<p className='text-body-sm text-[var(--color-on-surface-variant)]'>
										Mostrando {(page - 1) * limit + 1} a{' '}
										{Math.min(
											page * limit,
											(page - 1) * limit + users.length,
										)}
									</p>
									<div className='flex gap-2'>
										<button
											disabled={page === 1}
											onClick={() => setPage(page - 1)}
											className='px-3 py-1 text-label-md font-medium border border-[var(--color-outline-variant)] rounded-md hover:bg-[var(--color-surface-container)] disabled:opacity-50'>
											Anterior
										</button>
										<span className='px-3 py-1 text-label-md font-medium'>
											{page} de {totalPages}
										</span>
										<button
											disabled={page === totalPages}
											onClick={() => setPage(page + 1)}
											className='px-3 py-1 text-label-md font-medium border border-[var(--color-outline-variant)] rounded-md hover:bg-[var(--color-surface-container)] disabled:opacity-50'>
											Siguiente
										</button>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</Card>

			{/* Modal de Nuevo Usuario */}
			<Modal
				isOpen={showAddModal}
				onClose={() => {
					setShowAddModal(false);
					setEditingUser(null);
				}}
				title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
				maxWidth='6/12'>
						<form
							onSubmit={handleAddOrUpdateUser}
							className='space-y-4'>
							<InputField
								id='fullName'
								name='fullName'
								label='Nombre Completo'
								placeholder='Ej. Pedro Picapiedra'
								defaultValue={editingUser?.full_name || ''}
								required
							/>
							{!editingUser && (
								<>
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
								</>
							)}
							<div className='flex flex-col gap-1'>
								<label className='text-label-md text-on-surface-variant'>
									Rol del Usuario
								</label>
								<select
									name='role'
									className='w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-md px-3 py-2'
									defaultValue={
										editingUser?.role || 'operator'
									}>
									<option value='operator'>Operador</option>
									<option value='supervisor'>
										Supervisor
									</option>
									<option value='admin'>Administrador</option>
								</select>
							</div>

							<div className='flex flex-col gap-1'>
								<label className='text-label-md text-on-surface-variant'>
									Sucursal Asignada
								</label>
								<select
									name='warehouseId'
									className='w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-md px-3 py-2'
									defaultValue={
										editingUser?.warehouse_id || ''
									}>
									<option value='' disabled>
										-- Selecciona una sucursal --
									</option>
									{branches.map((branch) => (
										<option
											key={branch.id}
											value={branch.id}>
											{branch.name}
										</option>
									))}
								</select>
							</div>

							<div className='flex gap-3 pt-4'>
								<Button
									type='button'
									variant='ghost'
									fullWidth
									onClick={() => {
										setShowAddModal(false);
										setEditingUser(null);
									}}>
									Cancelar
								</Button>
								<Button
									type='submit'
									fullWidth
									loading={isSaving}>
									{editingUser
										? 'Guardar Cambios'
										: 'Crear Usuario'}
								</Button>
							</div>
						</form>
			</Modal>
		</div>
	);
}
