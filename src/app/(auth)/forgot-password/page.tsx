'use client';

import type { FormEvent } from 'react';
import Link from 'next/link';
import { Button, Card, InputField, StatusChip } from '@/components/ui';

export default function ForgotPasswordPage() {
	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		// TODO: integrar recuperación de contraseña
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
							status='info'
							label='Recuperación'
							className='bg-white/20 text-white'
						/>
					</div>
					<h1
						className='text-headline-lg mt-6'
						style={{ color: 'var(--color-on-primary)' }}>
						Recuperar contraseña
					</h1>
					<p
						className='text-body-sm mt-2'
						style={{ color: 'var(--color-primary-fixed-dim)' }}>
						Ingresa tu correo y te enviaremos un enlace para
						restablecer tu contraseña.
					</p>
				</div>

				<div className='px-8 py-8'>
					<form className='space-y-5' onSubmit={handleSubmit}>
						<InputField
							id='email'
							name='email'
							type='email'
							autoComplete='email'
							label='Correo electrónico'
							placeholder='tu@empresa.com'
							hint='Usa el correo con el que registraste tu cuenta'
							required
						/>

						<Button type='submit' fullWidth>
							Enviar enlace de recuperación
						</Button>
					</form>

					<div className='mt-6 flex items-center justify-center gap-1 text-body-sm'>
						<span
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							¿Recordaste tu contraseña?
						</span>
						<Link
							href='/login'
							className='font-medium hover:underline'
							style={{ color: 'var(--color-primary)' }}>
							Volver al login
						</Link>
					</div>
				</div>
			</Card>
		</main>
	);
}
