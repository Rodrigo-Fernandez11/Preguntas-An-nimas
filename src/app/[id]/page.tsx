import { CopyQuestion } from "@/components/CopyQuestion";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Questions({
  // Esta función toma un objeto como argumento
  // El objeto tiene una propiedad llamada 'params', que es otro objeto
  // El objeto 'params' tiene una propiedad llamada 'id', que es una cadena
  params: { id },
}: {
  params: { id: string };
}) {
  // Aquí estamos utilizando la biblioteca 'supabase' para interactuar con nuestra base de datos
  // 'from("questions")' selecciona la tabla 'questions' en la base de datos
  // 'select()' selecciona todas las columnas de la tabla 'questions'
  // 'eq("id", id)' filtra los resultados para incluir sólo las filas donde el 'id' es igual al 'id' proporcionado
  // 'single()' devuelve un solo registro (o fila) de la base de datos
  const { data: question } = await supabase
    .from("questions")
    .select()
    .eq("id", id)
    .single();

  // Aquí estamos comprobando si 'question' es nulo
  // Si 'question' es nulo, significa que no se encontró ninguna pregunta con el 'id' proporcionado en la base de datos
  if (!question) {
    // En este caso, devolvemos un elemento div con el texto 'Question not found'
    // Este será el resultado si no se encuentra ninguna pregunta con el 'id' proporcionado
    return <div>Question not found</div>;
  }

  // Si 'question' no es nulo, continua con la lógica
  return (
    <article className="grid gap-4">
      <Link href={"/"}>Volver atras</Link>
      <section className="grid">
        <p className="bg-pink-900 text-white p-4 rounded-t-lg text-xl font-medium">
          Question
        </p>
        <p className="bg-white text-black p-4 rounded-b-lg text-xl ">
          {question.text}
        </p>
      </section>
      <CopyQuestion />
    </article>
  );
}
