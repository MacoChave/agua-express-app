'use client';
import React, {
	useState,
	useEffect,
	useMemo,
	useRef,
	useLayoutEffect,
} from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('es');
dayjs.updateLocale('es', {
	weekStart: 1,
});

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export type SingleValue = Date | string | null;
export type RangeValue = [Date | string | null, Date | string | null];
export type DatePickerValue = SingleValue | RangeValue;

export interface DatePickerProps {
	mode?: 'date' | 'datetime';
	selectionType?: 'single' | 'range';
	value?: DatePickerValue;
	onChange?: (value: DatePickerValue) => void;
	onCancel?: () => void;
	className?: string;
	placeholder?: string;
}

const ChevronLeft = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2.5'
		strokeLinecap='round'
		strokeLinejoin='round'>
		<path d='m15 18-6-6 6-6' />
	</svg>
);

const ChevronRight = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2.5'
		strokeLinecap='round'
		strokeLinejoin='round'>
		<path d='m9 18 6-6-6-6' />
	</svg>
);

const CalendarIcon = () => (
	<svg
		width='18'
		height='18'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'>
		<rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
		<line x1='16' x2='16' y1='2' y2='6' />
		<line x1='8' x2='8' y1='2' y2='6' />
		<line x1='3' x2='21' y1='10' y2='10' />
	</svg>
);

const ScrollColumn = ({
	items,
	value,
	onChange,
}: {
	items: number[];
	value: number;
	onChange: (v: number) => void;
}) => {
	return (
		<div
			className='h-40 overflow-y-auto snap-y snap-mandatory scrollbar-hide text-center relative border-x border-slate-50 w-full'
			style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
			<div className='h-16' />
			{items.map((item) => {
				const isSelected = value === item;
				return (
					<div
						key={item}
						onClick={() => onChange(item)}
						className={`h-8 flex items-center justify-center snap-center cursor-pointer transition-colors text-sm
                            ${isSelected ? 'bg-[#dbeef9] text-[#003b5c] font-bold' : 'text-slate-500 hover:bg-slate-50 font-medium'}
                        `}>
						{String(item).padStart(2, '0')}
					</div>
				);
			})}
			<div className='h-16' />
		</div>
	);
};

const safeParse = (
	val: Date | string | null,
	mode: 'date' | 'datetime',
): Dayjs | null => {
	if (!val) return null;
	let d = dayjs(val);
	if (
		mode === 'date' &&
		typeof val === 'string' &&
		val.includes('T00:00:00.000Z')
	) {
		return dayjs.utc(val).local();
	}
	return d;
};

const CalendarPanel: React.FC<DatePickerProps> = ({
	mode = 'date',
	selectionType = 'single',
	value,
	onChange,
	onCancel,
	className = '',
}) => {
	const [draftStart, setDraftStart] = useState<Dayjs | null>(null);
	const [draftEnd, setDraftEnd] = useState<Dayjs | null>(null);
	const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

	useEffect(() => {
		if (selectionType === 'single') {
			if (value && !Array.isArray(value)) {
				const d = safeParse(value, mode);
				setDraftStart(d);
				if (d) setCurrentMonth(d.startOf('month'));
			} else {
				setDraftStart(null);
			}
		} else {
			if (Array.isArray(value)) {
				const s = safeParse(value[0], mode);
				const e = safeParse(value[1], mode);
				setDraftStart(s);
				setDraftEnd(e);
				if (s) setCurrentMonth(s.startOf('month'));
			} else {
				setDraftStart(null);
				setDraftEnd(null);
			}
		}
	}, [value, selectionType, mode]);

	const daysInMonth = useMemo(() => {
		const start = currentMonth.startOf('month');
		const end = currentMonth.endOf('month');
		const startDate = start.startOf('week');
		const endDate = end.endOf('week');

		const days: Dayjs[] = [];
		let current = startDate;
		while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
			days.push(current);
			current = current.add(1, 'day');
		}
		return days;
	}, [currentMonth]);

	const handleDayClick = (day: Dayjs) => {
		let dayWithTime = day;

		if (mode === 'datetime') {
			if (selectionType === 'single' && draftStart) {
				dayWithTime = day
					.hour(draftStart.hour())
					.minute(draftStart.minute());
			}
		}

		if (selectionType === 'single') {
			setDraftStart(dayWithTime);
		} else {
			if (!draftStart || (draftStart && draftEnd)) {
				if (mode === 'datetime' && draftStart) {
					dayWithTime = day
						.hour(draftStart.hour())
						.minute(draftStart.minute());
				}
				setDraftStart(dayWithTime);
				setDraftEnd(null);
			} else if (draftStart && !draftEnd) {
				if (day.isBefore(draftStart, 'day')) {
					if (mode === 'datetime' && draftStart) {
						dayWithTime = day
							.hour(draftStart.hour())
							.minute(draftStart.minute());
					}
					setDraftEnd(draftStart);
					setDraftStart(dayWithTime);
				} else {
					if (mode === 'datetime') {
						dayWithTime = day.hour(23).minute(59);
					}
					setDraftEnd(dayWithTime);
				}
			}
		}
	};

	const handleApply = () => {
		if (onChange) {
			const getSafeDate = (d: Dayjs | null) => {
				if (!d) return null;
				if (mode === 'date') {
					return d.hour(12).minute(0).second(0).toDate();
				}
				return d.toDate();
			};

			if (selectionType === 'single') {
				onChange(getSafeDate(draftStart));
			} else {
				onChange([getSafeDate(draftStart), getSafeDate(draftEnd)]);
			}
		}
	};

	const nextMonth = () => setCurrentMonth(currentMonth.add(1, 'month'));
	const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, 'month'));

	const isSelected = (day: Dayjs) => {
		if (selectionType === 'single') {
			return draftStart?.isSame(day, 'day');
		}
		return draftStart?.isSame(day, 'day') || draftEnd?.isSame(day, 'day');
	};

	const isBetweenDates = (day: Dayjs) => {
		if (selectionType === 'range' && draftStart && draftEnd) {
			return (
				day.isAfter(draftStart, 'day') && day.isBefore(draftEnd, 'day')
			);
		}
		return false;
	};

	const isRangeStart = (day: Dayjs) => {
		return (
			selectionType === 'range' &&
			draftStart &&
			draftEnd &&
			day.isSame(draftStart, 'day')
		);
	};

	const isRangeEnd = (day: Dayjs) => {
		return (
			selectionType === 'range' &&
			draftStart &&
			draftEnd &&
			day.isSame(draftEnd, 'day')
		);
	};

	const hours = Array.from({ length: 24 }).map((_, i) => i);
	const minutes = Array.from({ length: 60 }).map((_, i) => i);

	return (
		<div
			className={`w-[340px] bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-slate-200 overflow-hidden font-sans select-none ${className}`}>
			<style
				dangerouslySetInnerHTML={{
					__html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `,
				}}
			/>

			{/* Header */}
			<div className='flex items-center justify-between px-6 py-5 bg-white'>
				<div className='text-[#003b5c] font-semibold text-lg capitalize'>
					{currentMonth.format('MMMM YYYY')}
				</div>
				<div className='flex items-center gap-1'>
					<button
						onClick={prevMonth}
						className='text-[#003b5c] hover:bg-slate-100 p-1.5 rounded transition-colors'>
						<ChevronLeft />
					</button>
					<button
						onClick={nextMonth}
						className='text-[#003b5c] hover:bg-slate-100 p-1.5 rounded transition-colors'>
						<ChevronRight />
					</button>
				</div>
			</div>

			{/* Calendar */}
			<div className='px-6 pb-2'>
				{/* Weekdays */}
				<div className='grid grid-cols-7 mb-2'>
					{WEEKDAYS.map((day) => (
						<div
							key={day}
							className='text-center text-[11px] font-bold text-slate-500 uppercase tracking-wide'>
							{day}
						</div>
					))}
				</div>

				{/* Days */}
				<div className='grid grid-cols-7 gap-y-2'>
					{daysInMonth.map((day, i) => {
						const isCurrentMonth = day.isSame(
							currentMonth,
							'month',
						);
						const selected = isSelected(day);
						const between = isBetweenDates(day);
						const rangeStart = isRangeStart(day);
						const rangeEnd = isRangeEnd(day);

						return (
							<div
								key={i}
								className='relative flex justify-center items-center h-10'>
								{selectionType === 'range' &&
									draftStart &&
									draftEnd && (
										<>
											{between && (
												<div className='absolute inset-0 bg-[#e6f0fa]' />
											)}
											{rangeStart && !rangeEnd && (
												<div className='absolute right-0 w-1/2 h-full bg-[#e6f0fa]' />
											)}
											{rangeEnd && !rangeStart && (
												<div className='absolute left-0 w-1/2 h-full bg-[#e6f0fa]' />
											)}
										</>
									)}

								<button
									onClick={() => handleDayClick(day)}
									className={`
										relative z-10 w-8 h-8 rounded-md flex items-center justify-center text-[14px] transition-colors
										${selected ? 'bg-[#003b5c] text-white font-semibold' : 'font-medium'}
										${!selected && isCurrentMonth ? 'text-[#003b5c] hover:bg-slate-100' : ''}
										${!selected && !isCurrentMonth ? 'text-slate-300 hover:bg-slate-50' : ''}
										${between && !selected ? 'text-[#003b5c]' : ''}
									`}>
									{day.date()}
								</button>
							</div>
						);
					})}
				</div>

				{/* Time Selector based on design */}
				{mode === 'datetime' && (
					<div className='mt-6'>
						<div className='text-center mb-4'>
							<p className='text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1'>
								Hora Seleccionada
							</p>
							<p className='text-2xl font-medium text-[#003b5c]'>
								{String(
									draftStart ? draftStart.hour() : 0,
								).padStart(2, '0')}{' '}
								:{' '}
								{String(
									draftStart ? draftStart.minute() : 0,
								).padStart(2, '0')}
							</p>
						</div>

						{selectionType === 'single' ? (
							<div className='flex bg-[#f8fafd] rounded-md overflow-hidden h-48 border border-slate-100 relative'>
								<div className='flex-1 flex flex-col'>
									<div className='text-[10px] font-bold text-slate-400 text-center py-2 bg-white z-10'>
										HH
									</div>
									<ScrollColumn
										items={hours}
										value={
											draftStart ? draftStart.hour() : 0
										}
										onChange={(h) =>
											setDraftStart(
												draftStart
													? draftStart.hour(h)
													: dayjs().hour(h),
											)
										}
									/>
								</div>
								<div className='flex-1 flex flex-col border-l border-slate-100'>
									<div className='text-[10px] font-bold text-slate-400 text-center py-2 bg-white z-10'>
										MM
									</div>
									<ScrollColumn
										items={minutes}
										value={
											draftStart ? draftStart.minute() : 0
										}
										onChange={(m) =>
											setDraftStart(
												draftStart
													? draftStart.minute(m)
													: dayjs().minute(m),
											)
										}
									/>
								</div>
								{/* Center highlight bar */}
								<div className='absolute top-1/2 left-0 w-full h-8 -mt-4 bg-[#dbeef9]/30 pointer-events-none' />
							</div>
						) : (
							<div className='flex flex-col gap-4 px-2'>
								<div className='flex justify-between items-center gap-4'>
									<div className='flex-1'>
										<p className='text-[10px] font-bold text-slate-500 mb-1'>
											INICIO
										</p>
										<input
											type='time'
											value={
												draftStart
													? draftStart.format('HH:mm')
													: ''
											}
											onChange={(e) => {
												if (
													!draftStart ||
													!e.target.value
												)
													return;
												const [h, m] =
													e.target.value.split(':');
												setDraftStart(
													draftStart
														.hour(Number(h))
														.minute(Number(m)),
												);
											}}
											className='w-full border border-slate-200 rounded p-1 text-sm text-center text-[#003b5c] outline-none focus:ring-1 focus:ring-[#003b5c]'
										/>
									</div>
									<div className='flex-1'>
										<p className='text-[10px] font-bold text-slate-500 mb-1'>
											FIN
										</p>
										<input
											type='time'
											value={
												draftEnd
													? draftEnd.format('HH:mm')
													: ''
											}
											onChange={(e) => {
												if (
													!draftEnd ||
													!e.target.value
												)
													return;
												const [h, m] =
													e.target.value.split(':');
												setDraftEnd(
													draftEnd
														.hour(Number(h))
														.minute(Number(m)),
												);
											}}
											className='w-full border border-slate-200 rounded p-1 text-sm text-center text-[#003b5c] outline-none focus:ring-1 focus:ring-[#003b5c]'
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Footer Actions */}
			<div className='flex flex-col px-6 py-4 gap-2 bg-white'>
				<button
					onClick={handleApply}
					className='w-full bg-[#003b5c] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#002a42] transition-colors'>
					{mode === 'datetime'
						? 'CONFIRMAR HORA'
						: selectionType === 'single'
							? 'CONFIRMAR FECHA'
							: 'CONFIRMAR RANGO'}
				</button>
				<button
					onClick={onCancel}
					className='w-full text-[#003b5c] font-semibold text-sm py-3 hover:bg-slate-50 rounded-lg transition-colors'>
					CANCELAR
				</button>
			</div>
		</div>
	);
};

const DatePicker: React.FC<DatePickerProps> = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [popoverPosition, setPopoverPosition] = useState<'bottom' | 'top'>(
		'bottom',
	);
	const containerRef = useRef<HTMLDivElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Layout effect to calculate available space when opening
	useLayoutEffect(() => {
		if (isOpen && containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			// Estimate height of CalendarPanel (approx 380px for date, 550px for datetime)
			const estimatedHeight = props.mode === 'datetime' ? 550 : 380;
			const spaceBelow = window.innerHeight - rect.bottom;

			// If space below is less than what we need, and there is more space above, open upwards
			if (spaceBelow < estimatedHeight && rect.top > spaceBelow) {
				setPopoverPosition('top');
			} else {
				setPopoverPosition('bottom');
			}
		}
	}, [isOpen, props.mode]);

	const displayValue = useMemo(() => {
		if (!props.value) return '';
		const formatStr =
			props.mode === 'datetime' ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';

		const formatVal = (val: any) => {
			if (!val) return '';
			let d = dayjs(val);
			if (props.mode === 'date') {
				if (typeof val === 'string' && val.includes('T00:00:00')) {
					d = dayjs.utc(val);
				} else if (val instanceof Date) {
					if (d.hour() > 12) {
						d = d.add(1, 'day');
					}
				}
			}
			return d.format(formatStr);
		};

		if (props.selectionType === 'single') {
			if (Array.isArray(props.value)) return '';
			return formatVal(props.value);
		} else {
			if (!Array.isArray(props.value)) return '';
			const start = props.value[0] ? formatVal(props.value[0]) : '';
			const end = props.value[1] ? formatVal(props.value[1]) : '';
			if (start && end) return `${start} - ${end}`;
			if (start) return `${start} - `;
			return '';
		}
	}, [props.value, props.mode, props.selectionType]);

	return (
		<div className={`relative ${props.className || ''}`} ref={containerRef}>
			<div
				className='w-full text-left border border-slate-200 rounded-md h-10 px-4 flex justify-between items-center bg-[var(--color-surface-bright)] text-[#003b5c] font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#003b5c] transition-colors hover:border-[#003b5c]'
				onClick={() => setIsOpen(!isOpen)}
				tabIndex={0}>
				{displayValue ? (
					<span>{displayValue}</span>
				) : (
					<span className='text-slate-400 font-normal'>
						{props.placeholder || 'Seleccionar...'}
					</span>
				)}
				<span className='text-slate-400'>
					<CalendarIcon />
				</span>
			</div>

			{isOpen && (
				<div
					ref={popoverRef}
					className={`absolute left-0 z-50 ${popoverPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
					<CalendarPanel
						{...props}
						className=''
						onCancel={() => {
							setIsOpen(false);
							props.onCancel?.();
						}}
						onChange={(v) => {
							props.onChange?.(v);
							setIsOpen(false);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default DatePicker;
