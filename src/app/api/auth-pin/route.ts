import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profileName = body?.profileName as string | undefined;
    const pin = body?.pin as string | undefined;

    if (!profileName || !pin) {
      return NextResponse.json(
        { error: "Perfil e PIN são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data, error } = await supabase
      .from("profile_access")
      .select("profile_name, pin")
      .eq("profile_name", profileName)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Erro ao validar PIN." },
        { status: 500 }
      );
    }

    if (!data || data.pin !== pin) {
      return NextResponse.json(
        { error: "PIN incorreto." },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro inesperado ao validar PIN." },
      { status: 500 }
    );
  }
}