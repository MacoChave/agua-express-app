import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');

	if (!companyId || !warehouseId) {
		return NextResponse.json(
			{ error: 'company_id and warehouse_id are required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('equipment')
		.select('*')
		.eq('id', id)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener el equipo',
			},
			{ status: 404 },
		);
	}

	return NextResponse.json(data);
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const body = await request.json();

	if (!companyId || !warehouseId) {
		return NextResponse.json(
			{ error: 'company_id and warehouse_id are required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('equipment')
		.update(body)
		.eq('id', id)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al actualizar el equipo',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');

	if (!companyId || !warehouseId) {
		return NextResponse.json(
			{ error: 'company_id and warehouse_id are required' },
			{ status: 400 },
		);
	}

	const { error } = await supabaseAgua
		.from('equipment')
		.delete()
		.eq('id', id)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId);

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al eliminar el equipo',
			},
			{ status: 500 },
		);
	}

	return new NextResponse(null, { status: 204 });
}
