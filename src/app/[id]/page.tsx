import { CopyQuestion } from "@/components/CopyQuestion";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Función principal para la página de una pregunta específica
export default async function Questions({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Esperamos a que `params` se resuelva antes de usarlo
  const { id } = await params;

  const { data: question, error } = await supabase
    .from("questions")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener la pregunta:", error);
    return <div>Question not found</div>;
  }

  return (
    <article className="grid gap-4">
      <Link href="/">Volver atrás</Link>
      <section className="grid">
        <p className="bg-pink-900 text-white p-4 rounded-t-lg text-xl font-medium">
          Question
        </p>
        <p className="bg-white text-black p-4 rounded-b-lg text-xl ">
          {question?.text || "No se encontró la pregunta"}
        </p>
      </section>
      <CopyQuestion />
    </article>
  );
}
