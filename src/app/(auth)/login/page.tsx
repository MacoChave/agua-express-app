'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, InputField, StatusChip } from '@/components/ui';

export default function LoginPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email');
		const password = formData.get('password');

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			console.log({ data });

			if (!res.ok) {
				throw new Error(
					data.error || 'Ocurrió un error al iniciar sesión',
				);
			}

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
				className='w-full max-w-6/12 rounded-lg overflow-hidden'>
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
							💧 AguaExpress
						</Link>
						<StatusChip
							status='operational'
							label='Seguro'
							className='bg-white/20 text-white'
						/>
					</div>
					<h1
						className='text-headline-lg mt-6'
						style={{ color: 'var(--color-on-primary)' }}>
						Bienvenido de nuevo
					</h1>
					<p
						className='text-body-sm mt-2'
						style={{ color: 'var(--color-primary-fixed-dim)' }}>
						Inicia sesión para continuar con la gestión de tu
						purificadora.
					</p>
				</div>

				<div className='px-8 py-8'>
					{error && (
						<div className='mb-6 p-4 rounded-lg bg-error-container text-on-error-container text-body-sm'>
							{error}
						</div>
					)}
					<form className='space-y-5' onSubmit={handleSubmit}>
						<InputField
							id='email'
							name='email'
							type='email'
							autoComplete='email'
							label='Correo electrónico'
							placeholder='tu@empresa.com'
							required
						/>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<label
									htmlFor='password'
									className='text-label-md'
									style={{
										color: 'var(--color-on-surface-variant)',
									}}>
									Contraseña
								</label>
								<Link
									href='/forgot-password'
									className='text-body-sm hover:underline'
									style={{ color: 'var(--color-primary)' }}>
									¿Olvidaste tu contraseña?
								</Link>
							</div>
							<InputField
								id='password'
								name='password'
								type='password'
								autoComplete='current-password'
								placeholder='••••••••'
								required
							/>
						</div>

						<label className='inline-flex items-center gap-2 cursor-pointer select-none'>
							<input
								id='remember-me'
								name='remember-me'
								type='checkbox'
								className='h-4 w-4 rounded-sm border'
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
								Recordarme en este dispositivo
							</span>
						</label>

						<Button type='submit' fullWidth loading={loading}>
							{loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
						</Button>
					</form>

					<p
						className='text-body-sm text-center mt-6'
						style={{ color: 'var(--color-on-surface-variant)' }}>
						¿No tienes cuenta?{' '}
						<Link
							href='/register'
							className='font-medium hover:underline'
							style={{ color: 'var(--color-primary)' }}>
							Crear cuenta gratis
						</Link>
					</p>
				</div>
			</Card>
		</main>
	);
}
