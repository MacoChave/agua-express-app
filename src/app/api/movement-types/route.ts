import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');

	let query = supabaseAgua.from('movement_types').select('*');

	if (companyId) query = query.eq('company_id', companyId);
	if (warehouseId) query = query.eq('warehouse_id', warehouseId);

	const { data, error } = await query;

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener los tipos de movimiento',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();
	const { data, error } = await supabaseAgua
		.from('movement_types')
		.insert(body)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al crear el tipo de movimiento',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data, { status: 201 });
}
