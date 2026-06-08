import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { email, password, fullName, role } = await request.json();
  const supabase = await createClient();

  // 1. Get current admin's company_id
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('company_id, role')
    .eq('id', user.id)
    .single();

  if (!adminProfile || adminProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can create users' }, { status: 403 });
  }

  // 2. Create the user in Auth (Requires Service Role)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json({ 
      error: 'SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env file to use this feature.' 
    }, { status: 500 });
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // 3. Create the profile for the new user
  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({
      id: authData.user.id,
      company_id: adminProfile.company_id,
      full_name: fullName,
      email: email,
      role: role || 'operator',
    });

  if (profileError) {
    return NextResponse.json({ error: `Profile creation failed: ${profileError.message}` }, { status: 500 });
  }

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}
