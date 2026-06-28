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
	prefixIcon?: React.ReactNode;
	suffixIcon?: React.ReactNode;
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
	'w-full text-center border rounded-md',
	'h-10 text-headline-sm font-semibold',
	'text-[var(--color-primary)]',
	'bg-[var(--color-surface-bright)]',
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
		prefixIcon: startIcon,
		suffixIcon: endIcon,
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
			<div className='relative flex items-center'>
				{startIcon && (
					<span className='absolute left-3 text-[var(--color-primary)] pointer-events-none'>
						{startIcon}
					</span>
				)}
				<input
					ref={ref as React.Ref<HTMLInputElement>}
					id={fieldId}
					className={[
						inputBase,
						hasError ? inputError : '',
						startIcon ? 'pl-9' : '',
						endIcon ? 'pr-9' : '',
					]
						.filter(Boolean)
						.join(' ')}
					aria-describedby={
						hint || error ? `${fieldId}-helper` : undefined
					}
					aria-invalid={hasError}
					{...rest}
				/>
				{endIcon && (
					<span className='absolute right-3 text-[var(--color-primary)] pointer-events-none'>
						{endIcon}
					</span>
				)}
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
