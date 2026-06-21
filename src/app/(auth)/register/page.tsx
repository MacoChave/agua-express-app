'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, InputField, StatusChip } from '@/components/ui';
import WaterDrop from '@/assets/icons/water_drop.svg';

export default function RegisterPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const companyName = formData.get('company');
		const warehouseName = formData.get('warehouseName');
		const nit = formData.get('nit') || 'CF'; // Default NIT
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (password !== confirmPassword) {
			setError('Las contraseñas no coinciden');
			setLoading(false);
			return;
		}

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					password,
					firstName,
					lastName,
					companyName,
					warehouseName: warehouseName
						? warehouseName
						: `${companyName} Central`,
					nit,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(
					data.error || 'Ocurrió un error al crear la cuenta',
				);
			}

			// Iniciar sesión automáticamente después del registro
			await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			router.push('/dashboard');
			router.refresh();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main
			className='min-h-screen flex items-center justify-center px-4 py-10'
			style={{
				background:
					'linear-gradient(180deg, var(--color-surface-container-low) 0%, var(--color-background) 55%)',
			}}>
			<Card
				variant='default'
				padding='none'
				className='w-full md:max-w-6/12 rounded-lg overflow-hidden'>
				<div
					className='px-8 py-8 border-b'
					style={{
						background:
							'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
						borderColor: 'rgba(255,255,255,0.15)',
					}}>
					<div className='flex items-center justify-between gap-3'>
						<Link
							href='/'
							className='text-headline-sm font-semibold'
							style={{ color: 'var(--color-on-primary)' }}>
							<WaterDrop className='inline-block w-6 h-6 mr-2' />
							AquaFlow Manager
						</Link>
						<StatusChip
							status='operational'
							label='Prueba gratis'
							className='bg-white/20 text-white'
						/>
					</div>
					<h1
						className='text-headline-lg mt-6'
						style={{ color: 'var(--color-on-primary)' }}>
						Crea tu cuenta
					</h1>
					<p
						className='text-body-sm mt-2'
						style={{ color: 'var(--color-primary-fixed-dim)' }}>
						Comienza a gestionar tu purificadora con control total
						de pedidos y mantenimientos.
					</p>
				</div>

				<div className='px-8 py-8'>
					{error && (
						<div className='mb-6 p-4 rounded-lg bg-error-container text-on-error-container text-body-sm'>
							{error}
						</div>
					)}
					<form className='space-y-5' onSubmit={handleSubmit}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<InputField
								id='firstName'
								name='firstName'
								type='text'
								label='Nombre'
								placeholder='Juan'
								required
							/>
							<InputField
								id='lastName'
								name='lastName'
								type='text'
								label='Apellido'
								placeholder='Pérez'
								required
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<InputField
								id='company'
								name='company'
								type='text'
								label='Empresa'
								placeholder='Agua Pura del Norte'
								required
							/>

							<InputField
								id='warehouse'
								name='warehouse'
								type='text'
								label='Almacén'
								placeholder='Almacén Principal'
								hint='Deja en blanco para usar el nombre por defecto'
							/>

							<InputField
								id='nit'
								name='nit'
								type='text'
								label='NIT'
								placeholder='CF'
								hint='Deja en blanco si no tienes NIT'
							/>

							<InputField
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								label='Correo electrónico'
								placeholder='tu@empresa.com'
								required
							/>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<InputField
								id='password'
								name='password'
								type='password'
								autoComplete='new-password'
								label='Contraseña'
								placeholder='Mínimo 8 caracteres'
								hint='Usa mayúsculas, minúsculas y números'
								required
							/>

							<InputField
								id='confirmPassword'
								name='confirmPassword'
								type='password'
								autoComplete='new-password'
								label='Confirmar contraseña'
								placeholder='Repite tu contraseña'
								required
							/>
						</div>

						<label className='inline-flex items-start gap-2 cursor-pointer select-none'>
							<input
								id='terms'
								name='terms'
								type='checkbox'
								required
								className='h-4 w-4 mt-0.5 rounded-sm border'
								style={{
									borderColor: 'var(--color-outline-variant)',
									accentColor: 'var(--color-primary)',
								}}
							/>
							<span
								className='text-body-sm'
								style={{
									color: 'var(--color-on-surface-variant)',
								}}>
								Acepto los{' '}
								<Link
									href='#'
									className='hover:underline'
									style={{ color: 'var(--color-primary)' }}>
									términos y condiciones
								</Link>{' '}
								y la{' '}
								<Link
									href='#'
									className='hover:underline'
									style={{ color: 'var(--color-primary)' }}>
									política de privacidad
								</Link>
								.
							</span>
						</label>

						<Button type='submit' fullWidth loading={loading}>
							{loading
								? 'Creando cuenta...'
								: 'Crear cuenta gratis'}
						</Button>
					</form>

					<div className='mt-6 flex items-center justify-center gap-1 text-body-sm'>
						<span
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							¿Ya tienes cuenta?
						</span>
						<Link
							href='/login'
							className='font-medium hover:underline'
							style={{ color: 'var(--color-primary)' }}>
							Iniciar sesión
						</Link>
					</div>
				</div>
			</Card>
		</main>
	);
}
