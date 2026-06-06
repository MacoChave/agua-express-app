import Link from 'next/link';
import { Button, Card, CardHeader, StatusChip } from '@/components/ui';

/* ── Datos estáticos ─────────────────────────────────────── */
const features = [
	{
		icon: '💧',
		title: 'Control de Pedidos',
		desc: 'Registra y da seguimiento a cada entrega de garrafones en tiempo real.',
	},
	{
		icon: '🔧',
		title: 'Gestión de Mantenimientos',
		desc: 'Programa y registra el mantenimiento de filtros y equipos de purificación.',
	},
	{
		icon: '📊',
		title: 'Reportes y Cuadre',
		desc: 'Genera reportes diarios de ventas, inventario y estado operativo.',
	},
	{
		icon: '🚰',
		title: 'Monitoreo de Calidad',
		desc: 'Visualiza en el panel los indicadores de calidad del agua y alertas del sistema.',
	},
];

const plans = [
	{
		name: 'Gratis',
		price: '$0',
		period: '',
		highlight: false,
		badge: null,
		features: [
			'1 Ruta',
			'Pedidos limitados a 100 / mes',
			'Gestión de mantenimientos',
		],
	},
	{
		name: 'Profesional',
		price: '$699',
		period: '/mes',
		highlight: true,
		badge: 'Más popular',
		features: [
			'Rutas ilimitadas',
			'Pedidos ilimitados',
			'Reportes avanzados',
			'Gestión de mantenimientos',
			'Soporte prioritario',
		],
	},
	{
		name: 'Básico',
		price: '$299',
		period: '/mes',
		highlight: false,
		badge: null,
		features: [
			'Hasta 3 rutas de reparto',
			'500 pedidos / mes',
			'Panel de control',
			'Soporte por correo',
		],
	},
];

const testimonials = [
	{
		name: 'Ramón Estrada',
		role: 'Dueño — AguaPura Monterrey',
		avatar: 'RE',
		comment:
			'Desde que usamos AguaExpress dejamos de perder pedidos. El panel de control es claro y mi equipo lo adoptó en un día.',
	},
	{
		name: 'Lucía Hernández',
		role: 'Administradora — HidroClear CDMX',
		avatar: 'LH',
		comment:
			'Los reportes de cuadre diario nos ahorraron horas de trabajo manual. Ahora cerramos el día en minutos.',
	},
	{
		name: 'Carlos Medina',
		role: 'Técnico de mantenimiento — AquaVida GDL',
		avatar: 'CM',
		comment:
			'Me avisa cuando toca cambiar filtros antes de que fallen. Hemos reducido a cero las quejas por sabor del agua.',
	},
];

/* ── Componente principal ────────────────────────────────── */
export default function HomePage() {
	return (
		<div
			className='min-h-screen font-sans'
			style={{
				backgroundColor: 'var(--color-background)',
				color: 'var(--color-on-background)',
			}}>
			{/* ── NAV ─────────────────────────────────────────── */}
			<header
				className='sticky top-0 z-50 border-b'
				style={{
					backgroundColor: 'var(--color-surface-container-lowest)',
					borderColor: 'var(--color-outline-variant)',
				}}>
				<div className='mx-auto max-w-6xl px-6 h-16 flex items-center justify-between'>
					<span
						className='text-headline-sm font-bold tracking-tight'
						style={{ color: 'var(--color-primary)' }}>
						💧 AguaExpress
					</span>
					<nav className='hidden md:flex items-center gap-8 text-body-sm font-medium'>
						{[
							'Características',
							'Precios',
							'Opiniones',
							'Contacto',
						].map((item) => (
							<a
								key={item}
								href={`#${item.toLowerCase()}`}
								className='transition-colors hover:opacity-70'
								style={{
									color: 'var(--color-on-surface-variant)',
								}}>
								{item}
							</a>
						))}
					</nav>
					<Link href='/login'>
						<Button variant='primary' size='sm'>
							Iniciar sesión
						</Button>
					</Link>
				</div>
			</header>

			{/* ── HERO ────────────────────────────────────────── */}
			<section
				className='py-24 px-6'
				style={{
					background:
						'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
				}}>
				<div className='mx-auto max-w-3xl text-center flex flex-col items-center gap-6'>
					<StatusChip
						status='operational'
						label='Sistema disponible 24/7'
						size='md'
					/>
					<h1
						className='text-headline-xl'
						style={{ color: 'var(--color-on-primary)' }}>
						Gestiona tu purificadora de agua sin complicaciones
					</h1>
					<p
						className='text-body-lg'
						style={{ color: 'var(--color-primary-fixed-dim)' }}>
						AguaExpress centraliza pedidos, mantenimientos, rutas de
						reparto y reportes en un solo panel diseñado para
						purificadoras de agua.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 mt-2'>
						<Link href='/login'>
							<Button
								size='lg'
								style={{
									backgroundColor: 'var(--color-on-primary)',
									color: 'var(--color-primary)',
								}}>
								Comenzar gratis →
							</Button>
						</Link>
						<a href='#caracteristicas'>
							<Button
								variant='ghost'
								size='lg'
								style={{
									color: 'var(--color-on-primary)',
									border: '1px solid rgba(255,255,255,0.35)',
								}}>
								Ver características
							</Button>
						</a>
					</div>
				</div>
			</section>

			{/* ── CARACTERÍSTICAS ─────────────────────────────── */}
			<section id='caracteristicas' className='py-20 px-6'>
				<div className='mx-auto max-w-6xl'>
					<div className='text-center mb-12'>
						<h2
							className='text-headline-lg'
							style={{ color: 'var(--color-on-surface)' }}>
							Todo lo que necesitas en un solo lugar
						</h2>
						<p
							className='text-body-lg mt-3'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Diseñado específicamente para el flujo operativo de
							una purificadora.
						</p>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						{features.map((f) => (
							<Card
								key={f.title}
								variant='default'
								padding='lg'
								hoverable>
								<div className='text-4xl mb-4'>{f.icon}</div>
								<h3
									className='text-headline-sm mb-2'
									style={{
										color: 'var(--color-on-surface)',
									}}>
									{f.title}
								</h3>
								<p
									className='text-body-sm'
									style={{
										color: 'var(--color-on-surface-variant)',
									}}>
									{f.desc}
								</p>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* ── PRECIOS ─────────────────────────────────────── */}
			<section
				id='precios'
				className='py-20 px-6'
				style={{
					backgroundColor: 'var(--color-surface-container-low)',
				}}>
				<div className='mx-auto max-w-5xl'>
					<div className='text-center mb-12'>
						<h2
							className='text-headline-lg'
							style={{ color: 'var(--color-on-surface)' }}>
							Planes para cada tamaño de negocio
						</h2>
						<p
							className='text-body-lg mt-3'
							style={{
								color: 'var(--color-on-surface-variant)',
							}}>
							Sin contratos forzosos. Cancela cuando quieras.
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch'>
						{plans.map((plan) => (
							<div
								key={plan.name}
								className='relative flex flex-col rounded-md overflow-hidden transition-shadow duration-200 hover:shadow-(--shadow-hover)'
								style={{
									backgroundColor: plan.highlight
										? 'var(--color-primary)'
										: 'var(--color-surface-container-lowest)',
									boxShadow: plan.highlight
										? 'var(--shadow-card)'
										: 'var(--shadow-ambient)',
									border: plan.highlight
										? 'none'
										: '1px solid var(--color-outline-variant)',
								}}>
								{plan.badge && (
									<div
										className='text-label-md text-center py-1.5'
										style={{
											backgroundColor:
												'var(--color-secondary-container)',
											color: 'var(--color-on-secondary-container)',
										}}>
										{plan.badge}
									</div>
								)}
								<div className='flex flex-col flex-1 p-8 gap-6'>
									<div>
										<p
											className='text-label-md mb-1'
											style={{
												color: plan.highlight
													? 'var(--color-primary-fixed-dim)'
													: 'var(--color-on-surface-variant)',
											}}>
											{plan.name}
										</p>
										<div className='flex items-baseline gap-1'>
											<span
												className='text-headline-xl'
												style={{
													color: plan.highlight
														? 'var(--color-on-primary)'
														: 'var(--color-on-surface)',
												}}>
												{plan.price}
											</span>
											<span
												className='text-body-md'
												style={{
													color: plan.highlight
														? 'var(--color-primary-fixed-dim)'
														: 'var(--color-on-surface-variant)',
												}}>
												{plan.period}
											</span>
										</div>
									</div>
									<ul className='flex flex-col gap-3 flex-1'>
										{plan.features.map((feat) => (
											<li
												key={feat}
												className='flex items-start gap-2 text-body-sm'
												style={{
													color: plan.highlight
														? 'var(--color-on-primary-container)'
														: 'var(--color-on-surface-variant)',
												}}>
												<span
													className='mt-0.5 shrink-0 text-xs'
													style={{
														color: plan.highlight
															? 'var(--color-secondary-container)'
															: 'var(--color-secondary)',
													}}>
													✔
												</span>
												{feat}
											</li>
										))}
									</ul>
									<Link href='/login' className='mt-auto'>
										<Button
											fullWidth
											variant={
												plan.highlight
													? 'ghost'
													: 'primary'
											}
											style={
												plan.highlight
													? {
															border: '1px solid rgba(255,255,255,0.4)',
															color: 'var(--color-on-primary)',
														}
													: undefined
											}>
											Empezar con {plan.name}
										</Button>
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── TESTIMONIOS ─────────────────────────────────── */}
			<section id='opiniones' className='py-20 px-6'>
				<div className='mx-auto max-w-5xl'>
					<div className='text-center mb-12'>
						<h2
							className='text-headline-lg'
							style={{ color: 'var(--color-on-surface)' }}>
							Lo que dicen nuestros clientes
						</h2>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{testimonials.map((t) => (
							<Card key={t.name} variant='outlined' padding='lg'>
								<CardHeader
									title={t.name}
									subtitle={t.role}
									action={
										<div
											className='w-10 h-10 rounded-full flex items-center justify-center text-label-md font-bold shrink-0'
											style={{
												backgroundColor:
													'var(--color-surface-container-high)',
												color: 'var(--color-primary)',
											}}>
											{t.avatar}
										</div>
									}
								/>
								<p
									className='text-body-sm'
									style={{
										color: 'var(--color-on-surface-variant)',
									}}>
									&ldquo;{t.comment}&rdquo;
								</p>
								<div className='mt-4 flex gap-0.5'>
									{Array.from({ length: 5 }).map((_, i) => (
										<span
											key={i}
											style={{
												color: 'var(--color-secondary-container)',
											}}>
											★
										</span>
									))}
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA FINAL ───────────────────────────────────── */}
			<section
				className='py-20 px-6 text-center'
				style={{ backgroundColor: 'var(--color-surface-container)' }}>
				<div className='mx-auto max-w-2xl flex flex-col items-center gap-6'>
					<h2
						className='text-headline-lg'
						style={{ color: 'var(--color-on-surface)' }}>
						¿Listo para simplificar tu operación?
					</h2>
					<p
						className='text-body-lg'
						style={{ color: 'var(--color-on-surface-variant)' }}>
						Crea tu cuenta en menos de 2 minutos. Sin tarjeta de
						crédito.
					</p>
					<Link href='/login'>
						<Button variant='primary' size='lg'>
							Crear cuenta gratis →
						</Button>
					</Link>
				</div>
			</section>

			{/* ── FOOTER ──────────────────────────────────────── */}
			<footer
				id='contacto'
				className='border-t py-12 px-6'
				style={{
					backgroundColor: 'var(--color-inverse-surface)',
					borderColor: 'var(--color-outline-variant)',
				}}>
				<div className='mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8'>
					<div className='flex flex-col gap-2 text-center md:text-left'>
						<span
							className='text-headline-sm font-bold'
							style={{
								color: 'var(--color-inverse-on-surface)',
							}}>
							💧 AguaExpress
						</span>
						<p
							className='text-body-sm'
							style={{ color: 'var(--color-outline)' }}>
							Sistema de gestión para purificadoras de agua
						</p>
					</div>

					<div className='flex flex-col items-center gap-1 text-center'>
						<p
							className='text-label-md'
							style={{ color: 'var(--color-outline)' }}>
							Desarrollado por
						</p>
						<p
							className='text-body-md font-medium'
							style={{ color: 'var(--color-inverse-primary)' }}>
							totto
						</p>
						<div className='flex gap-4 mt-2'>
							<a
								href='mailto:totto@dev.com'
								className='text-body-sm transition-opacity hover:opacity-70'
								style={{
									color: 'var(--color-primary-fixed-dim)',
								}}>
								✉ totto@dev.com
							</a>
							<a
								href='https://github.com/totto'
								target='_blank'
								rel='noopener noreferrer'
								className='text-body-sm transition-opacity hover:opacity-70'
								style={{
									color: 'var(--color-primary-fixed-dim)',
								}}>
								⌥ GitHub
							</a>
						</div>
					</div>

					<p
						className='text-body-sm'
						style={{ color: 'var(--color-outline)' }}>
						© {new Date().getFullYear()} AguaExpress. Todos los
						derechos reservados.
					</p>
				</div>
			</footer>
		</div>
	);
}
