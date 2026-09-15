'use client';

import { useState, ReactNode } from 'react';

export interface Column<T> {
	key: keyof T | string;
	header: string;
	width?: string;
	align?: 'left' | 'center' | 'right';
	sortable?: boolean;
	render?: (value: unknown, row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	keyField: keyof T;
	caption?: string;
	emptyMessage?: string;
	loading?: boolean;
	stickyHeader?: boolean;
	striped?: boolean;
	className?: string;
	onRowClick?: (row: T) => void;
}

type SortDirection = 'asc' | 'desc' | null;

function SortIcon({ direction }: { direction: SortDirection }) {
	return (
		<span
			className='inline-flex flex-col ml-1 gap-px opacity-60'
			aria-hidden='true'>
			<svg
				width='8'
				height='5'
				viewBox='0 0 8 5'
				className={direction === 'asc' ? 'opacity-100' : 'opacity-30'}
				fill='currentColor'>
				<path d='M4 0L8 5H0L4 0Z' />
			</svg>
			<svg
				width='8'
				height='5'
				viewBox='0 0 8 5'
				className={direction === 'desc' ? 'opacity-100' : 'opacity-30'}
				fill='currentColor'>
				<path d='M4 5L0 0H8L4 5Z' />
			</svg>
		</span>
	);
}

export default function DataTable<T extends Record<string, unknown>>({
	columns,
	data,
	keyField,
	caption,
	emptyMessage = 'Sin datos disponibles',
	loading = false,
	stickyHeader = false,
	striped = true,
	className = '',
	onRowClick,
}: DataTableProps<T>) {
	const [sortKey, setSortKey] = useState<string | null>(null);
	const [sortDir, setSortDir] = useState<SortDirection>(null);

	const handleSort = (key: string) => {
		if (sortKey === key) {
			setSortDir((prev) =>
				prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc',
			);
			if (sortDir === 'desc') setSortKey(null);
		} else {
			setSortKey(key);
			setSortDir('asc');
		}
	};

	const sortedData = [...data].sort((a, b) => {
		if (!sortKey || !sortDir) return 0;
		const aVal = a[sortKey] as string | number;
		const bVal = b[sortKey] as string | number;
		if (aVal === bVal) return 0;
		const cmp = aVal < bVal ? -1 : 1;
		return sortDir === 'asc' ? cmp : -cmp;
	});

	const alignClass = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right',
	};

	return (
		<div
			className={[
				'w-full rounded-[var(--radius-md)] overflow-hidden',
				'bg-[var(--color-surface-container-lowest)]',
				'border border-[var(--color-outline-variant)]',
				className,
			]
				.filter(Boolean)
				.join(' ')}>
			<div className='overflow-x-auto'>
				<table className='w-full border-collapse'>
					{caption && (
						<caption className='text-label-md text-[var(--color-on-surface-variant)] text-left px-4 py-2'>
							{caption}
						</caption>
					)}
					<thead
						className={[
							'bg-[var(--color-surface-container-low)]',
							stickyHeader ? 'sticky top-0 z-10' : '',
						]
							.filter(Boolean)
							.join(' ')}>
						<tr>
							{columns.map((col) => (
								<th
									key={String(col.key)}
									scope='col'
									style={
										col.width
											? { width: col.width }
											: undefined
									}
									className={[
										'text-label-md text-[var(--color-on-surface-variant)] font-medium',
										'px-4 py-3 border-b border-[var(--color-outline-variant)]',
										alignClass[col.align ?? 'left'],
										col.sortable
											? 'cursor-pointer select-none hover:text-[var(--color-on-surface)] transition-colors'
											: '',
									]
										.filter(Boolean)
										.join(' ')}
									onClick={
										col.sortable
											? () => handleSort(String(col.key))
											: undefined
									}
									aria-sort={
										sortKey === String(col.key)
											? sortDir === 'asc'
												? 'ascending'
												: 'descending'
											: undefined
									}>
									<span className='inline-flex items-center'>
										{col.header}
										{col.sortable && (
											<SortIcon
												direction={
													sortKey === String(col.key)
														? sortDir
														: null
												}
											/>
										)}
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td
									colSpan={columns.length}
									className='text-center py-12 text-[var(--color-on-surface-variant)] text-body-md'>
									<span className='inline-flex items-center gap-2'>
										<span className='w-4 h-4 rounded-full border-2 border-[var(--color-secondary)] border-t-transparent animate-spin' />
										Cargando…
									</span>
								</td>
							</tr>
						) : sortedData.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className='text-center py-12 text-[var(--color-on-surface-variant)] text-body-md'>
									{emptyMessage}
								</td>
							</tr>
						) : (
							sortedData.map((row, rowIdx) => (
								<tr
									key={String(row[keyField])}
									onClick={
										onRowClick
											? () => onRowClick(row)
											: undefined
									}
									className={[
										'border-b border-[var(--color-outline-variant)] last:border-0',
										'transition-colors duration-100',
										striped && rowIdx % 2 !== 0
											? 'bg-[var(--color-surface-container-low)]'
											: 'bg-[var(--color-surface-container-lowest)]',
										onRowClick
											? 'cursor-pointer hover:bg-[var(--color-surface-container)]'
											: '',
									]
										.filter(Boolean)
										.join(' ')}>
									{columns.map((col) => {
										const rawValue = row[String(col.key)];
										return (
											<td
												key={String(col.key)}
												className={[
													'px-4 py-3 text-body-sm text-[var(--color-on-surface)]',
													alignClass[
														col.align ?? 'left'
													],
												].join(' ')}>
												{col.render
													? col.render(
															rawValue,
															row,
															rowIdx,
														)
													: (rawValue as ReactNode)}
											</td>
										);
									})}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
