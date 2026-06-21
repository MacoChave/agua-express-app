import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from './types';

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						request.cookies.set(name, value),
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options),
					);
				},
			},
			global: {
				fetch: (url, options) => {
					return fetch(url, { ...options, cache: 'no-store' });
				},
			},
		},
	);

	// refreshing the auth token
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// If we have a user, fetch their company and warehouse context
	if (user) {
		// Call a SECURITY DEFINER function to bypass RLS issues in the Edge runtime
		const { data, error } = await supabase.rpc('get_profile_by_id', {
			user_id: user.id,
		});

		console.log({ userId: user.id, data, error });

		if (error) {
			console.error('Error fetching profile:', error);
		}

		if (data) {
			const requestHeaders = new Headers(request.headers);

			if (data.company_id) {
				requestHeaders.set('x-company-id', data.company_id.toString());
			}
			if (data.warehouse_id) {
				requestHeaders.set(
					'x-warehouse-id',
					data.warehouse_id.toString(),
				);
			}

			// We need to return a new response with the modified headers
			// so the next step in the request chain sees them.
			const newResponse = NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			});

			// PRESERVE COOKIES: We must copy any cookies set during the session update
			// otherwise the user will lose their authenticated session.
			supabaseResponse.cookies.getAll().forEach((cookie) => {
				newResponse.cookies.set(cookie.name, cookie.value, cookie);
			});

			supabaseResponse = newResponse;
		}
	}

	return supabaseResponse;
}
