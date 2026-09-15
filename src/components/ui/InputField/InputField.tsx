'use client';

import {
	InputHTMLAttributes,
	TextareaHTMLAttributes,
	forwardRef,
	useState,
	useRef,
	useEffect,
} from 'react';

interface BaseFieldProps {
	label?: string;
	hint?: string;
	error?: string;
	fullWidth?: boolean;
	className?: string;
}

interface InputFieldProps
	extends BaseFieldProps,
		Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
	as?: 'input';
	leftAction?: React.ReactNode;
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
	rightAction?: React.ReactNode;
}

interface TextareaFieldProps
	extends BaseFieldProps,
		Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
	as: 'textarea';
	prefixIcon?: never;
	suffixIcon?: never;
}

type FieldProps = InputFieldProps | TextareaFieldProps;

const inputBase = [
	'w-full text-left',
	'h-10 px-4 text-headline-sm font-semibold',
	'text-[var(--color-primary)]',
	'[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
	'focus:outline-none focus:ring-0',
].join(' ');

const inputError = [
	'border-[var(--color-error)]',
	'focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20',
].join(' ');

const EyeIcon = () => (
	<svg
		width='20'
		height='20'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'>
		<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
		<circle cx='12' cy='12' r='3'></circle>
	</svg>
);

const EyeOffIcon = () => (
	<svg
		width='20'
		height='20'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'>
		<path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
		<line x1='1' y1='1' x2='23' y2='23'></line>
	</svg>
);

const CloseIcon = () => (
	<svg
		width='18'
		height='18'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'>
		<line x1='18' y1='6' x2='6' y2='18'></line>
		<line x1='6' y1='6' x2='18' y2='18'></line>
	</svg>
);

const InputField = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	FieldProps
>((props, ref) => {
	const { label, hint, error, fullWidth = true, className = '' } = props;

	const fieldId = props.id ?? props.name;
	const hasError = Boolean(error);

	const wrapperClass = ['space-y-1', fullWidth ? 'w-full' : '', className]
		.filter(Boolean)
		.join(' ');

	// Extract values safely for hooks
	const initialValue = (props as any).value;
	const initialDefaultValue = (props as any).defaultValue;

	const internalRef = useRef<HTMLInputElement>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [hasValue, setHasValue] = useState(Boolean(initialValue || initialDefaultValue));

	useEffect(() => {
		if (initialValue !== undefined) {
			// eslint-disable-next-line
			setHasValue(String(initialValue).length > 0);
		}
	}, [initialValue]);

	if (props.as === 'textarea') {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const {
			as: _as,
			prefixIcon: _l,
			suffixIcon: _r,
			label: _lb,
			hint: _h,
			error: _e,
			fullWidth: _fw,
			className: _cls,
			...rest
		} = props;
		return (
			<div className={wrapperClass}>
				{label && (
					<label
						htmlFor={fieldId}
						className='text-label-md font-medium'
						style={{
							color: 'var(--color-primary)',
						}}>
						{label}
					</label>
				)}
				<div className='relative flex items-center bg-[var(--color-surface-bright)] border border-[var(--color-outline-variant)] rounded-md'>
					<textarea
						ref={ref as React.Ref<HTMLTextAreaElement>}
						id={fieldId}
						className={[inputBase, hasError ? inputError : '']
							.filter(Boolean)
							.join(' ')}
						aria-describedby={
							hint || error ? `${fieldId}-helper` : undefined
						}
						aria-invalid={hasError}
						{...rest}
					/>
				</div>
				{(hint || error) && (
					<p
						id={`${fieldId}-helper`}
						className={[
							'text-body-sm',
							hasError
								? 'text-[var(--color-error)]'
								: 'text-[var(--color-primary)]',
						].join(' ')}>
						{error ?? hint}
					</p>
				)}
			</div>
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const {
		as: _as,
		label: _lb,
		hint: _h,
		error: _e,
		fullWidth: _fw,
		className: _cls,
		prefixIcon: prefixIcon,
		suffixIcon: suffixIcon,
		leftAction: leftAction,
		rightAction: rightAction,
		type = 'text',
		onChange,
		value,
		defaultValue,
		...rest
	} = props as InputFieldProps;

	const isPassword = type === 'password';
	const isText = type === 'text';

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHasValue(e.target.value.length > 0);
		onChange?.(e);
	};

	const handleClear = () => {
		if (internalRef.current) {
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype,
				'value',
			)?.set;
			nativeInputValueSetter?.call(internalRef.current, '');
			const ev = new Event('input', { bubbles: true });
			internalRef.current.dispatchEvent(ev);
			internalRef.current.focus();
		}
	};

	const setRefs = (node: HTMLInputElement) => {
		internalRef.current = node;
		if (typeof ref === 'function') {
			ref(node);
		} else if (ref) {
			ref.current = node;
		}
	};

	const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

	const showClearButton = isText && hasValue && !rest.readOnly && !rest.disabled;
	const showPasswordToggle = isPassword && !rest.readOnly && !rest.disabled;

	// Calculate right padding based on icons and actions
	let rightPaddingClass = '';
	if (suffixIcon && (showClearButton || showPasswordToggle)) {
		rightPaddingClass = 'pr-16'; // extra space for both
	} else if (suffixIcon || showClearButton || showPasswordToggle) {
		rightPaddingClass = 'pr-10';
	}

	return (
		<div className={wrapperClass}>
			{label && (
				<label
					htmlFor={fieldId}
					className='text-label-md font-medium'
					style={{
						color: 'var(--color-primary)',
					}}>
					{label}
				</label>
			)}
			<div className='relative flex items-center bg-[var(--color-surface-bright)] border border-[var(--color-outline-variant)] rounded-md'>
				{leftAction && leftAction}
				{prefixIcon && (
					<span className='absolute left-3 text-[var(--color-primary)] pointer-events-none'>
						{prefixIcon}
					</span>
				)}
				<input
					ref={setRefs}
					id={fieldId}
					type={inputType}
					value={value}
					defaultValue={defaultValue}
					onChange={handleChange}
					className={[
						inputBase,
						hasError ? inputError : '',
						prefixIcon ? 'pl-9' : '',
						rightPaddingClass,
					]
						.filter(Boolean)
						.join(' ')}
					aria-describedby={
						hint || error ? `${fieldId}-helper` : undefined
					}
					aria-invalid={hasError}
					{...rest}
				/>
				
				<div className="absolute right-3 flex items-center gap-1.5">
					{showClearButton && (
						<button
							type="button"
							onClick={handleClear}
							className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors p-0.5 rounded-full hover:bg-[var(--color-surface-container)]"
							aria-label="Limpiar campo"
						>
							<CloseIcon />
						</button>
					)}
					{showPasswordToggle && (
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors p-0.5 rounded-full hover:bg-[var(--color-surface-container)]"
							aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						>
							{showPassword ? <EyeOffIcon /> : <EyeIcon />}
						</button>
					)}
					{suffixIcon && (
						<span className='text-[var(--color-primary)] pointer-events-none'>
							{suffixIcon}
						</span>
					)}
				</div>
				{rightAction && rightAction}
			</div>
			{(hint || error) && (
				<p
					id={`${fieldId}-helper`}
					className={[
						'text-body-sm',
						hasError
							? 'text-[var(--color-error)]'
							: 'text-[var(--color-primary)]',
					].join(' ')}>
					{error ?? hint}
				</p>
			)}
		</div>
	);
});

InputField.displayName = 'InputField';

export default InputField;
