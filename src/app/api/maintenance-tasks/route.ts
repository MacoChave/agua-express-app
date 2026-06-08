import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const equipmentId = searchParams.get('equipment_id');

	let query = supabase.from('maintenance_tasks').select('*');

	if (companyId) query = query.eq('company_id', companyId);
	if (warehouseId) query = query.eq('warehouse_id', warehouseId);
	if (equipmentId) query = query.eq('equipment_id', equipmentId);

	const { data, error } = await query.order('date', { ascending: false });

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener los registros de mantenimiento',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();

	if (!body.company_id || !body.warehouse_id || !body.equipment_id || !body.maintenance_type_id) {
		return NextResponse.json(
			{ error: 'company_id, warehouse_id, equipment_id and maintenance_type_id are required' },
			{ status: 400 },
		);
	}

	// Auto-generate serial_number
	if (!body.serial_number) {
		const { data: lastTask, error: fetchError } = await supabase
			.from('maintenance_tasks')
			.select('serial_number')
			.eq('company_id', body.company_id)
			.eq('warehouse_id', body.warehouse_id)
			.eq('equipment_id', body.equipment_id)
			.eq('maintenance_type_id', body.maintenance_type_id)
			.order('serial_number', { ascending: false })
			.limit(1)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') {
			return NextResponse.json(
				{ data: fetchError.code, error: 'Error al generar el número de serie' },
				{ status: 500 },
			);
		}

		body.serial_number = (lastTask?.serial_number || 0) + 1;
	}

	const { data, error } = await supabase
		.from('maintenance_tasks')
		.insert(body)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al registrar el mantenimiento',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data, { status: 201 });
}
