import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');

	let query = supabase.from('maintenance_schedules').select('*');

	if (companyId) query = query.eq('company_id', companyId);
	if (warehouseId) query = query.eq('warehouse_id', warehouseId);

	const { data, error } = await query;

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener la programación de mantenimientos',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();

	const { data, error } = await supabase
		.from('maintenance_schedules')
		.insert(body)
		.select()
		.single();

	if (error) {
		console.log({ error });

		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al crear la programación de mantenimiento',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const maintenanceTypeId = searchParams.get('maintenance_type_id');
	const equipmentId = searchParams.get('equipment_id');
	const body = await request.json();

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
		.update(body)
		.eq('equipment_id', equipmentId)
		.eq('company_id', companyId)
		.eq('warehouse_id', warehouseId)
		.eq('maintenance_type_id', maintenanceTypeId)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al actualizar la programación de mantenimiento',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}
