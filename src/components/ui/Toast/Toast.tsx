'use client';

import React, { useEffect, useState } from 'react';
import { ToastType } from './ToastContext';

interface ToastProps {
	id: string;
	type: ToastType;
	title?: string;
	message: string;
	duration?: number;
	onRemove: () => void;
}

export const Toast = ({
	type,
	title,
	message,
	duration = 4000,
	onRemove,
}: ToastProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);

	useEffect(() => {
		// Trigger enter animation
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setIsVisible(true);
			});
		});

		if (duration > 0) {
			const timer = setTimeout(() => {
				handleClose();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [duration]);

	const handleClose = () => {
		setIsLeaving(true);
		setTimeout(onRemove, 300); // match transition duration
	};

	const typeStyles = {
		success: 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]',
		error: 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]',
		warning: 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]',
		info: 'bg-[#eff6ff] border-[#bfdbfe] text-[#1e40af]',
	};

	const iconStyles = {
		success: 'text-[#22c55e]',
		error: 'text-[#ef4444]',
		warning: 'text-[#f59e0b]',
		info: 'text-[#3b82f6]',
	};

	const Icon = () => {
		switch (type) {
			case 'success':
				return (
					<svg
						className={`w-6 h-6 ${iconStyles.success}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				);
			case 'error':
				return (
					<svg
						className={`w-6 h-6 ${iconStyles.error}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				);
			case 'warning':
				return (
					<svg
						className={`w-6 h-6 ${iconStyles.warning}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
						/>
					</svg>
				);
			case 'info':
			default:
				return (
					<svg
						className={`w-6 h-6 ${iconStyles.info}`}
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
				);
		}
	};

	return (
		<div
			className={`pointer-events-auto flex items-start p-4 border rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 transform ${
				!isVisible || isLeaving
					? 'opacity-0 translate-x-8'
					: 'opacity-100 translate-x-0'
			} ${typeStyles[type]}`}
			role='alert'>
			<div className='flex-shrink-0'>
				<Icon />
			</div>
			<div className='ml-3 w-0 flex-1'>
				{title && <p className='text-sm font-bold mb-0.5'>{title}</p>}
				<p className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</p>
			</div>
			<div className='ml-4 flex-shrink-0 flex'>
				<button
					onClick={handleClose}
					className='inline-flex text-current opacity-50 hover:opacity-100 focus:outline-none transition-opacity'
					aria-label='Cerrar'>
					<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
						<path
							fillRule='evenodd'
							d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
