import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
	const supabase = await createClient();
	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId) {
		const { data, error } = await supabaseAgua.from('companies').select('*');
		if (error) return NextResponse.json({ data: error.code, error: 'Ha ocurrido un error al obtener las empresas' }, { status: 500 });
		return NextResponse.json(data);
	}

	const { data, error } = await supabase.from('companies').select('*').eq('id', companyId).single();
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();
	const { data, error } = await supabaseAgua
		.from('companies')
		.insert(body as never)
		.select()
		.single();

	if (error) {
		return NextResponse.json({ data: error.code, error: 'Ha ocurrido un error al crear la empresa' }, { status: 500 });
	}
	return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
	const { name, legal_name, tax_id, currency } = await request.json();
	const supabase = await createClient();
	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId) return NextResponse.json({ error: 'Company ID required' }, { status: 400 });

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	
	const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
	if (!adminProfile || (adminProfile as any).role !== 'admin') {
		return NextResponse.json({ error: 'Only admins can edit company details' }, { status: 403 });
	}

	const { error } = await supabase
		.from('companies')
		.update({ name, legal_name, tax_id, currency })
		.eq('id', companyId);

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ message: 'Company updated successfully' });
}
