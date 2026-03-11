import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // 1. Extract query parameters (e.g., ?page=1&limit=10)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 2. Calculate the pagination range for Supabase
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

    // 3. Fetch data WITH exact count metadata
    const { data, count, error } = await supabase
      .from('newsletter')
      .select('*', { count: 'exact' })
      .order('date', { ascending: false }) // Newest articles first
      .range(from, to);

    if (error) throw error;

    // 4. Calculate total pages
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
    console.error("News fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}