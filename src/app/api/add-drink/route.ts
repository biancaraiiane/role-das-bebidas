import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const allowedDrinkTypes = [
  "drink",
  "cerveja",
  "whisky",
  "vinho",
  "espumante",
] as const;

type AllowedDrinkType = (typeof allowedDrinkTypes)[number];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const profileName = body?.profileName as string | undefined;
    const drinkType = body?.drinkType as AllowedDrinkType | undefined;

    if (!profileName || !drinkType) {
      return NextResponse.json(
        { error: "Perfil e bebida são obrigatórios." },
        { status: 400 }
      );
    }

    if (!allowedDrinkTypes.includes(drinkType)) {
      return NextResponse.json(
        { error: "Tipo de bebida inválido." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();

    const { data: currentRow, error: selectError } = await supabase
      .from("profiles_scores")
      .select("*")
      .eq("profile_name", profileName)
      .maybeSingle();

    if (selectError || !currentRow) {
      return NextResponse.json(
        { error: "Erro ao localizar perfil." },
        { status: 500 }
      );
    }

    const currentValue = Number(currentRow[drinkType] ?? 0);

    const { error: updateError } = await supabase
      .from("profiles_scores")
      .update({
        [drinkType]: currentValue + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("profile_name", profileName);

    if (updateError) {
      return NextResponse.json(
        { error: "Erro ao atualizar contagem." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro inesperado ao adicionar bebida." },
      { status: 500 }
    );
  }
}