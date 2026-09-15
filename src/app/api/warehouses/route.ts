import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
	const supabase = await createClient();
	const companyId = Number(request.headers.get('x-company-id'));

	let query = supabase
		.from('warehouses')
		.select('*')
		.order('created_at', { ascending: true });

	if (companyId) {
		query = query.eq('company_id', companyId);
	}

	const { data, error } = await query;

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener los almacenes',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();
	const supabase = await createClient();

	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId) {
		return NextResponse.json(
			{ error: 'Company ID required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from('warehouses')
		.insert({
			name: body.name,
			address: body.address,
			company_id: companyId,
		} as unknown as never)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al crear el almacén',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
	const { id, name, address, is_active } = await request.json();
	const supabase = await createClient();
	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId || !id)
		return NextResponse.json(
			{ error: 'Company ID and Warehouse ID required' },
			{ status: 400 },
		);

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const { data: adminProfile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', user.id)
		.single();
	if (!adminProfile || (adminProfile as any).role !== 'admin') {
		return NextResponse.json(
			{ error: 'Only admins can edit warehouses' },
			{ status: 403 },
		);
	}

	const { error } = await supabase
		.from('warehouses')
		.update({ name, address, is_active })
		.eq('company_id', companyId)
		.eq('id', id);

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ message: 'Warehouse updated successfully' });
}
