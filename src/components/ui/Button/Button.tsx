import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-container)] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]',
	secondary:
		'bg-transparent text-[var(--color-primary)] border border-[var(--color-secondary)] hover:bg-[var(--color-surface-container-low)] active:bg-[var(--color-surface-container)]',
	ghost: 'bg-transparent text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)] active:bg-[var(--color-surface-container)]',
	danger: 'bg-[var(--color-error)] text-[var(--color-on-error)] hover:opacity-90 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]',
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-body-md',
	lg: 'px-6 py-3 text-body-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			loading = false,
			fullWidth = false,
			disabled,
			className = '',
			children,
			leftIcon = null,
			rightIcon = null,
			...props
		},
		ref,
	) => {
		const isDisabled = disabled || loading;

		return (
			<button
				ref={ref}
				disabled={isDisabled}
				className={[
					'inline-flex items-center justify-center gap-2 font-medium',
					'rounded-[var(--radius-md)] transition-all duration-150',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]',
					'disabled:opacity-40 disabled:cursor-not-allowed',
					variantStyles[variant],
					sizeStyles[size],
					fullWidth ? 'w-full' : '',
					className,
				]
					.filter(Boolean)
					.join(' ')}
				{...props}>
				{loading && (
					<span
						className='inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin'
						aria-hidden='true'
					/>
				)}
				{leftIcon && !loading && leftIcon}
				{children}
				{rightIcon && !loading && rightIcon}
			</button>
		);
	},
);

Button.displayName = 'Button';

export default Button;
