// Importamos la función "createClient" de la biblioteca "supabase-js"
import { createClient } from "@supabase/supabase-js";

// Importamos la función "revalidatePath" de la biblioteca "next/cache"
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

// Definimos la URL de nuestro servidor Supabase
const supabaseUrl = "https://wtvreeonwnukiuzuxmin.supabase.co";

// Obtenemos la clave de Supabase de las variables de entorno
const supabaseKey = process.env.SUPABASE_KEY!;

// Creamos un nuevo cliente de Supabase con la URL y la clave
const supabase = createClient(supabaseUrl, supabaseKey);

// Exportamos la función principal de la página
export default async function Home() {
  // Definimos una función asíncrona para obtener las preguntas de la base de datos
  async function getQuestions() {
    // Vamos a la tabla "questions" y seleccionamos todo
    const questions = await supabase
      .from("questions")
      .select()
      .then(({ data }) => data as { id: string; text: string }[]);
    return questions;
  }

  // Definimos una función asíncrona para manejar el envío del formulario
  async function handleSubmit(formData: FormData) {
    // Usamos el servidor
    "use server";

    // Obtenemos la pregunta del formulario
    const question = formData.get("question");
    const id = Date.now().toString();

    // Insertamos la pregunta en la tabla "questions"
    await supabase.from("questions").insert({ text: question, id });

    // Revalidamos la ruta "/"
    revalidatePath("/");
    redirect(`/${id}`);
  }

  // Obtenemos las preguntas
  const questions = await getQuestions();

  // Retornamos el componente principal de la página
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
        {questions.map((question) => (
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
