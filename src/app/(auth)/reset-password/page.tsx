'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, InputField, StatusChip } from '@/components/ui';

export default function ResetPasswordPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const formData = new FormData(e.currentTarget);
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (password !== confirmPassword) {
			setError('Las contraseñas no coinciden');
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

			if (!res.ok) {
				throw new Error(data.error || 'Error al actualizar la contraseña');
			}

			setSuccess(true);
			setTimeout(() => {
				router.push('/login');
			}, 3000);
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
							status='info'
							label='Nueva Contraseña'
							className='bg-white/20 text-white'
						/>
					</div>
					<h1
						className='text-headline-lg mt-6'
						style={{ color: 'var(--color-on-primary)' }}>
						Establecer nueva contraseña
					</h1>
					<p
						className='text-body-sm mt-2'
						style={{ color: 'var(--color-primary-fixed-dim)' }}>
						Ingresa tu nueva contraseña para asegurar tu cuenta.
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
							Contraseña actualizada con éxito. Serás redirigido al login en unos segundos.
						</div>
					)}
					{!success && (
						<form className='space-y-5' onSubmit={handleSubmit}>
							<InputField
								id='password'
								name='password'
								type='password'
								label='Nueva contraseña'
								placeholder='Mínimo 8 caracteres'
								required
							/>

							<InputField
								id='confirmPassword'
								name='confirmPassword'
								type='password'
								label='Confirmar nueva contraseña'
								placeholder='Repite tu nueva contraseña'
								required
							/>

							<Button type='submit' fullWidth loading={loading}>
								{loading ? 'Actualizando...' : 'Actualizar contraseña'}
							</Button>
						</form>
					)}
				</div>
			</Card>
		</main>
	);
}
