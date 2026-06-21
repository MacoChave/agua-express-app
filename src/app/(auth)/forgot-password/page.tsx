'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button, Card, InputField, StatusChip } from '@/components/ui';
import WaterDrop from '@/assets/icons/water_drop.svg';

export default function ForgotPasswordPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		const formData = new FormData(e.currentTarget);
		const email = formData.get('email');

		try {
			const res = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || 'Error al enviar el correo');
			}

			setSuccess(true);
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
					{error && (
						<div className='mb-6 p-4 rounded-lg bg-error-container text-on-error-container text-body-sm'>
							{error}
						</div>
					)}
					{success && (
						<div className='mb-6 p-4 rounded-lg bg-primary-container text-on-primary-container text-body-sm'>
							Se ha enviado un enlace de recuperación a tu correo
							electrónico.
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
							hint='Usa el correo con el que registraste tu cuenta'
							required
						/>

						<Button type='submit' fullWidth loading={loading}>
							{loading
								? 'Enviando...'
								: 'Enviar enlace de recuperación'}
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
