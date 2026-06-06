/**
 * Estado global de la aplicación.
 *
 * Opciones recomendadas:
 *   - Zustand  → pnpm add zustand
 *   - Jotai    → pnpm add jotai
 *   - Redux TK → pnpm add @reduxjs/toolkit react-redux
 *
 * Ejemplo con Zustand:
 *
 * import { create } from 'zustand';
 * import type { User } from '@/types';
 *
 * interface AuthStore {
 *   user: User | null;
 *   setUser: (user: User | null) => void;
 * }
 *
 * export const useAuthStore = create<AuthStore>((set) => ({
 *   user: null,
 *   setUser: (user) => set({ user }),
 * }));
 */
export {};
