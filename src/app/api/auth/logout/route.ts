import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('selected_warehouse_id');
  return response;
}
