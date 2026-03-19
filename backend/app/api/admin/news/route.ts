import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { handleError } from '../../../../lib/errorHandler';
import { z } from 'zod';

// 1. DEFINE THE JSON BLOCK SCHEMA
const contentBlockSchema = z.array(
  z.object({
    type: z.enum(['paragraph', 'image', 'quote']),
    value: z.string().optional(), // Used for paragraphs and quotes
    url: z.string().url().optional(), // Used for images
    alt: z.string().optional(), // Used for images
    author: z.string().optional() // Used for quotes
  })
);

// 2. DEFINE THE FULL ARTICLE SCHEMA
const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional(),
  imageUrl: z.string().url().optional(),
  content: contentBlockSchema.optional().default([]) // Our new JSON array!
});

// Helper function to init Supabase
async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: { getAll() { return cookieStore.getAll() }, setAll() {} },
  });
}

// CREATE AN ARTICLE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the incoming JSON blocks!
    const validatedData = articleSchema.parse({
      ...body,
      // If the frontend doesn't send content, default to an empty array
      content: body.content || [] 
    });

    const supabase = await getSupabaseClient();

    // Securely get the logged-in admin's details
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw { status: 401, message: "Unauthorized" };

    const { data, error } = await supabase
      .from('newsletter')
      .insert([{
        title: validatedData.title,
        summary: validatedData.summary,
        author: user.email || user.id, 
        image_url: validatedData.imageUrl || null,
        content: validatedData.content, // Save the verified JSON array
        date: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Article published", data });
  } catch (error) {
    return handleError(error, "Admin Create Article");
  }
}

// UPDATE AN ARTICLE
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) throw { status: 400, message: "Article ID is required for updates." };

    const validatedData = articleSchema.parse({
       ...body,
       content: body.content || []
    });
    
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
      .from('newsletter')
      .update({
        title: validatedData.title,
        summary: validatedData.summary,
        image_url: validatedData.imageUrl,
        content: validatedData.content // Update the JSON array
      })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Article updated", data });
  } catch (error) {
    return handleError(error, "Admin Update Article");
  }
}

// DELETE AN ARTICLE
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) throw { status: 400, message: "Article ID is required for deletion." };

    const supabase = await getSupabaseClient();

    const { error } = await supabase
      .from('newsletter')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (error) {
    return handleError(error, "Admin Delete Article");
  }
}