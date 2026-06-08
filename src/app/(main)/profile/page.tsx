'use client';

import { useState } from 'react';
import { Button, Card, InputField } from '@/components/ui';

export default function ProfilePage() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		const formData = new FormData(e.currentTarget);
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (password !== confirmPassword) {
			setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
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
			if (!res.ok) throw new Error(data.error || 'Error al cambiar contraseña');

			setMessage({ type: 'success', text: 'Contraseña actualizada con éxito' });
			(e.target as HTMLFormElement).reset();
		} catch (err: any) {
			setMessage({ type: 'error', text: err.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='pt-8 px-4 md:px-8 max-w-3xl mx-auto space-y-6'>
			<h1 className='text-headline-lg text-primary'>Mi Perfil</h1>
			
			<Card variant='default' padding='lg' className='border border-surface-container'>
				<h2 className='text-headline-sm text-primary mb-6'>Cambiar Contraseña</h2>
				
				{message && (
					<div className={`mb-6 p-4 rounded-lg text-body-sm ${
						message.type === 'success' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'
					}`}>
						{message.text}
					</div>
				)}

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
