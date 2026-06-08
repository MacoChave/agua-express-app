import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
	const {
		email,
		password,
		firstName,
		lastName,
		companyName,
		warehouseName,
		nit,
	} = await request.json();
	const supabase = await createClient();

	// 1. Sign up the user
	const { data: authData, error: authError } = await supabase.auth.signUp({
		email,
		password,
	});

	if (authError) {
		return NextResponse.json({ error: authError.message }, { status: 400 });
	}

	const userId = authData.user?.id;
	if (!userId) {
		return NextResponse.json(
			{ error: 'User creation failed' },
			{ status: 500 },
		);
	}

	// 2. Prepare Admin Client to bypass RLS during registration
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!serviceRoleKey) {
		return NextResponse.json(
			{
				error: 'SUPABASE_SERVICE_ROLE_KEY is missing on the server. Please add it to your .env file.',
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

	// 3. Create Company
	const { data: companyData, error: companyError } = await adminClient
		.from('companies')
		.insert({
			name: companyName,
			legal_name: companyName, // Default to name
			tax_id: nit || `CF`, // Use provided NIT or temporary
		})
		.select()
		.single();

	if (companyError) {
		return NextResponse.json(
			{ error: `Company creation failed: ${companyError.message}` },
			{ status: 500 },
		);
	}

	// 4. Create Warehouse
	const { data: warehouseData, error: warehouseError } = await adminClient
		.from('warehouses')
		.insert({
			company_id: companyData.id,
			name: warehouseName, // Default name
		})
		.select()
		.single();

	if (warehouseError) {
		return NextResponse.json(
			{ error: `Warehouse creation failed: ${warehouseError.message}` },
			{ status: 500 },
		);
	}

	// 5. Create Profile
	const { error: profileError } = await adminClient.from('profiles').insert({
		id: userId,
		company_id: companyData.id,
		warehouse_id: warehouseData.id,
		full_name: `${firstName} ${lastName}`,
		email: email,
		role: 'admin',
	});

	if (profileError) {
		return NextResponse.json(
			{ error: `Profile creation failed: ${profileError.message}` },
			{ status: 500 },
		);
	}

	return NextResponse.json(
		{ message: 'Registration successful' },
		{ status: 201 },
	);
}
