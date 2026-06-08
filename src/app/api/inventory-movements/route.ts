import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const warehouseId = searchParams.get('warehouse_id');
	const moveType = searchParams.get('move_type');

	let query = supabaseAgua.from('inventory_movements').select('*');

	if (companyId) query = query.eq('company_id', companyId);
	if (warehouseId) query = query.eq('warehouse_id', warehouseId);
	if (moveType) query = query.eq('move_type', moveType);

	const { data, error } = await query.order('created_at', { ascending: false });

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();

	// Basic validation
	if (!body.company_id || !body.warehouse_id || !body.move_type) {
		return NextResponse.json(
			{ error: 'company_id, warehouse_id and move_type are required' },
			{ status: 400 },
		);
	}

	// Logic to auto-generate serial_number if not provided
	if (!body.serial_number) {
		const { data: lastMove, error: fetchError } = await supabaseAgua
			.from('inventory_movements')
			.select('serial_number')
			.eq('company_id', body.company_id)
			.eq('warehouse_id', body.warehouse_id)
			.eq('move_type', body.move_type)
			.order('serial_number', { ascending: false })
			.limit(1)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') {
			// PGRST116 is "no rows found"
			return NextResponse.json({ error: fetchError.message }, { status: 500 });
		}

		body.serial_number = (lastMove?.serial_number || 0) + 1;
	}

	const { data, error } = await supabaseAgua
		.from('inventory_movements')
		.insert(body)
		.select()
		.single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json(data, { status: 201 });
}
