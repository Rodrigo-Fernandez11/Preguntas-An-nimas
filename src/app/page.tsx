import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = "https://wtvreeonwnukiuzuxmin.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getQuestions() {
  // anda a la questions y selecciona todo
  const questions = await supabase
    .from("questions")
    .select()
    .then(({ data }) => data as { id: string; text: string }[]);
  return questions;
}

// funcion asincrona que recibe formData de tipo Formsata
async function handleSubmit(formData: FormData) {
  "use server";
  const question = formData.get("question");
  await supabase.from("questions").insert({ text: question });
  revalidatePath("/");
}

export default async function Home() {
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
        {questions.map((question) => (
          <section key={question.id} className="grid">
            <p className="bg-pink-900 text-white p-4 rounded-t-lg text-xl font-medium">
              Question
            </p>
            <p className="bg-white text-black p-4 rounded-b-lg text-xl ">
              {question.text}
            </p>
          </section>
        ))}
      </article>
    </div>
  );
}
