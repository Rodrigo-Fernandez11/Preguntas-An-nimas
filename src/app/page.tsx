import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Faltan las variables de entorno SUPABASE_URL o SUPABASE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default async function Home() {
  // Función para obtener las preguntas de la base de datos
  async function getQuestions() {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select()
        .order("id", { ascending: false })
        .limit(12);

      if (error) throw error;

      return data as { id: string; text: string }[];
    } catch (error) {
      console.error("Error al obtener las preguntas:", error);
      return [];
    }
  }

  // Función para manejar el envío del formulario
  async function handleSubmit(formData: FormData) {
    "use server";

    const question = formData.get("question")?.toString();
    if (!question) {
      console.warn("La pregunta está vacía o indefinida.");
      return;
    }

    const id = Date.now().toString();
    const { error } = await supabase
      .from("questions")
      .insert({ text: question, id });

    if (error) {
      console.error("Error al insertar la pregunta:", error);
      return;
    }

    revalidatePath("/");
    redirect(`/${id}`);
  }

  const questions = await getQuestions();

  return (
    <div className="grid gap-8">
      <form className="grid gap-4" action={handleSubmit}>
        <section className="grid">
          <p className="bg-pink-900 text-white p-4 rounded-t-lg text-xl font-medium">
            Preguntas
          </p>
          <input
            name="question"
            className="bg-white text-black p-4 rounded-b-lg text-xl "
            placeholder="me pregunto si....."
          />
        </section>
        <button
          type="submit"
          className="bg-pink-900 text-white rounded-lg p-4 text-xl transition-colors w-full hover:bg-pink-600"
        >
          Enviar pregunta
        </button>
      </form>
      <hr className="opacity-30" />
      <article className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {questions?.map((question) => (
          <Link href={`/${question.id}`} key={question.id} className="grid">
            <p className="bg-pink-900 text-white p-4 rounded-t-lg text-xl font-medium">
              Question
            </p>
            <p className="bg-white text-black p-4 rounded-b-lg text-xl ">
              {question.text}
            </p>
          </Link>
        ))}
      </article>
    </div>
  );
}
