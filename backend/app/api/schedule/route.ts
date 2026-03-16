import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    );

    // Using your 'league_schedule' view from the database schema
    const { data, count, error } = await supabase
      .from('league_schedule')
      .select('*', { count: 'exact' })
      .order('date', { ascending: true }) // Oldest/upcoming matches first
      .range(from, to);

    if (error) throw error;

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return NextResponse.json({
      success: true,
      data: data,
      meta: {
        total_items: count,
        total_pages: totalPages,
        current_page: page,
        items_per_page: limit
      }
    });

  } catch (error) {
    console.error("Schedule fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}