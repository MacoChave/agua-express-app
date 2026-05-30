'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { Button, Card, InputField, StatusChip } from '../components/ui';

export default function RegisterPage() {
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		// TODO: integrar registro de usuario
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
				className='w-full max-w-9/12 rounded-lg overflow-hidden'>
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
								label='Purificadora'
								placeholder='Agua Pura del Norte'
								required
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

						<Button type='submit' fullWidth>
							Crear cuenta gratis
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
