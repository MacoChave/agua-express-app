/**
 * Tipos globales de la aplicación.
 *
 * Aquí van las interfaces que se comparten entre múltiples features:
 * respuestas HTTP genéricas, el modelo de Usuario, paginación, etc.
 */

/* ── Respuestas HTTP ─────────────────────────────────────── */
export interface ApiResponse<T> {
	data: T;
	message: string;
	success: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

/* ── Usuario autenticado ─────────────────────────────────── */
export interface User {
	id: string;
	nombre: string;
	email: string;
	rol: 'admin' | 'operador' | 'supervisor';
	avatarUrl?: string;
}

/* ── Filtros genéricos ───────────────────────────────────── */
export interface PaginationParams {
	page: number;
	pageSize: number;
}
