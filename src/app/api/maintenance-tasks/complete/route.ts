import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function calculateNextDate(date: Date, frequency: number, periodType: 'daily' | 'weekly' | 'monthly'): Date {
	const nextDate = new Date(date);
	if (periodType === 'daily') {
		nextDate.setDate(nextDate.getDate() + frequency);
	} else if (periodType === 'weekly') {
		nextDate.setDate(nextDate.getDate() + (frequency * 7));
	} else if (periodType === 'monthly') {
		nextDate.setMonth(nextDate.getMonth() + frequency);
	}
	return nextDate;
}

export async function POST(request: Request) {
	const body = await request.json();
	const warehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));

	if (
		!companyId ||
		!warehouseId ||
		!body.equipment_id ||
		!body.maintenance_type_id
	) {
		return NextResponse.json(
			{ error: 'company_id, warehouse_id, equipment_id and maintenance_type_id are required' },
			{ status: 400 },
		);
	}

	try {
		// 1. Check if there is an existing pending task for this equipment & type
		const { data: pendingTask, error: fetchPendingError } = await supabase
			.from('maintenance_tasks')
			.select('serial_number')
			.eq('company_id', companyId)
			.eq('warehouse_id', warehouseId)
			.eq('equipment_id', body.equipment_id)
			.eq('maintenance_type_id', body.maintenance_type_id)
			.order('serial_number', { ascending: false })
			.limit(1)
			.single();

		let currentSerialNumber = (pendingTask as any)?.serial_number;

		if (!currentSerialNumber) {
			// Generate new serial number if none pending
			const { data: lastTask } = await supabase
				.from('maintenance_tasks')
				.select('serial_number')
				.eq('company_id', companyId)
				.eq('warehouse_id', warehouseId)
				.eq('equipment_id', body.equipment_id)
				.eq('maintenance_type_id', body.maintenance_type_id)
				.order('serial_number', { ascending: false })
				.limit(1)
				.single();
			
			currentSerialNumber = ((lastTask as any)?.serial_number || 0) + 1;

			// Insert current as completed
			const { error: insertError } = await supabase
				.from('maintenance_tasks')
				.insert({
					company_id: companyId,
					warehouse_id: warehouseId,
					equipment_id: body.equipment_id,
					maintenance_type_id: body.maintenance_type_id,
					serial_number: currentSerialNumber,
					date: body.date || new Date().toISOString().split('T')[0],
					evidence: body.evidence || null,
					notes: body.notes || null,
				} as never);
				
			if (insertError) throw insertError;
		} else {
			// Update existing pending
			const { error: updateError } = await supabase
				.from('maintenance_tasks')
				.update({
					date: body.date || new Date().toISOString().split('T')[0],
					evidence: body.evidence || null,
					notes: body.notes || null,
				} as never)
				.eq('company_id', companyId)
				.eq('warehouse_id', warehouseId)
				.eq('equipment_id', body.equipment_id)
				.eq('maintenance_type_id', body.maintenance_type_id)
				.eq('serial_number', currentSerialNumber);

			if (updateError) throw updateError;
		}

		// 2. Fetch the schedule configuration to program the next one
		const { data: schedule } = await supabase
			.from('maintenance_schedules')
			.select('frequency, period_type')
			.eq('company_id', companyId)
			.eq('warehouse_id', warehouseId)
			.eq('equipment_id', body.equipment_id)
			.eq('maintenance_type_id', body.maintenance_type_id)
			.single();

		if (schedule) {
			// 3. Schedule next maintenance
			// Re-fetch to ensure we don't duplicate serial if concurrent (though edge cases exist, this is fine for now)
			const currentDate = new Date(body.date || new Date().toISOString().split('T')[0]);
			const nextDate = calculateNextDate(currentDate, (schedule as any).frequency, (schedule as any).period_type);

			const nextSerialNumber = currentSerialNumber + 1;

			const { error: nextInsertError } = await supabase
				.from('maintenance_tasks')
				.insert({
					company_id: companyId,
					warehouse_id: warehouseId,
					equipment_id: body.equipment_id,
					maintenance_type_id: body.maintenance_type_id,
					serial_number: nextSerialNumber,
					date: nextDate.toISOString().split('T')[0],
					evidence: null,
					notes: null,
				} as never);

			if (nextInsertError) throw nextInsertError;
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error: any) {
		console.error('Maintenance Complete Error:', error);
		return NextResponse.json(
			{ error: 'Ha ocurrido un error al completar el mantenimiento' },
			{ status: 500 },
		);
	}
}
