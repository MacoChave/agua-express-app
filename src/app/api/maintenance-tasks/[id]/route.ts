import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id: serialNumber } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const equipmentId = searchParams.get('equipment_id');
	const maintenanceTypeId = searchParams.get('maintenance_type_id');

	if (!companyId || !warehouseId || !equipmentId || !maintenanceTypeId) {
		return NextResponse.json(
			{ error: 'Missing required composite key parameters' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from('maintenance_tasks')
		.select('*')
		.eq('serial_number', serialNumber)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('equipment_id', equipmentId)
		.eq('maintenance_type_id', maintenanceTypeId)
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener el registro de mantenimiento',
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
	const { id: serialNumber } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const equipmentId = searchParams.get('equipment_id');
	const maintenanceTypeId = searchParams.get('maintenance_type_id');
	const body = await request.json();

	if (!companyId || !warehouseId || !equipmentId || !maintenanceTypeId) {
		return NextResponse.json(
			{ error: 'Missing required composite key parameters' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from('maintenance_tasks')
		.update(body)
		.eq('serial_number', serialNumber)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('equipment_id', equipmentId)
		.eq('maintenance_type_id', maintenanceTypeId)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al actualizar el registro de mantenimiento',
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
	const equipmentId = searchParams.get('equipment_id');
	const maintenanceTypeId = searchParams.get('maintenance_type_id');

	if (!companyId || !warehouseId || !equipmentId || !maintenanceTypeId) {
		return NextResponse.json(
			{ error: 'Missing required composite key parameters' },
			{ status: 400 },
		);
	}

	const { error } = await supabase
		.from('maintenance_tasks')
		.delete()
		.eq('serial_number', serialNumber)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('equipment_id', equipmentId)
		.eq('maintenance_type_id', maintenanceTypeId);

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al eliminar el registro de mantenimiento',
			},
			{ status: 500 },
		);
	}

	return new NextResponse(null, { status: 204 });
}
