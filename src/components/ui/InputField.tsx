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
	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;
}

interface TextareaFieldProps
	extends
		BaseFieldProps,
		Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
	as: 'textarea';
	leadingIcon?: never;
	trailingIcon?: never;
}

type FieldProps = InputFieldProps | TextareaFieldProps;

const inputBase = [
	'w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)]',
	'border border-[var(--color-outline-variant)] rounded-[var(--radius-md)]',
	'px-3 py-2 text-body-md placeholder:text-[var(--color-on-surface-variant)]',
	'transition-all duration-150',
	'focus:outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-[var(--color-secondary)]/20',
	'disabled:opacity-40 disabled:cursor-not-allowed',
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

	const wrapperClass = [
		'flex flex-col gap-1',
		fullWidth ? 'w-full' : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	if (props.as === 'textarea') {
		const {
			as: _as,
			leadingIcon: _l,
			trailingIcon: _t,
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
						className='text-label-md text-[var(--color-on-surface-variant)]'>
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
								: 'text-[var(--color-on-surface-variant)]',
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
		leadingIcon,
		trailingIcon,
		...rest
	} = props as InputFieldProps;

	return (
		<div className={wrapperClass}>
			{label && (
				<label
					htmlFor={fieldId}
					className='text-label-md text-[var(--color-on-surface-variant)]'>
					{label}
				</label>
			)}
			<div className='relative flex items-center'>
				{leadingIcon && (
					<span className='absolute left-3 text-[var(--color-on-surface-variant)] pointer-events-none'>
						{leadingIcon}
					</span>
				)}
				<input
					ref={ref as React.Ref<HTMLInputElement>}
					id={fieldId}
					className={[
						inputBase,
						hasError ? inputError : '',
						leadingIcon ? 'pl-9' : '',
						trailingIcon ? 'pr-9' : '',
					]
						.filter(Boolean)
						.join(' ')}
					aria-describedby={
						hint || error ? `${fieldId}-helper` : undefined
					}
					aria-invalid={hasError}
					{...rest}
				/>
				{trailingIcon && (
					<span className='absolute right-3 text-[var(--color-on-surface-variant)] pointer-events-none'>
						{trailingIcon}
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
							: 'text-[var(--color-on-surface-variant)]',
					].join(' ')}>
					{error ?? hint}
				</p>
			)}
		</div>
	);
});

InputField.displayName = 'InputField';

export default InputField;
