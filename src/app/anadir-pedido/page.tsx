'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ArrowBack from '@/assets/icons/arrow_back.svg';
import VentaForm from '@/features/pedidos/components/VentaForm';
import GastoForm from '@/features/pedidos/components/GastoForm';

/* ── Componente ─────────────────────────────────────────── */
export default function AnadirPedidoPage() {
	const router = useRouter();
	const [tab, setTab] = useState<'venta' | 'gasto'>('venta');

	const handleConfirmar = () => {
		// Simulación de guardado
		setTimeout(() => router.push('/pedidos'), 1000);
	};

	return (
		<div
			className='min-h-screen pb-28'
			style={{ backgroundColor: 'var(--color-background)' }}>
			{/* ── Top App Bar ───────────────────────────── */}
			<header
				className='fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 border-b'
				style={{
					backgroundColor: 'var(--color-surface)',
					borderColor: 'var(--color-outline-variant)',
				}}>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => router.back()}
						className='w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-surface-container active:scale-90'
						aria-label='Volver'>
						<ArrowBack className='w-5 h-5' />
					</button>
					<h1
						className='text-headline-sm font-semibold'
						style={{ color: 'var(--color-primary)' }}>
						Nuevo Registro
					</h1>
				</div>
				<div
					className='w-8 h-8 rounded-full grid place-items-center font-bold text-xs border'
					style={{
						backgroundColor: 'var(--color-surface-container-high)',
						borderColor: 'var(--color-outline-variant)',
						color: 'var(--color-primary)',
					}}>
					TC
				</div>
			</header>

			{/* ── Contenido ─────────────────────────────── */}
			<main className='pt-20 pb-8 px-4 max-w-full mx-auto space-y-6 md:max-w-6/12'>
				{/* ── Selector de Tipo ──────────────────── */}
				<div className='flex p-1 rounded-xl bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]'>
					<button
						onClick={() => setTab('venta')}
						className={`flex-1 py-2 text-label-lg font-semibold rounded-lg transition-all ${
							tab === 'venta'
								? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-md'
								: 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
						}`}
					>
						Venta
					</button>
					<button
						onClick={() => setTab('gasto')}
						className={`flex-1 py-2 text-label-lg font-semibold rounded-lg transition-all ${
							tab === 'gasto'
								? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-md'
								: 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
						}`}
					>
						Gasto
					</button>
				</div>

				{/* ── Formulario Dinámico ───────────────── */}
				{tab === 'venta' ? (
					<VentaForm onConfirm={handleConfirmar} />
				) : (
					<GastoForm onConfirm={handleConfirmar} />
				)}
			</main>
		</div>
	);
}
