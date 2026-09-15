'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, InputField, StatusChip } from '@/components/ui';
import WaterDrop from '@/assets/icons/water_drop.svg';
import { useToast } from '@/components/ui/Toast/ToastContext';

export default function ResetPasswordPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData(e.currentTarget);
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (password !== confirmPassword) {
			toast({
				title: 'Error',
				message: 'Las contraseñas no coinciden',
				type: 'error',
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

			if (!res.ok) {
				throw new Error(
					data.error || 'Error al actualizar la contraseña',
				);
			}

			toast({
				title: 'Éxito',
				message:
					'Contraseña actualizada con éxito. Serás redirigido al login en unos segundos.',
				type: 'success',
			});
		} catch (err: any) {
			toast({
				title: 'Error',
				message: err.message,
				type: 'error',
			});
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
							<WaterDrop className='inline-block w-6 h-6 mr-2' />
							AquaFlow Manager
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
							{loading
								? 'Actualizando...'
								: 'Actualizar contraseña'}
						</Button>
					</form>
				</div>
			</Card>
		</main>
	);
}
