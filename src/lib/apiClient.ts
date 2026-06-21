/**
 * Cliente HTTP base.
 *
 * Configura aquí tu instancia de Axios o el wrapper de fetch
 * para todas las llamadas a la API del backend.
 *
 * Instalar Axios (opcional):
 *   pnpm add axios
 */

// ── Ejemplo con Axios ────────────────────────────────────
// import axios from 'axios';
//
// export const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
//   timeout: 10_000,
//   headers: { 'Content-Type': 'application/json' },
// });
//
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// ── Wrapper fetch nativo ──────────────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
	const res = await fetch(`${BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json' },
		...options,
	});

	if (!res.ok) {
		const error = await res.text();
		throw new Error(error || `HTTP ${res.status}`);
	}

	return res.json() as Promise<T>;
}

export const apiClient = {
	get: <T>(path: string) => request<T>(path),
	post: <T>(path: string, body: unknown) =>
		request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
	patch: <T>(path: string, body: unknown) =>
		request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
	put: <T>(path: string, body: unknown) =>
		request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
	delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
