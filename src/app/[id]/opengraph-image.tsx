import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const runtime = "edge";
export const contentType = "image/png";

export default async function Image({
  params: { id },
}: {
  params: { id: string };
}) {
  // Obtenemos la pregunta de Supabase
  const { data: question, error } = await supabase
    .from("questions")
    .select()
    .eq("id", id)
    .single();

  // Verificamos si `question` es nulo para evitar errores de renderizado
  const textContent = question?.text || "Pregunta no encontrada";

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            backgroundColor: "#831843",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <p>Question</p>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {textContent}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
