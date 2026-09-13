import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const search = searchParams.get('search') || '';
	const page = parseInt(searchParams.get('page') || '1', 10);
	const limit = parseInt(searchParams.get('limit') || '10', 10);
	const offset = (page - 1) * limit;

	const supabase = await createClient();
	let query = supabase
		.from('profiles')
		.select('*', { count: 'exact' });

	if (search) {
		query = query.ilike('full_name', `%${search}%`);
	}

	const { data: users, error, count } = await query
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ users, count });
}

export async function POST(request: Request) {
	const { email, password, fullName, role, warehouseId: bodyWarehouseId } = await request.json();

	// Get company and warehouse of headers x-warehouse-id and x-company-id
	const headerWarehouseId = Number(request.headers.get('x-warehouse-id'));
	const companyId = Number(request.headers.get('x-company-id'));
	const warehouseIdToAssign = bodyWarehouseId ? Number(bodyWarehouseId) : headerWarehouseId;

	const supabase = await createClient();

	// 1. Get current admin's company_id
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const { data: adminProfile } = await supabase
		.from('profiles')
		.select('company_id, role')
		.eq('id', user.id)
		.single();

	if (!adminProfile || (adminProfile as any).role !== 'admin') {
		return NextResponse.json(
			{ error: 'Only admins can create users' },
			{ status: 403 },
		);
	}

	// 2. Create the user in Auth (Requires Service Role)
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceRoleKey) {
		return NextResponse.json(
			{
				error: 'SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env file to use this feature.',
			},
			{ status: 500 },
		);
	}

	const adminClient = createAdminClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		serviceRoleKey,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	);

	const { data: authData, error: authError } =
		await adminClient.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
		});

	if (authError) {
		return NextResponse.json({ error: authError.message }, { status: 400 });
	}

	// 3. Create the profile for the new user
	const { error: profileError } = await adminClient.from('profiles').insert({
		id: authData.user.id,
		company_id: companyId,
		warehouse_id: warehouseIdToAssign,
		full_name: fullName,
		email: email,
		role: role || 'operator',
	});

	if (profileError) {
		return NextResponse.json(
			{ error: `Profile creation failed: ${profileError.message}` },
			{ status: 500 },
		);
	}

	return NextResponse.json(
		{ message: 'User created successfully' },
		{ status: 201 },
	);
}

export async function PUT(request: Request) {
	const { id, fullName, role, isActive, warehouseId: bodyWarehouseId } = await request.json();
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const { data: adminProfile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', user.id)
		.single();

	if (!adminProfile || (adminProfile as any).role !== 'admin') {
		return NextResponse.json(
			{ error: 'Only admins can edit users' },
			{ status: 403 },
		);
	}

	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceRoleKey) {
		return NextResponse.json(
			{ error: 'Missing service role key' },
			{ status: 500 },
		);
	}

	const adminClient = createAdminClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		serviceRoleKey,
		{
			auth: { autoRefreshToken: false, persistSession: false },
		},
	);

	const updatePayload: any = {
		full_name: fullName,
		role: role,
		is_active: isActive,
	};
	
	if (bodyWarehouseId) {
		updatePayload.warehouse_id = Number(bodyWarehouseId);
	}

	const { error } = await adminClient
		.from('profiles')
		.update(updatePayload)
		.eq('id', id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ message: 'User updated successfully' });
}
