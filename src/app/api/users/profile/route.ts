import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function PUT(request: Request) {
    try {
        const { firstName, lastName, email } = await request.json();
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const fullName = `${firstName} ${lastName}`.trim();

        // 1. Update email in Auth if changed
        if (email && email !== user.email) {
            const { error: authError } = await supabase.auth.updateUser({ email });
            if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // 2. Update profiles table
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (serviceRoleKey) {
            const adminClient = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                { auth: { autoRefreshToken: false, persistSession: false } }
            );
            
            const { error: profileError } = await adminClient
                .from('profiles')
                .update({ full_name: fullName, email: email })
                .eq('id', user.id);

            if (profileError) {
                 return NextResponse.json({ error: profileError.message }, { status: 400 });
            }
        } else {
            // Attempt with normal client if RLS is configured to allow it
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ full_name: fullName, email: email })
                .eq('id', user.id);
            
            if (profileError) {
                 return NextResponse.json({ error: profileError.message }, { status: 400 });
            }
        }

        return NextResponse.json({ message: 'Perfil actualizado con éxito' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
