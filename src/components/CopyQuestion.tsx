"use client";

import { Toaster, toast } from "sonner";

// Definimos el componente 'CopyQuestion'
export const CopyQuestion = () => {
  // Definimos una función asíncrona 'handleClick' que se ejecutará cuando se haga clic en el botón
  async function handleClick() {
    // Hacemos una petición a la ruta '/opengraph-image' y obtenemos la imagen como un Blob
    const image = await fetch(`${location.pathname}/opengraph-image`).then(
      (res) => res.blob()
    );

    // Escribimos la imagen en el portapapeles del navegador
    await navigator.clipboard.write([
      new ClipboardItem({
        [image.type]: image,
      }),
    ]);

    // Mostramos una alerta indicando que la imagen ha sido copiada al portapapeles
    toast.success("Copiado en el portapapeles con exito");
  }

  // Renderizamos un botón que, al hacer clic, ejecuta la función 'handleClick'
  return (
    <div>
      <button
        className="bg-pink-900 text-white rounded-lg p-4 text-xl transition-colors w-full hover:bg-pink-600"
        type="button"
        onClick={handleClick}
      >
        Copiar al portapapeles
      </button>
      <Toaster position="top-center" />
    </div>
  );
};
