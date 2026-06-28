import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface BaseFieldProps {
	label?: string;
	hint?: string;
	error?: string;
	fullWidth?: boolean;
	className?: string;
}

interface InputFieldProps
	extends
		BaseFieldProps,
		Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
	as?: 'input';
	leftAction?: React.ReactNode;
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
	rightAction?: React.ReactNode;
}

interface TextareaFieldProps
	extends
		BaseFieldProps,
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

	if (props.as === 'textarea') {
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
		...rest
	} = props as InputFieldProps;

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
					ref={ref as React.Ref<HTMLInputElement>}
					id={fieldId}
					className={[
						inputBase,
						hasError ? inputError : '',
						prefixIcon ? 'pl-9' : '',
						suffixIcon ? 'pr-9' : '',
					]
						.filter(Boolean)
						.join(' ')}
					aria-describedby={
						hint || error ? `${fieldId}-helper` : undefined
					}
					aria-invalid={hasError}
					{...rest}
				/>
				{suffixIcon && (
					<span className='absolute right-3 text-[var(--color-primary)] pointer-events-none'>
						{suffixIcon}
					</span>
				)}
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
