import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const equipmentId = searchParams.get('equipment_id');
	const maintenanceTypeId = searchParams.get('maintenance_type_id');

	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId || !warehouseId || !maintenanceTypeId || !equipmentId) {
		return NextResponse.json(
			{
				error: 'company_id, warehouse_id, equipment_id and maintenance_type_id are required',
			},
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from('maintenance_schedules')
		.select('*')
		.eq('equipment_id', equipmentId)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('maintenance_type_id', maintenanceTypeId)
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener la programación de mantenimiento',
			},
			{ status: 404 },
		);
	}

	return NextResponse.json(data);
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const maintenanceTypeId = searchParams.get('maintenance_type_id');
	const equipmentId = searchParams.get('equipment_id');

	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));

	if (!companyId || !warehouseId || !maintenanceTypeId || !equipmentId) {
		return NextResponse.json(
			{
				error: 'company_id, warehouse_id, equipment_id and maintenance_type_id are required',
			},
			{ status: 400 },
		);
	}

	const { error } = await supabase
		.from('maintenance_schedules')
		.delete()
		.eq('equipment_id', equipmentId)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('maintenance_type_id', maintenanceTypeId);

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al eliminar la programación de mantenimiento',
			},
			{ status: 500 },
		);
	}

	return new NextResponse(null, { status: 204 });
}
