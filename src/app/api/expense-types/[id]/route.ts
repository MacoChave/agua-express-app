import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId || !warehouseId) {
		return NextResponse.json(
			{ error: 'company_id and warehouse_id are required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('expense_types')
		.select('*')
		.eq('expense_type', id)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener el tipo de gasto',
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
	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));
	const body = await request.json();
	body.warehouse_id = warehouseId;
	body.company_id = companyId;

	if (!companyId || !warehouseId) {
		return NextResponse.json(
			{ error: 'company_id and warehouse_id are required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('expense_types')
		.update(body)
		.eq('expense_type', id)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al actualizar el tipo de gasto',
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
	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId || !warehouseId) {
		return NextResponse.json(
			{ error: 'company_id and warehouse_id are required' },
			{ status: 400 },
		);
	}

	const { error } = await supabaseAgua
		.from('expense_types')
		.delete()
		.eq('expense_type', id)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId);

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al eliminar el tipo de gasto',
			},
			{ status: 500 },
		);
	}

	return new NextResponse(null, { status: 204 });
}
