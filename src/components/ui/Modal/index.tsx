'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '6/12';
	closeOnOutsideClick?: boolean;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = 'md',
	closeOnOutsideClick = true,
}: ModalProps) {
	const overlayRef = useRef<HTMLDivElement>(null);

	// Cerrar con tecla Escape
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	// Cerrar al hacer clic fuera (en el overlay)
	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (closeOnOutsideClick && e.target === overlayRef.current) {
			onClose();
		}
	};

	if (!isOpen) return null;

	const maxWidthClasses = {
		sm: 'md:max-w-1/3',
		md: 'md:max-w-1/2',
		lg: 'md:max-w-2/3',
		xl: 'md:max-w-5/6',
		'6/12': 'md:max-w-6/12',
	};

	return (
		<div
			ref={overlayRef}
			onClick={handleOverlayClick}
			className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50'>
			<Card
				className={`w-full ${maxWidthClasses[maxWidth]} shadow-2xl animate-in fade-in zoom-in duration-200 !overflow-visible`}>
				{title && (
					<h2 className='text-headline-sm text-primary mb-6'>
						{title}
					</h2>
				)}
				{children}
			</Card>
		</div>
	);
}
