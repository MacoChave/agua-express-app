import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));

	// First, find the maintenance type for "retrolavado"
	const { data: types, error: typeError } = await supabase
		.from('maintenance_types')
		.select('id')
		.ilike('name', '%retrolavado%');

	if (typeError || !types || types.length === 0) {
		return NextResponse.json(null);
	}

	const typeIds = types.map((t: { id: number }) => t.id);

	let query = supabase
		.from('maintenance_tasks')
		.select('*')
		.in('maintenance_type_id', typeIds)
		.not('date', 'is', null);

	if (companyId) query = query.eq('company_id', companyId);
	if (warehouseId) query = query.eq('warehouse_id', warehouseId);

	// Get the most recent one in the past (already completed)
	const today = new Date().toISOString().split('T')[0];
	query = query
		.lte('date', today)
		.order('date', { ascending: false })
		.limit(1);

	const { data, error } = await query.single();

	if (error) {
		if (error.code === 'PGRST116') {
			// No rows found
			return NextResponse.json(null);
		}
		console.error('PGRST Error:', error);
		return NextResponse.json(null);
	}

	return NextResponse.json(data);
}
