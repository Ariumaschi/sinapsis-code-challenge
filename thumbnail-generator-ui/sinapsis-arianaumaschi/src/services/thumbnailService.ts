interface UploadResponse {
  url: string;
  image: string; // Puedes ajustar este tipo según cómo quieres representar la imagen
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  // Simulamos el tiempo de espera como si se estuviera subiendo la imagen
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generamos una URL simulada para la imagen subida
  const mockUrl = `https://mockserver.com/thumbnails/${file.name}`;

  // Convertimos el archivo a una URL de objeto para mostrarlo como imagen
  const image = URL.createObjectURL(file);

  console.log('Mock URL generated:', mockUrl);

  return { url: mockUrl, image };
};
