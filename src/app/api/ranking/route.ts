import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("profiles_scores")
    .select("*")
    .order("profile_name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Erro ao buscar ranking." },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
