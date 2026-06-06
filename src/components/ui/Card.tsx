import { HTMLAttributes, forwardRef } from 'react';

type CardVariant = 'default' | 'flat' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: CardVariant;
	padding?: 'none' | 'sm' | 'md' | 'lg';
	hoverable?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	subtitle?: string;
	action?: React.ReactNode;
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {}

const variantStyles: Record<CardVariant, string> = {
	default:
		'bg-[var(--color-surface-container-lowest)] shadow-[var(--shadow-card)]',
	flat: 'bg-[var(--color-surface-container-low)]',
	outlined:
		'bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]',
};

const paddingStyles = {
	none: '',
	sm: 'p-3',
	md: 'p-4',
	lg: 'p-6',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			variant = 'default',
			padding = 'md',
			hoverable = false,
			className = '',
			children,
			...props
		},
		ref,
	) => (
		<div
			ref={ref}
			className={[
				'rounded-[var(--radius-md)] overflow-hidden',
				variantStyles[variant],
				paddingStyles[padding],
				hoverable
					? 'transition-shadow duration-200 hover:shadow-[var(--shadow-hover)] cursor-pointer'
					: '',
				className,
			]
				.filter(Boolean)
				.join(' ')}
			{...props}>
			{children}
		</div>
	),
);

Card.displayName = 'Card';

const CardHeader = ({
	title,
	subtitle,
	action,
	className = '',
	...props
}: CardHeaderProps) => (
	<div
		className={['flex items-start justify-between gap-4 mb-4', className]
			.filter(Boolean)
			.join(' ')}
		{...props}>
		<div>
			<h3 className='text-headline-sm text-[var(--color-on-surface)]'>
				{title}
			</h3>
			{subtitle && (
				<p className='text-body-sm text-[var(--color-on-surface-variant)] mt-0.5'>
					{subtitle}
				</p>
			)}
		</div>
		{action && <div className='shrink-0'>{action}</div>}
	</div>
);

CardHeader.displayName = 'CardHeader';

const CardSection = ({
	className = '',
	children,
	...props
}: CardSectionProps) => (
	<div
		className={[
			'border-t border-[var(--color-outline-variant)] pt-4 mt-4',
			className,
		]
			.filter(Boolean)
			.join(' ')}
		{...props}>
		{children}
	</div>
);

CardSection.displayName = 'CardSection';

export { Card, CardHeader, CardSection };
export default Card;
