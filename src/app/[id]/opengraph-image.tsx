// Importamos las clases y funciones necesarias de los módulos 'next/server' y '@supabase/supabase-js'
import { ImageResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Configuramos el segmento de ruta para que se ejecute en el borde (edge) y establecemos el tipo de contenido a 'image/png'
export const runtime = "edge";
export const contentType = "image/png";

// Definimos la URL de Supabase y la clave de Supabase
const supabaseUrl = "https://wtvreeonwnukiuzuxmin.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY!;
// Creamos un nuevo cliente de Supabase con la URL y la clave definidas
const supabase = createClient(supabaseUrl, supabaseKey);

// Definimos una función asíncrona para generar la imagen
export default async function Image({
  params: { id },
}: {
  params: { id: string };
}) {
  // Obtenemos la pregunta de la base de datos de Supabase utilizando el ID proporcionado
  const question = await supabase
    .from("questions")
    .select()
    .eq("id", id)
    .single()
    .then(({ data }) => data as { id: string; text: string });

  // Devolvemos una nueva respuesta de imagen con el JSX y las opciones proporcionadas
  return new ImageResponse(
    (
      // Elemento JSX de ImageResponse
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
          }}
        >
          {question.text}
        </div>
      </div>
    ),
    // Opciones de ImageResponse
    {
      width: 1200,
      height: 630,
    }
  );
}
