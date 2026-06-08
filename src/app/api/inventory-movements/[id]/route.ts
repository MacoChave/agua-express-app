import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id: serialNumber } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const moveType = searchParams.get('move_type');

	if (!companyId || !warehouseId || !moveType) {
		return NextResponse.json(
			{ error: 'company_id, warehouse_id and move_type are required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('inventory_movements')
		.select('*')
		.eq('serial_number', serialNumber)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('move_type', moveType)
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Error al obtener el movimiento de inventario',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id: serialNumber } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const moveType = searchParams.get('move_type');
	const body = await request.json();

	if (!companyId || !warehouseId || !moveType) {
		return NextResponse.json(
			{ error: 'company_id, warehouse_id and move_type are required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('inventory_movements')
		.update(body)
		.eq('serial_number', serialNumber)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('move_type', moveType)
		.select()
		.single();

	if (error) {
		console.log({ error });

		return NextResponse.json(
			{
				data: error.code,
				error: 'Error al actualizar el movimiento de inventario',
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
	const { id: serialNumber } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const moveType = searchParams.get('move_type');

	if (!companyId || !warehouseId || !moveType) {
		return NextResponse.json(
			{ error: 'company_id, warehouse_id and move_type are required' },
			{ status: 400 },
		);
	}

	const { error } = await supabaseAgua
		.from('inventory_movements')
		.delete()
		.eq('serial_number', serialNumber)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('move_type', moveType);

	if (error) {
		console.log({ error });
		return NextResponse.json(
			{
				data: error.code,
				error: 'Error al eliminar el movimiento de inventario',
			},
			{ status: 500 },
		);
	}

	return new NextResponse(null, { status: 204 });
}
