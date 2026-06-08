import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');

	let query = supabaseAgua.from('warehouses').select('*');

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
	const { data, error } = await supabaseAgua
		.from('warehouses')
		.insert(body)
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
