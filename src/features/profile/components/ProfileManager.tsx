'use client';

import { useState, useEffect } from 'react';
import { Button, Card, InputField } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast/ToastContext';

export function ProfileManager() {
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [updateLoading, setUpdateLoading] = useState(false);

	useEffect(() => {
		async function fetchProfile() {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setEmail(user.email || '');
				const { data: profile } = await supabase
					.from('profiles')
					.select('full_name')
					.eq('id', user.id)
					.single();
				if (profile?.full_name) {
					const parts = profile.full_name.trim().split(/\s+/);
					setFirstName(parts[0] || '');
					setLastName(parts.slice(1).join(' ') || '');
				}
			}
		}
		fetchProfile();
	}, []);

	const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setUpdateLoading(true);

		try {
			const res = await fetch('/api/users/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ firstName, lastName, email }),
			});

			const data = await res.json();
			if (!res.ok)
				throw new Error(data.error || 'Error al actualizar el perfil');

			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Tu perfil ha sido actualizado correctamente.',
			});
		} catch (err: unknown) {
			toast({
				title: 'Error',
				type: 'error',
				message: err instanceof Error ? err.message : 'Error desconocido',
			});
		} finally {
			setUpdateLoading(false);
		}
	};

	const handleChangePassword = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (password !== confirmPassword) {
			toast({
				title: 'Error',
				type: 'error',
				message: 'Las contraseñas no coinciden',
			});
			setLoading(false);
			return;
		}

		try {
			const res = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
			});

			const data = await res.json();
			if (!res.ok)
				throw new Error(data.error || 'Error al cambiar contraseña');

			toast({
				title: 'Guardado',
				type: 'success',
				message: 'Tu contraseña ha sido actualizada correctamente.',
			});
			(e.target as HTMLFormElement).reset();
		} catch (err: unknown) {
			toast({
				title: 'Error',
				type: 'error',
				message: err instanceof Error ? err.message : 'Error desconocido',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='pt-8 pb-8 px-4 md:px-8 max-w-3xl mx-auto space-y-6'>
			<h1 className='text-headline-lg text-primary'>Mi Perfil</h1>

			<Card
				variant='default'
				padding='lg'
				className='border border-surface-container'>
				<h2 className='text-headline-sm text-primary mb-6'>
					Información Personal
				</h2>

				<form onSubmit={handleUpdateProfile} className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<InputField
							id='firstName'
							name='firstName'
							type='text'
							label='Nombre'
							placeholder='Tu nombre'
							value={firstName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
							required
						/>
						<InputField
							id='lastName'
							name='lastName'
							type='text'
							label='Apellido'
							placeholder='Tu apellido'
							value={lastName}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
							required
						/>
					</div>
					<InputField
						id='email'
						name='email'
						type='email'
						label='Correo electrónico'
						placeholder='tu@email.com'
						value={email}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
						required
					/>
					<div className='pt-4'>
						<Button type='submit' loading={updateLoading}>
							{updateLoading
								? 'Actualizando...'
								: 'Guardar Cambios'}
						</Button>
					</div>
				</form>
			</Card>

			<Card
				variant='default'
				padding='lg'
				className='border border-surface-container'>
				<h2 className='text-headline-sm text-primary mb-6'>
					Cambiar Contraseña
				</h2>

				<form onSubmit={handleChangePassword} className='space-y-4'>
					<InputField
						id='password'
						name='password'
						type='password'
						label='Nueva Contraseña'
						placeholder='Mínimo 8 caracteres'
						required
					/>
					<InputField
						id='confirmPassword'
						name='confirmPassword'
						type='password'
						label='Confirmar Nueva Contraseña'
						placeholder='Repite tu nueva contraseña'
						required
					/>
					<div className='pt-4'>
						<Button type='submit' loading={loading}>
							{loading ? 'Actualizando...' : 'Cambiar Contraseña'}
						</Button>
					</div>
				</form>
			</Card>
		</div>
	);
}
