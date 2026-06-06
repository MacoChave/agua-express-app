import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Define aquí la estructura de tu base de datos para habilitar el tipado estricto (schema-bound).
 * Puedes generar estos tipos automáticamente con la CLI de Supabase:
 * `npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts`
 */
export type Database = {
  public: {
    Tables: {
      // Ejemplo de tabla:
      // usuarios: {
      //   Row: { id: string; nombre: string; created_at: string };
      //   Insert: { id?: string; nombre: string; created_at?: string };
      //   Update: { id?: string; nombre?: string; created_at?: string };
      // };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

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
export const getSupabaseClient = (): SupabaseClient<Database> => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// También exportamos una instancia singleton para uso general si se prefiere
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
