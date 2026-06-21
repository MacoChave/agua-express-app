import { NextResponse } from 'next/server';
import { supabaseAgua } from '@/lib/supabase';

export async function GET() {
	const { data, error } = await supabaseAgua.from('companies').select('*');

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al obtener las empresas',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data);
}

export async function POST(request: Request) {
	const body = await request.json();
	const { data, error } = await supabaseAgua
		.from('companies')
		.insert(body)
		.select()
		.single();

	if (error) {
		return NextResponse.json(
			{
				data: error.code,
				error: 'Ha ocurrido un error al crear la empresa',
			},
			{ status: 500 },
		);
	}

	return NextResponse.json(data, { status: 201 });
}
