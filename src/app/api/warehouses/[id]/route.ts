import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');

	if (!companyId) {
		return NextResponse.json(
			{ error: 'company_id is required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('warehouses')
		.select('*')
		.eq('id', id)
		.eq('company_id', companyId)
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener el almacén',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');
	const body = await request.json();

	if (!companyId) {
		return NextResponse.json(
			{ error: 'company_id is required' },
			{ status: 400 },
		);
	}

	const { data, error } = await supabaseAgua
		.from('warehouses')
		.update(body)
		.eq('id', id)
		.eq('company_id', companyId)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al actualizar el almacén',
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
	const { id } = await params;
	const { searchParams } = new URL(request.url);
	const companyId = searchParams.get('company_id');

	if (!companyId) {
		return NextResponse.json(
			{ error: 'company_id is required' },
			{ status: 400 },
		);
	}

	const { error } = await supabaseAgua
		.from('warehouses')
		.delete()
		.eq('id', id)
		.eq('company_id', companyId);

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al eliminar el almacén',
			},
			{ status: 500 },
		);
	}

	return new NextResponse(null, { status: 204 });
}
