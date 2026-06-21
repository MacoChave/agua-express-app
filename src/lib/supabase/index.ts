import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

export * from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('Supabase credentials are missing in environment variables.');
}

/**
 * Retorna un cliente de Supabase con tipado de esquema (schema-bound).
 *
 * @returns SupabaseClient<Database>
 */
export const getSupabaseClient = (
	schema: string = 'public',
): SupabaseClient<Database> => {
	return createClient<Database>(supabaseUrl, supabaseAnonKey, {
		db: { schema: schema as any },
	}) as any;
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
// Instancia para compatibilidad (ahora apunta a public)
export const supabaseAgua = supabase;
