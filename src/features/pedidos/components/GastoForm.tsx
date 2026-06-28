'use client';

import { useState, useRef, useEffect } from 'react';
import Save from '@/assets/icons/save.svg';
import CloudUpload from '@/assets/icons/cloud_upload.svg';
import { InputField } from '@/components/ui';
import { apiClient } from '@/lib/apiClient';
import { createClient } from '@/lib/supabase/client';

interface GastoFormProps {
	onConfirm: () => void;
}

export default function GastoForm({ onConfirm }: GastoFormProps) {
	const [tipoGasto, setTipoGasto] = useState('');
	const [monto, setMonto] = useState('');
	const [archivo, setArchivo] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [expenseTypes, setExpenseTypes] = useState<any[]>([]);
	const [loadingTypes, setLoadingTypes] = useState(true);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		async function fetchExpenseTypes() {
			try {
				const data = await apiClient.get<any[]>('/expense-types');
				setExpenseTypes(data);
			} catch (error) {
				console.error('Error fetching expense types:', error);
			} finally {
				setLoadingTypes(false);
			}
		}
		fetchExpenseTypes();
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setArchivo(e.target.files[0]);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSave = async () => {
		if (!tipoGasto || !monto) {
			alert('Por favor complete los campos obligatorios.');
			return;
		}

		setLoading(true);
		try {
			let evidenceUrl = null;

			// Si hay un archivo, súbelo a Supabase Storage primero
			if (archivo) {
				const supabase = createClient();
				// Crear un nombre de archivo único para evitar colisiones
				const fileExt = archivo.name.split('.').pop();
				const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
				const filePath = `${tipoGasto}/${fileName}`;

				const { error: uploadError } = await supabase.storage
					.from('evidence')
					.upload(filePath, archivo);

				if (uploadError) {
					console.error('Error uploading file:', uploadError);
					alert(
						'Error al subir la evidencia. Por favor intente de nuevo.',
					);
					setLoading(false);
					return;
				}

				// Obtener la URL pública del archivo subido
				const { data: publicUrlData } = supabase.storage
					.from('evidence')
					.getPublicUrl(filePath);

				evidenceUrl = publicUrlData.publicUrl;
			}

			await apiClient.post('/inventory-movements', {
				move_type: 'COMPRA', // Placeholder para tipo de movimiento de gasto
				quantity: 1, // Un gasto suele ser una unidad
				price: parseFloat(monto),
				expense_type_id: tipoGasto,
				move_date: new Date().toISOString().split('T')[0],
				notes: `Registro de gasto: ${tipoGasto}`,
				evidence: evidenceUrl,
			});
			onConfirm();
		} catch (error) {
			console.error('Error saving expense:', error);
			alert('Error al guardar el gasto. Por favor, intente de nuevo.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div
				className='rounded-xl p-6 border space-y-6'
				style={{
					backgroundColor: 'var(--color-surface-container-lowest)',
					borderColor:
						'color-mix(in srgb, var(--color-outline-variant) 20%, transparent)',
					boxShadow: '0 4px 12px rgba(0,77,122,0.08)',
				}}>
				<h2
					className='text-headline-sm font-semibold border-b pb-2'
					style={{
						color: 'var(--color-primary)',
						borderColor: 'var(--color-outline-variant)',
					}}>
					Detalles de Gasto
				</h2>

				<div className='space-y-4'>
					{/* Tipo de Gasto */}
					<div className='flex flex-col gap-1'>
						<label className='text-label-md text-[var(--color-on-surface-variant)]'>
							Tipo de gasto
						</label>
						<select
							value={tipoGasto}
							onChange={(e) => setTipoGasto(e.target.value)}
							disabled={loadingTypes}
							className='w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-[var(--radius-md)] px-3 py-2 text-body-md focus:outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-all appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1em_1em] disabled:opacity-50'
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z'/%3E%3C/svg%3E")`,
							}}>
							<option value='' disabled>
								{loadingTypes
									? 'Cargando tipos...'
									: 'Seleccionar tipo'}
							</option>
							{expenseTypes.map((type) => (
								<option
									key={type.expense_type}
									value={type.expense_type}>
									{type.name}
								</option>
							))}
						</select>
					</div>

					{/* Monto del Gasto */}
					<InputField
						label='Monto del gasto'
						type='number'
						placeholder='0.00'
						value={monto}
						onChange={(e) => setMonto(e.target.value)}
						prefixIcon={
							<span className='text-body-md font-semibold'>
								Q
							</span>
						}
					/>

					{/* Subir Evidencia */}
					<div className='flex flex-col gap-1'>
						<label className='text-label-md text-[var(--color-on-surface-variant)]'>
							Evidencia (Foto/Ticket)
						</label>
						<input
							type='file'
							ref={fileInputRef}
							onChange={handleFileChange}
							className='hidden'
							accept='image/*,capture=camera,.pdf'
							capture='environment'
						/>
						<button
							type='button'
							onClick={triggerFileInput}
							className='w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors hover:bg-surface-container-low active:bg-surface-container'
							style={{
								borderColor: 'var(--color-outline-variant)',
								color: 'var(--color-on-surface-variant)',
							}}>
							{archivo ? (
								<div className='flex flex-col items-center'>
									<span className='text-body-md font-medium text-[var(--color-primary)]'>
										Archivo seleccionado
									</span>
									<span className='text-body-sm max-w-[200px] truncate'>
										{archivo.name}
									</span>
								</div>
							) : (
								<>
									<CloudUpload className='w-8 h-8 opacity-50' />
									<span className='text-body-md'>
										Subir archivo
									</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* ── Botón confirmar ─────────────────────── */}
			<button
				onClick={handleSave}
				disabled={loading}
				className='w-full h-16 rounded-xl text-headline-md font-semibold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70'
				style={{
					backgroundColor: 'var(--color-primary-container)',
					color: 'var(--color-on-primary)',
				}}>
				{loading ? (
					<span className='w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin' />
				) : (
					<Save />
				)}
				{loading ? 'Guardando...' : 'Guardar Registro'}
			</button>
		</div>
	);
}
