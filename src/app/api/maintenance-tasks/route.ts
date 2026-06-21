import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const equipmentId = searchParams.get('equipment_id');

	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));

	let query = supabase.from('maintenance_tasks').select('*');

	if (companyId) query = query.eq('company_id', companyId);
	if (warehouseId) query = query.eq('warehouse_id', warehouseId);
	if (equipmentId) query = query.eq('equipment_id', equipmentId);

	const { data, error } = await query.order('date', { ascending: false });

	if (error) {
		console.error('PGRST Error:', error);
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener los registros de mantenimiento',
			},
			{ status: 500 },
		);
	}

	// Fetch equipment and maintenance types manually to avoid PGRST200 on composite foreign keys
	if (data && data.length > 0) {
		const equipmentIds = [...new Set(data.map((t: any) => t.equipment_id))];
		const typeIds = [...new Set(data.map((t: any) => t.maintenance_type_id))];

		const [eqRes, typeRes] = await Promise.all([
			supabase.from('equipment').select('id, name').in('id', equipmentIds),
			supabase.from('maintenance_types').select('id, name').in('id', typeIds)
		]);

		const eqMap = new Map(eqRes.data?.map((e: any) => [e.id, e.name]) || []);
		const typeMap = new Map(typeRes.data?.map((t: any) => [t.id, t.name]) || []);

		const enrichedData = data.map((task: any) => ({
			...task,
			equipment: { name: eqMap.get(task.equipment_id) },
			maintenance_types: { name: typeMap.get(task.maintenance_type_id) }
		}));

		return NextResponse.json(enrichedData);
	}

	return NextResponse.json(data || []);
}

export async function POST(request: Request) {
	const body = await request.json();
	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));
	body.warehouse_id = warehouseId;
	body.company_id = companyId;

	if (
		!body.company_id ||
		!body.warehouse_id ||
		!body.equipment_id ||
		!body.maintenance_type_id
	) {
		return NextResponse.json(
			{
				error: 'company_id, warehouse_id, equipment_id and maintenance_type_id are required',
			},
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
				{
					data: fetchError.code,
					error: 'Error al generar el número de serie',
				},
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
