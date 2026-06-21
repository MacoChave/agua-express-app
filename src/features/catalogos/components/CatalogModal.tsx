'use client';

import { useEffect } from 'react';
import Close from '@/assets/icons/close.svg';

interface CatalogModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export function CatalogModal({
	isOpen,
	onClose,
	title,
	children,
}: CatalogModalProps) {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-on-background)]/40 backdrop-blur-sm animate-in fade-in duration-300'
			onClick={onClose}>
			<div
				className='bg-[var(--color-surface-container-lowest)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300'
				onClick={(e) => e.stopPropagation()}>
				<header className='p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-primary)] text-[var(--color-on-primary)]'>
					<h3 className='text-headline-sm font-semibold'>{title}</h3>
					<button
						onClick={onClose}
						className='p-2 hover:bg-white/10 rounded-full transition-colors'>
						<Close className='w-5 h-5' />
					</button>
				</header>
				<div className='p-6'>{children}</div>
			</div>
		</div>
	);
}
