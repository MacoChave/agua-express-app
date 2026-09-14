'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from './Toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
	id: string;
	type: ToastType;
	title?: string;
	message: string;
	duration?: number;
}

interface ToastContextValue {
	toast: (message: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const toast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { ...msg, id }]);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div className='fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 max-w-1/2 sm:max-w-1/3 w-full pointer-events-none'>
				{toasts.map((t) => (
					<Toast
						key={t.id}
						{...t}
						onRemove={() => removeToast(t.id)}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};
