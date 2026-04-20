import { NextResponse } from "next/server";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export async function GET() {
  const supabase = createBrowserSupabaseClient();

  const { data, error } = await supabase
    .from("profiles_scores")
    .select("*")
    .order("profile_name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Erro ao buscar ranking." },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}